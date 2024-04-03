// console.log("Hello via Bun!");
import express from "express";
import path from "node:path";

const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
