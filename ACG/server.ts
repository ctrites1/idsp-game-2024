import express, {Request, Response} from "express";
import {createServer as createViteServer} from "vite";

const port = 5173;

async function createServer() {
  const app = express();
  const vite = await createViteServer({
    server: {middlewareMode: true},
    appType: "custom",
  });
  app.use(vite.middlewares);

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
