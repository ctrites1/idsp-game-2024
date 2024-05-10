import express, { Request, Response } from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { cards, Card } from "./database";

async function createServer() {
	const app = express();
	const port = 3000;

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	app.use(express.static(path.join(__dirname, "../client/dist"))); // Serve files from dist folder

	// test route to make sure api calls working
	app.get("/api/hello", async (req: Request, res: Response) => {
		res.json({ hello: "world" });
	});

	app.get("/api/playerhand", async (req: Request, res: Response) => {
		const element = "Water";
		const filteredCards = cards.filter((card) => card.element === element);
		const randomHand = pickRandomCards(filteredCards, 7);
		res.json(randomHand);
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
