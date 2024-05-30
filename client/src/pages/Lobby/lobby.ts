import { error } from "console";
import { getHandData } from "../Arena/cardArena";
import { startgame } from "../Arena/game";
import { addPlayerDetailsToArena, logout } from "../Homepage/choosePlayer";
import { addRouteToBtn, emptyBody } from "../routing";

interface Player {
	player_id: number;
	username: string;
}

// TODO: make interface for leaderboard data
// leaderboard: [ { username: string, matches_won: number }]

interface playerStat {
	username: string;
	matches_won: number;
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

	const playerTableContainer = document.createElement("div") as HTMLDivElement;
	playerTableContainer.classList.add("players-table-container");
	playerTableContainer.appendChild(playersTable);

	return playerTableContainer;
};

const createLobbyHeader = () => {
	const header = document.createElement("header");
	header.classList.add("lobby-header");
	const headerBtnDiv = document.createElement("div");
	headerBtnDiv.classList.add("header-btns");

	const logoutBtn = document.createElement("button");
	logoutBtn.classList.add("logout-button");
	logoutBtn.addEventListener("click", async () => {
		await logout();
	});

	headerBtnDiv.appendChild(logoutBtn);
	header.appendChild(headerBtnDiv);
	return header;
};

const getLeaderboardData = async () => {
	const res = await fetch("/api/players");
	const { success, currentUserId, leaderboard } = await res.json();
	if (success) {
		return { success: true, currentUserId: currentUserId, data: leaderboard };
	} else {
		return { success: false, error: "Could not retrieve leaderboard data" };
	}
};

const createLeaderboard = async () => {
	const leaderboardContainer = document.createElement("div");
	leaderboardContainer.classList.add("leaderboard-container");

	const title = document.createElement("h1");
	title.textContent = "Leaderboard";
	leaderboardContainer.appendChild(title);

	const leaderboardTable = document.createElement("table");
	leaderboardTable.classList.add("leaderboard-table");
	leaderboardContainer.appendChild(leaderboardTable);

	const thead = document.createElement("thead");
	thead.innerHTML = `
	  <tr>
		<th>Player</th>
		<th>Games Won</th>
	  </tr>
	`;
	leaderboardTable.appendChild(thead);

	const tbody = document.createElement("tbody");
	try {
		const leaderboardData = await getLeaderboardData();
		if (!leaderboardData.success) {
			throw leaderboardData.error;
		} else {
			leaderboardData.data.forEach((playerStat: playerStat) => {
				const player = document.createElement("td");
				player.innerText = playerStat.username;

				const matchesWon = document.createElement("td");
				matchesWon.innerText = playerStat.matches_won.toString();

				const newRow = document.createElement("tr") as HTMLTableRowElement;
				newRow.appendChild(player);
				newRow.appendChild(matchesWon);
				tbody.appendChild(newRow);
			});
		}
	} catch (err) {
		console.error(err);
	}
	leaderboardTable.appendChild(tbody);

	return leaderboardContainer;
};

export const showLobbyPage = async () => {
	await emptyBody();
	const body = document.querySelector("body") as HTMLBodyElement;
	if (body.querySelector("lobby-container")) {
		return;
	}
	const lobbyContainer = document.createElement("div") as HTMLDivElement;
	const playersTable = await generatePlayersTable();
	const leaderboardContainer = await createLeaderboard();

	lobbyContainer.classList.add("lobby-container");
	lobbyContainer.appendChild(createLobbyHeader());

	const playerTableAndLeaderboardContainer = document.createElement(
		"div"
	) as HTMLDivElement;
	playerTableAndLeaderboardContainer.classList.add(
		"player-table-leaderboard-container"
	);

	playerTableAndLeaderboardContainer.appendChild(playersTable);
	playerTableAndLeaderboardContainer.appendChild(leaderboardContainer);
	lobbyContainer.appendChild(playerTableAndLeaderboardContainer);

	body.appendChild(lobbyContainer);
};
