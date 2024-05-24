import { getHandData } from "../Arena/cardArena";
import { currentgame, startgame } from "../Arena/game";
import { addPlayerDetailsToArena } from "../Homepage/choosePlayer";
import { addRouteToBtn, emptyBody } from "../routing";

interface Player {
  player_id: number;
  username: string;
}

interface otherPlayer extends Player {
  inGameWithUser: boolean;
}

interface Game {
  is_completed: number;
  match_id: number;
  player_1_id: number;
  player_1_username: string;
  player_2_id: number;
  player_2_username: string;
}

const getPlayerData = async () => {
  const res = await fetch("/api/players");
  const { success, currentUserId, players } = await res.json();
  console.log(players);
  if (success) {
    const allPlayers: Player[] = players.players.filter((player: Player) => {
      if (player.player_id !== currentUserId) {
        return player;
      }
    });
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
