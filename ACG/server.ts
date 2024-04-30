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
    res.sendFile("src/areas/Arena/arena.html", {root: "."});
  });

  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}

createServer();
