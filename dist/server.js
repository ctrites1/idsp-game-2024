import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { cards } from "./database";
async function createServer() {
    const app = express();
    const port = 3000;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    app.use(express.static(path.join(__dirname, "../client/dist"))); // Serve files from dist folder
    // test route to make sure api calls working
    app.get("/api/hello", async (req, res) => {
        res.json({ hello: "world" });
    });
    app.get("/api/playerhand", async (req, res) => {
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
