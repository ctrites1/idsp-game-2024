import { createArenaPage } from "./areas/Arena/mainArena";
import { loginAsPlayer1 } from "./areas/Homepage/choosePlayer";
import { createHomepage } from "./areas/Homepage/homepage";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5173", {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

socket.on("message", async (data) => {
  console.log(data);
  if (typeof data === "string") {
    console.log("UPDATING");
    //! await loginAsPlayer1();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await createHomepage();
    socket.send("YOOOOO");
  } catch (error) {
    console.error("Error during page initialization:", error);
  }
});
