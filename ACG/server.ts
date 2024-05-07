import express, {Request, Response} from "express";
import {cards, Card} from "./database";
import {createInitialHand, startGame, checkForExistingGame} from "./databaseAccess";

async function createServer() {
  const app = express();
  const port = 3000;

  // test route to make sure api calls working
  app.get("/api/hello", async (req: Request, res: Response) => {
    res.json({hello: "world"});
  });

  app.post("/api/playerhand", async (req: Request, res: Response) => {
    const params = {
      player: req.body.player_id,
      round: req.body.round_id,
      choice: req.body.player_deck_choice,
    };
    const hand = await createInitialHand(params.choice, params.round, params.player);
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
    const newRoundID = await startGame(3, 4);
    res.json({gameStarted: true, round_id: newRoundID});
  });

  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}

createServer();
