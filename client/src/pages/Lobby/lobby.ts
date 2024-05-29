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

		return { currentUserId: currentUserId, allPlayers: allPlayers };
	}
};

const generatePlayersTable = async (): Promise<HTMLDivElement> => {
	const { currentUserId, allPlayers } = (await getPlayerData()) as {
		currentUserId: any;
		allPlayers: Player[];
	};

	const playersTable = document.createElement("table") as HTMLTableElement;
	playersTable.classList.add("players-table");
	const tableHeading = document.createElement("thead");
	tableHeading.innerText = "All Users";
	const row1 = document.createElement("tr");
	row1.appendChild(tableHeading);
	playersTable.appendChild(row1);

	allPlayers.forEach(async (player: Player) => {
		const playerButton = document.createElement("button");
		playerButton.textContent = player.username;
		playerButton.classList.add("player-button");

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

		const newRow = document.createElement("tr");
		const data = document.createElement("td");
		data.appendChild(playerButton);
		newRow.appendChild(data);

		playersTable.appendChild(newRow);
	});
	return playersTable;
};
/* 
	TODO: Logout button
*/

export const showLobbyPage = async () => {
	await emptyBody();
	const body = document.querySelector("body") as HTMLBodyElement;
	const playersTable = await generatePlayersTable();
	const lobbyDiv = document.createElement("div") as HTMLDivElement;
	lobbyDiv.classList.add("lobby-container");
	lobbyDiv.appendChild(playersTable);

	body.appendChild(lobbyDiv);
};
