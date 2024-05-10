import express, { Request, Response } from "express";
import { Card } from "../client/database";
import path from "path";

// interface Player {
// 	id: number;
// 	name: string;
// 	hand: Card[];
// 	trench: Card[];
//   }

//   interface Round {
// 	numround: number;
// 	player: Player;
//   }
  
//   interface GameState {
// 	players: Player[];
// 	currentPlayer: number;
// 	round: Round[];
//   }

//   let gameState: GameState = {
// 	players: [
// 	  { id: 1, name: 'Player 1', hand: [], trench: [] },
// 	  { id: 2, name: 'Player 2', hand: [], trench: [] }
// 	],
// 	currentPlayer: 1,
// 	round: [],
//   };

let cards: Card[] = [];

let player1 = {
	id: 1,
	name: "Player1",
	hand: cards,
	trench: cards,
}

let player2 = {
	id: 2,
	name: "Player2",
	hand: cards,
	trench: cards,
}

let score = {
	player1score: [],
	player2score: [],
}

let gamestate = {
		id: 1,
		players: [player1, player2],
		// player1Move: [],
		// player2Move: [],
		currentPlayer: 1,
		round: 0,
		turn: 1,
		score: score,
}

async function createServer() {
	const app = express();
	const port = 3000;

	app.use(express.static(path.join(__dirname, "../client/dist"))); // Serve files from dist folder

	// test route to make sure api calls working
	app.get("/api/hello", async (req: Request, res: Response) => {
		res.json({ hello: "world" });
	});

	app.get("/api/playerhand", async (req: Request, res: Response) => {
		const playerId = parseInt(req.body.playerId);
		const element = "Water";

		let playerdata = gamestate.players.find(player => player.id === playerId)

		if (playerdata?.hand.length === 0) {
			const filteredCards = cards.filter(card => card.element === element);
    		playerdata.hand = pickRandomCards(filteredCards, 7);
		}
		res.json(playerdata);
	});

	app.post('/api/playerhand', (req, res) => {
		const { playerId } = req.body;
		const player = gamestate.players.find(p => p.id === playerId);
		if (!player) return res.status(404).json({ error: 'Player not found' });
		res.json({ player, gamestate });
	});

	app.post("/api/turn", async (req: Request, res: Response) => {
		const { playerId, card } = req.body;
		if (gamestate.currentPlayer !== playerId) {
			return res.status(400).json({ error: 'Not your turn' });
		}

		const player = gamestate.players.find(p => p.id === playerId);

		if (player) {
			if (gamestate.turn % 6 === 0) {
				if(gamestate.round != 3){

					player.trench = []
					gamestate.round =+ 1;
				}
			}
			const cardIndex = player.hand.indexOf(card);
			if (cardIndex !== -1) {
			player.trench.push(card);
			player.hand.splice(cardIndex, 1);
			res.json({ success: true });
			} else {
			res.status(400).json({ error: 'Card not found' });
			}
		} else {
			res.status(404).json({ error: 'Player not found' });
		}
	})

	app.post('/api/endTurn', (req, res) => {
		const { playerId } = req.body;
		if (gamestate.currentPlayer !== playerId) {
		  return res.status(400).json({ error: 'Not your turn' });
		}
	  
		gamestate.currentPlayer = gamestate.currentPlayer === 1 ? 2 : 1;
		gamestate.turn++;
		res.json({ success: true, gamestate });
	});

	app.get('/api/status', (req, res) => {
		res.json({ gamestate });
	});
	  
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
	});

	app.listen(port, "0.0.0.0", () => {
		console.log(`Server running on http://localhost:${port}`);
	});
}

function pickRandomCards(cards: Card[], count: number): Card[] {
	for (let i = cards.length - 1; i > 0; i--) {
	  const j = Math.floor(Math.random() * (i + 1));
	  [cards[i], cards[j]] = [cards[j], cards[i]];
	}
	return cards.slice(0, count);
  }

createServer();
