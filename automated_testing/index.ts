// console.log("Hello via Bun!");
import express from "express";

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  // const result = cardCombat() ? "Success" : "Failed";
  res.send("Success");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
