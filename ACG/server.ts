import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";

const port = 5173;

async function createServer() {
	const app = express();
	const vite = await createViteServer({
		server: { middlewareMode: true },
		appType: "custom",
	});

	app.use(vite.middlewares);
	app.use(express.static(path.join(__dirname, "public")));

	app.get("/", async (req: Request, res: Response) => {
		res.sendFile("src/areas/Arena/arena.html", { root: "." });
	});

	app.listen(port, () => {
		console.log(`server listening on port ${port}`);
	});
}

createServer();
