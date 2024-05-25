import { getHandData } from "../Arena/cardArena";
import { startgame } from "../Arena/game";
import { addPlayerDetailsToArena } from "../Homepage/choosePlayer";
import { addRouteToBtn, emptyBody } from "../routing";

interface Player {
	player_id: number;
	username: string;
}

const getPlayerData = async () => {
	const res = await fetch("/api/players");
	const { success, currentUserId, players } = await res.json();
	if (success) {
		const allPlayers: Player[] = players.players.filter((player: Player) => {
			if (player.player_id !== currentUserId) {
				return player;
			}
		});

		console.log("c u", currentUserId);
		return { currentUserId: currentUserId, allPlayers: allPlayers };
	}
};

const generatePlayersList = async (): Promise<HTMLDivElement> => {
	const { currentUserId, allPlayers } = (await getPlayerData()) as {
		currentUserId: any;
		allPlayers: Player[];
	};

	const playersListDiv = document.createElement("div") as HTMLDivElement;
	playersListDiv.classList.add("players-list");

	allPlayers.forEach(async (player: Player) => {
		const playerButton = document.createElement("button");
		playerButton.textContent = player.username;
		playerButton.classList.add("player-button");
		console.log(player);

		playerButton.addEventListener("click", async () => {
			const roundState = await startgame(currentUserId, player.player_id);
			const currentPlayer = roundState.data.player_1_username;
			const currentOpponent = roundState.data.player_2_username;
			await getHandData(roundState.data);
			await addPlayerDetailsToArena(
				currentPlayer,
				"/assets/update/displayPic.png",
				currentOpponent,
				"/assets/update/oppPic.png"
			);
		});
		await addRouteToBtn(playerButton, "/arena");
		playersListDiv.appendChild(playerButton);
	});
	console.log(playersListDiv);
	return playersListDiv;
};
/* 
	TODO: Logout button
*/

export const showLobbyPage = async () => {
	await emptyBody();
	const body = document.querySelector("body") as HTMLBodyElement;
	const playersList = await generatePlayersList();
	body.appendChild(playersList);
};
