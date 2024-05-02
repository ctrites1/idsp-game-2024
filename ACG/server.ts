import express, {Request, Response} from "express";

async function createServer() {
  const app = express();
  const port = 3000;

  // test route to make sure api calls working
  app.get("/api/hello", async (req: Request, res: Response) => {
    res.json({hello: "world"});
  });

  app.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}

createServer();
