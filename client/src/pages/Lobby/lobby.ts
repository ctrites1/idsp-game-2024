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
	const row1 = document.createElement("tr");
	const headCell = document.createElement("th");
	headCell.innerText = "Players";
	row1.appendChild(headCell);
	tableHeading.appendChild(row1);
	playersTable.appendChild(tableHeading);

	allPlayers.forEach(async (player: Player) => {
		const playerButton = document.createElement("button");
		const span = document.createElement("span");
		span.textContent = player.username;
		playerButton.appendChild(span);
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

const createLobbyHeader = () => {};

/* 
	TODO: 
	- Logout button
	- Header
	- Leaderboard
*/

export const showLobbyPage = async () => {
	await emptyBody();
	const body = document.querySelector("body") as HTMLBodyElement;
	if (body.querySelector("lobby-container")) {
		return;
	}
	const playersTable = await generatePlayersTable();
	const lobbyDiv = document.createElement("div") as HTMLDivElement;
	lobbyDiv.classList.add("lobby-container");
	lobbyDiv.appendChild(playersTable);

	body.appendChild(lobbyDiv);
};
