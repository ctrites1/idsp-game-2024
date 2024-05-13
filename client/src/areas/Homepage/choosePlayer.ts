import {getCardData} from "../Arena/Card";

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
  console.log(userResponse);
  if (userResponse.success) {
    removeBigDiv();
    await getCardData();
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
    removeBigDiv();
    await getCardData();
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
