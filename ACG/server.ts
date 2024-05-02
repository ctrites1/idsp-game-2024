import express, {Request, Response} from "express";
import {createServer as createViteServer} from "vite";

async function createServer() {
  const app = express();
  const port = 3000;

  // test route to make sure api calls working
  app.get("/api/hello", async (req, res) => {
    res.json({hello: "world"});
  });

  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}

createServer();
