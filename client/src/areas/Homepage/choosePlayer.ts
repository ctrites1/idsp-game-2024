import { getCardData } from "../Arena/cardArena";
import { startgame } from "../Arena/game";

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
  console.log("user respomse", userResponse);
  if (userResponse.success) {
    const roundState = await startgame();
    console.log("roundstate", roundState);
    await getCardData(roundState.data);
    removeBigDiv();
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
    const roundState = await startgame();
    getCardData(roundState);
    removeBigDiv();
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

function removeBigDiv() {
  const bigDiv = document.querySelector(".pseudo-homepage") as HTMLDivElement;
  bigDiv.remove();
}
