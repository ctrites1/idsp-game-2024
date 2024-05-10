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
} from "../server/databaseAccess";
import bodyParser from "body-parser";
import exp from "constants";

async function createServer() {
  const app = express();
  const port = 3000;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  app.use(express.static(path.join(__dirname, "../client/dist"))); // Serve files from dist folder
  app.use(express.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // test route to make sure api calls working
  app.get("/api/hello", async (req: Request, res: Response) => {
    res.json({hello: "world"});
  });

  const data = await test();
  console.log(data);

  app.post("/api/playerhand", async (req: Request, res: Response) => {
    const params = {
      player: req.body.player_id,
      round: req.body.round_id,
      choice: req.body.player_deck_choice,
    };
    console.log(params);
    const hand = await getCurrentHand(params.player, params.round);
    if (!hand.success) {
      const newHand = await createInitialHand(params.choice, params.round, params.player);
      res.json(newHand);
      return;
    }
    res.json(hand);
  });

  app.post("/api/startgame", async (req: Request, res: Response) => {
    const players = {
      player1: req.body.player_1_id,
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
    const players = {
      player: req.body.player_1_id,
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
    const move = {
      roundId: req.body.roundId,
      cardId: req.body.cardId,
      trenchPos: req.body.trenchPos,
      playerId: req.body.playerId,
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

createServer();
