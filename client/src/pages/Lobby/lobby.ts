import { emptyBody } from "../routing";

interface Player {
	// TODO: make sure Player interface matches what's being returned from db
	id: number;
	username: string;
}

const generatePlayersList = async (): Promise<HTMLDivElement> => {
	const playersListDiv = document.createElement("div") as HTMLDivElement;
	playersListDiv.classList.add("players-list");

	// const players = await // TODO: array of players from db
	// players.forEach((player) => { // TODO: get loggedInPlayerId from session
	// 	const playerButton = document.createElement("button");
	// 	playerButton.textContent = player.username;
	// 	playerButton.classList.add("player-button");

	// if (
	// 	player.id === loggedInPlayerId ||
	// 	player.inGameWith.includes(loggedInPlayerId)
	// ) {
	// 	playerButton.classList.add("disabled");
	// 	playerButton.disabled = true;
	// } else {
	// 	playerButton.addEventListener("click", () => {
	// 		alert(`You clicked on ${player.username}`);
	// 	});
	// }

	// 	playersListDiv.appendChild(playerButton);
	// });
	return playersListDiv;
};
/* 
	* Other buttons/UI stuff: 
	- Logout
	- players that current User is in a game with
	- players that they are NOT in a game with
*/

export const showLobbyPage = async () => {
	await emptyBody();
	const body = document.querySelector("body") as HTMLBodyElement;
	const playersList = await generatePlayersList();
	body.appendChild(playersList);
};
