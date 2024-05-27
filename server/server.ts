import express, { Request, Response } from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import {
	createInitialHand,
	startGame,
	checkForExistingGame,
	getRoundState,
	logMove,
	getCurrentHand,
	test,
	validateUser,
	countTotalMoves,
	getLatestOppMove,
	getAllPlayers,
	getExistingGames,
	createPlayer,
	getLobbyData,
	getUsernameById,
} from "../server/databaseAccess";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import { Server, Socket } from "socket.io";
import http from "node:http";

export default interface CardIn {
	card_id: number;
	name: string;
	power: number;
	element: number;
	unit_type: number;
	support_type: number | null;
	[key: string]: any; // Index signature to allow dynamic properties
}

interface NewHandResponse {
	success: boolean;
	hand: CardIn[] | null;
}

async function createServer() {
	const app = express();
	const port = 3000;

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.static(path.join(__dirname, "../client/dist"))); // Serve files from dist folder
	app.use(express.json());
	app.use(
		cookieSession({
			name: "session",
			keys: ["ACG-Secret-Key"],
			maxAge: 24 * 60 * 60 * 1000,
		})
	);
	app.use(
		cors({
			origin: ["http://localhost:3000", "https://idsp-game-2024.onrender.com"],
			credentials: true,
		})
	);

	// test route
	app.get("/api/hello", async (req: Request, res: Response) => {
		const playerId = req.session?.playerId;
		res.json({ hello: "world" });
	});

	const server = http.createServer(app);

	const io = new Server(server, {
		cors: {
			origin: ["http://localhost:3000", "https://idsp-game-2024.onrender.com"],
			credentials: true,
		},
	});

	io.listen(server);

	io.on("connection", (socket) => {
		socket.on("message", async (...arg) => {
			if (typeof arg[1] === "number") {
				const newMove = await getLatestOppMove(arg[1]);
				socket.broadcast.emit("update", newMove);
			}
		});
	});

	app.post("/api/login", async (req: Request, res: Response) => {
		const { username, password } = req.body;
		const valid = await validateUser(username, password);
		if (!valid.success) {
			res.json({ success: false, playerId: null });
			return;
		}
		req.session = { playerId: valid.playerId };

		res.json({ success: true, playerId: valid.playerId });
	});

	app.get("/api/logout", async (req: Request, res: Response) => {
		if (req.session) {
			req.session = null;
			res.json({ success: true, message: "Logged out" });
			return;
		}
		res.json({ success: false, message: "No session found, logout failed" });
	});

	const data = await test();
	console.log(data);

	app.post("/api/register", async (req: Request, res: Response) => {
		const { username, email, password } = req.body;

		try {
			const result: any = await createPlayer({ username, email, password });

			if (result) {
				req.session = { playerId: result.data[0].player_id };
			}

			res.json(result);
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "An error occurred during registration.",
			});
		}
	});

	app.post("/api/playerhand", async (req: Request, res: Response) => {
		if (!req.session?.playerId) {
			res.json({
				success: false,
				data: "Session Error - could not authenticate player",
			});
			return;
		}
		const params = {
			player: req.session.playerId,
			round: req.body.round_id,
			choice: req.body.player_deck_choice,
		};
		const hand: NewHandResponse = await getCurrentHand(
			params.player,
			params.round
		);
		if (hand.hand?.length === 0) {
			const newHand = await createInitialHand(
				params.choice,
				params.player,
				params.round
			);
			if (!newHand || !newHand.hand || newHand.hand.length === 0) {
				console.error("Failed to create new hand or no cards found.");
				return [];
			}
			res.json(newHand);
			return;
		}

		if (!hand || !hand.hand || hand.hand.length === 0) {
			console.error("Failed to find hand or no cards found.");
			return [];
		}

		res.json(hand);
		return;
	});

	app.post("/api/startgame", async (req: Request, res: Response) => {
		if (!req.session?.playerId) {
			res.json({
				gameStarted: false,
				message: "Session Error - could not authenticate player",
			});
			return;
		}

		const players = {
			player1: req.session.playerId,
			player2: req.body.oppId,
		};
		const currentGame = await checkForExistingGame(
			players.player1,
			players.player2
		);
		if (currentGame.gameExists) {
			res.json({
				gameStarted: false,
				round_id: currentGame.round_id,
				oppId: players.player2,
				playerId: players.player1,
			});
			return;
		}
		const newRoundID = await startGame(players.player1, players.player2);
		res.json({
			gameStarted: true,
			round_id: newRoundID,
			oppId: players.player2,
			playerId: players.player1,
			round: 1,
		});
	});

	app.post("/api/currentgame", async (req: Request, res: Response) => {
		if (!req.session?.playerId) {
			res.json({
				success: false,
				data: "Session Error - could not authenticate player",
			});
			return;
		}

		const players = {
			player: req.session.playerId,
			opponent: req.body.oppId,
		};
		const currentGame = await checkForExistingGame(
			players.player,
			players.opponent
		);
		if (!currentGame.gameExists) {
			res.json({ gameExists: false });
			return;
		}
		const roundState: any = await getRoundState(
			players.player,
			players.opponent,
			currentGame.round_id
		);

		const player1Username = await getUsernameById(players.player);
		const player2Username = await getUsernameById(players.opponent);

		roundState.data.player_1_username = player1Username.username.username;
		roundState.data.player_2_username = player2Username.username.username;
		if (!roundState?.success) {
			res.json({
				gameState: false,
				data: roundState.data,
				oppID: players.opponent,
				round: currentGame.round,
			});
			return;
		}
		res.json({
			gameState: true,
			data: roundState.data,
			oppID: players.opponent,
			round: currentGame.round,
		});
	});

	app.post("/api/logmove", async (req: Request, res: Response) => {
		if (!req.session?.playerId) {
			res.json({
				success: false,
				data: "Session Error - could not authenticate player",
			});
			return;
		}
		const move = {
			roundId: req.body.roundId,
			cardId: req.body.cardId,
			trenchPos: req.body.trenchPos,
			playerId: req.session.playerId,
			winnerId: req.body.winner_id,
		};
		const moveLogged = await logMove(
			move.roundId,
			move.cardId,
			move.trenchPos,
			move.playerId
		);
		if (!moveLogged.success) {
			res.json({ success: false });
			return;
		}
		const isRoundOver = await countTotalMoves(move.roundId, move.winnerId);
		if (isRoundOver?.gameOver) {
			res.json({
				success: true,
				gameOver: true,
				data: isRoundOver.data,
				gameWinner: isRoundOver.gameWinner,
			});
			return;
		}
		if (isRoundOver?.newRound) {
			res.json({ success: true, roundOver: true, data: isRoundOver.data });
			return;
		}
		res.json({ success: true });
	});

	app.get("/api/players", async (req, res) => {
		if (!req.session?.playerId) {
			res.json({
				success: false,
				data: "Session Error - could not authenticate player",
			});
			return;
		}
		const playerId = req.session.playerId;
		const response = await getLobbyData(playerId);
		res.json(response);
	});
	app.use("*", express.static(path.join(__dirname, "../client/dist")));

	server.listen(port, "0.0.0.0", () => {
		console.log(`server running on http://0.0.0.0:${port}`);
	});
}

createServer();
