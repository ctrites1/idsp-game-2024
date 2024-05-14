import { loginAsPlayer1, loginAsPlayer2 } from "./choosePlayer";

export async function createHomepage() {
	const body = document.querySelector("body") as HTMLBodyElement;
	const homepage: HTMLDivElement = document.createElement("div");

	homepage.className = "pseudo-homepage";

	const btn1: HTMLButtonElement = document.createElement("button");
	btn1.className = "player-select player1-btn";

	const btn2: HTMLButtonElement = document.createElement("button");
	btn2.className = "player-select player2-btn";

	const player1Img: HTMLImageElement = document.createElement("img");
	const player2Img: HTMLImageElement = document.createElement("img");

	const player1Label: HTMLHeadingElement = document.createElement("h1");
	const player2Label: HTMLHeadingElement = document.createElement("h1");
	player1Label.textContent = "Player 1";
	player2Label.textContent = "Player 2";

	btn1.appendChild(player1Img);
	btn1.appendChild(player1Label);
	btn2.appendChild(player2Img);
	btn2.appendChild(player2Label);

	const playerBtnDiv: HTMLDivElement = document.createElement("div");
	playerBtnDiv.className = "player-selection-container";

	btn1.addEventListener("click", loginAsPlayer1);
	btn2.addEventListener("click", loginAsPlayer2);

	playerBtnDiv.appendChild(btn1);
	playerBtnDiv.appendChild(btn2);
	homepage.appendChild(playerBtnDiv);

	body.appendChild(homepage);
}

export async function removeHomepage() {
	const homepage = document.querySelector(".pseudo-homepage") as HTMLDivElement;
	homepage.remove();
}
