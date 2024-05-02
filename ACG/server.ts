import express, {Request, Response} from "express";
import {createServer as createViteServer} from "vite";
import {fileURLToPath} from "url";
import path from "node:path";

const port = 5173;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const vite = await createViteServer({
    server: {middlewareMode: true},
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", async (req: Request, res: Response) => {
    // Change this to home page/login later
    res.sendFile("src/areas/Arena/arena.html", {root: "."});
  });

  app.get("/play", async (req: Request, res: Response) => {
    res.sendFile("src/areas/Arena/arena.html", {root: "."});
  });

  app.get("/instructions", async (req: Request, res: Response) => {
    // Change this to how to page later
    res.send("How to play");
  });

  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}

createServer();
