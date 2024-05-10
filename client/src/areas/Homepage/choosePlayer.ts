const player1Button = document.querySelector(".player1-btn");
const player2Button = document.querySelector(".player2-btn");

player1Button?.addEventListener("click", loginAsPlayer1);
player2Button?.addEventListener("click", loginAsPlayer2);

async function loginAsPlayer1() {
  const user = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      username: "keeles",
      password: "strongPassword2",
    }),
  });
  const userResponse = await user.json();
  if (userResponse.success) {
    removeBigDiv();
    return;
  }
}

async function loginAsPlayer2() {
  const user = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      username: "potat",
      password: "strongPassword1",
    }),
  });
  const userResponse = await user.json();
  if (userResponse.success) {
    removeBigDiv();
    return;
  }
}

function removeBigDiv() {
  const bigDiv = document.querySelector("pseudo-homepage") as HTMLDivElement;
  bigDiv.remove();
}
