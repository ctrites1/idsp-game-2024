import express, { Request, Response } from "express";
import { cards, Card } from "./database";

async function createServer() {
  const app = express();
  const port = 3000;

  // test route to make sure api calls working
  app.get("/api/hello", async (req: Request, res: Response) => {
    res.json({ hello: "world" });
  });

  app.get("/api/playerhand", async (req: Request, res: Response) => {
    const element = "Water";
    const filteredCards = cards.filter(card => card.element === element);
    const randomHand = pickRandomCards(filteredCards, 7);
    res.json(randomHand);
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

