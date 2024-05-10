import express, {Request, Response} from "express";
import path from "path";
import {dirname} from "path";
import {fileURLToPath} from "url";
import {cards, Card} from "./database";
import {
  createInitialHand,
  startGame,
  checkForExistingGame,
  getRoundState,
  logMove,
  getCurrentHand,
  test,
  validateUser,
} from "../server/databaseAccess";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

async function createServer() {
  const app = express();
  const port = 3000;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(path.join(__dirname, "../client/dist"))); // Serve files from dist folder
  app.use(express.json());
  app.use(
    cookieSession({
      name: "session",
      keys: ["ACG-Secret-Key"],
      maxAge: 24 * 60 * 60 * 1000,
    })
  );

  // test route to make sure api calls working
  app.get("/api/hello", async (req: Request, res: Response) => {
    const playerId = req.session?.playerId;
    console.log(playerId);
    res.json({hello: "world"});
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    const {username, password} = req.body;
    const valid = await validateUser(username, password);
    if (!valid.success) {
      res.json({success: false, playerId: null});
      return;
    }
    req.session = {playerId: valid.playerId};
    res.json({success: true, playerId: valid.playerId});
  });

  app.get("/api/logout", async (req: Request, res: Response) => {
    if (req.session) {
      req.session = null;
      res.json({success: true, message: "Logged out"});
      return;
    }
    res.json({success: false, message: "No session found, logout failed"});
  });

  const data = await test();
  console.log(data);

  app.post("/api/playerhand", async (req: Request, res: Response) => {
    if (!req.session?.playerId) {
      res.json({success: false, data: "Session Error - could not authenticate player"});
      return;
    }
    const params = {
      player: req.session.playerId,
      round: req.body.round_id,
      choice: req.body.player_deck_choice,
    };
    const hand = await getCurrentHand(params.player, params.round);
    if (!hand.success) {
      const newHand = await createInitialHand(params.choice, params.round, params.player);
      res.json(newHand);
      return;
    }
    res.json(hand);
  });

  app.post("/api/startgame", async (req: Request, res: Response) => {
    if (!req.session?.playerId) {
      res.json({gameStarted: false, message: "Session Error - could not authenticate player"});
      return;
    }
    const players = {
      player1: req.session.playerId,
      player2: req.body.player_2_id,
    };
    const currentGame = await checkForExistingGame(players.player1, players.player2);
    if (currentGame.gameExists) {
      res.json({gameStarted: false, round_id: currentGame.round_id});
      return;
    }
    const newRoundID = await startGame(players.player1, players.player2);
    res.json({gameStarted: true, round_id: newRoundID});
  });

  app.post("/api/currentgame", async (req: Request, res: Response) => {
    if (!req.session?.playerId) {
      res.json({success: false, data: "Session Error - could not authenticate player"});
      return;
    }
    const players = {
      player: req.session.playerId,
      opponent: req.body.player_2_id,
    };
    const currentGame = await checkForExistingGame(players.player, players.opponent);
    if (!currentGame.gameExists) {
      res.json({gameExists: false});
      return;
    }
    const roundState = await getRoundState(players.player, players.opponent, currentGame.round_id);
    if (!roundState?.success) {
      res.json({gameState: false, data: roundState.data});
      return;
    }
    res.json({gameState: true, data: roundState.data});
  });

  app.post("api/logmove", async (req: Request, res: Response) => {
    if (!req.session?.playerId) {
      res.json({success: false, data: "Session Error - could not authenticate player"});
      return;
    }
    const move = {
      roundId: req.body.roundId,
      cardId: req.body.cardId,
      trenchPos: req.body.trenchPos,
      playerId: req.session.playerId,
    };
    const moveLogged = await logMove(move.roundId, move.cardId, move.trenchPos, move.playerId);
    if (!moveLogged.success) {
      res.json({success: false, data: "Error logging move"});
      return;
    }
    res.json({success: true, data: "Move logged"});
  });

  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
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
