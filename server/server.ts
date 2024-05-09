import express, { Request, Response } from "express";
import { cards, Card } from "../client/database";
import path from "path";

async function createServer() {
	const app = express();
	const port = 3000;

	app.use(express.static(path.join(__dirname, "../client/dist")));

	// test route to make sure api calls working
	app.get("/api/hello", async (req: Request, res: Response) => {
		res.json({ hello: "world" });
	});

	app.get("/api/playerhand", async (req: Request, res: Response) => {
		const element = "Water";
		const hand = cards.filter((card) => {
			return card.element === element;
		});
		res.json(hand);
	});

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
	});

	app.listen(port, "0.0.0.0", () => {
		console.log(`Server running on http://localhost:${port}`);
	});
}

createServer();
