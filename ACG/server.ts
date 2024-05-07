import express, {Request, Response} from "express";
import {cards, Card} from "./database";
import {getDeck} from "./databaseAccess";

async function createServer() {
  const app = express();
  const port = 3000;

  // test route to make sure api calls working
  app.get("/api/hello", async (req: Request, res: Response) => {
    res.json({hello: "world"});
  });

  app.get("/api/playerhand", async (req: Request, res: Response) => {
    const hand = await getDeck(1);
    res.json(hand);
  });

  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}

createServer();
