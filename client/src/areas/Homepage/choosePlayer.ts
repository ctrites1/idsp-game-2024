import { getHandData } from "../Arena/cardArena";
import { startgame } from "../Arena/game";
import { createArenaPage } from "../Arena/mainArena";
import { removeHomepage } from "./homepage";

export async function loginSuccess() {
  await removeHomepage();
  await createArenaPage();
}

export async function loginAsPlayer1() {
  const user = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "keeles",
      password: "strongPassword2",
    }),
  });
  const userResponse = await user.json();
  if (userResponse.success) {
    const roundState = await startgame();
    console.log("roundstate: ", roundState);
    await loginSuccess();
    await getHandData(roundState.data);
    return;
  }
}

export async function loginAsPlayer2() {
  const user = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "potat",
      password: "strongPassword1",
    }),
  });
  const userResponse = await user.json();
  if (userResponse.success) {
    await loginSuccess();
    const roundState = await startgame();
    console.log("roundstate: ", roundState);
    await getHandData(roundState.data);
    return;
  }
}

export async function logout() {
  const logout = await fetch("/api/logout");
  const loggedOut = await logout.json();
  if (loggedOut.success) {
    return true;
  }
  return false;
}
