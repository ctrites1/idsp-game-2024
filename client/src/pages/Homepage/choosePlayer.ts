import { getHandData } from "../Arena/cardArena";
import { startgame } from "./../Arena/game";
import { createArenaPage } from "../Arena/mainArena";
import { removeHomepage } from "./homepage";

export async function loginSuccess() {
	await removeHomepage();
	await createArenaPage();
}

async function addPlayerDetailsToArena(
	username: string,
	profileImgSrc: string,
	opponent: string,
	oppProfileImgSrc: string
) {
	// can use username to set attribute for hills
	const oppName = document.querySelector(".oppName") as HTMLDivElement;
	oppName.textContent = opponent;
	const oppPic = document.querySelector("#oppDisplayPic") as HTMLImageElement;
	oppPic.src = oppProfileImgSrc;

	const playerName = document.querySelector(".playerName") as HTMLDivElement;
	playerName.textContent = username;
	const playerPic = document.querySelector("#displayPic") as HTMLImageElement;
	playerPic.src = profileImgSrc;
}

export async function register(username: string, email: string, password: string) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
    }),
  });

  const result = await response.json();

  if (result.success) {
		await loginSuccess();
		const roundState = await startgame();
		const currentPlayer = roundState.data.player_2_username;
		const currentOpponent = roundState.data.player_1_username;
		await getHandData(roundState.data);
		await addPlayerDetailsToArena(
			currentPlayer,
			"/assets/update/displayPic.png",
			currentOpponent,
			"/assets/update/oppPic.png"
		);
		return;
	}
}

export async function login(username: string, password: string) {
	const user = await fetch("/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: username,
			password: password,
		}),
	});
	const userResponse = await user.json();
	console.log("user response", userResponse)
	if (userResponse.success) {
		await loginSuccess();
		const roundState = await startgame();
		const currentPlayer = roundState.data.player_2_username;
		const currentOpponent = roundState.data.player_1_username;
		await getHandData(roundState.data);
		await addPlayerDetailsToArena(
			currentPlayer,
			"/assets/update/displayPic.png",
			currentOpponent,
			"/assets/update/oppPic.png"
		);
		return;
	}
}

// export async function loginAsPlayer2() {
// 	const user = await fetch("/api/login", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			username: "potat",
// 			password: "strongPassword1",
// 		}),
// 	});
// 	const userResponse = await user.json();
// 	if (userResponse.success) {
// 		await loginSuccess();
// 		const roundState = await startgame();
// 		const currentPlayer = roundState.data.player_1_username;
// 		const currentOpponent = roundState.data.player_2_username;
// 		await getHandData(roundState.data);
// 		await addPlayerDetailsToArena(
// 			currentPlayer,
// 			"/assets/update/oppPic.png",
// 			currentOpponent,
// 			"/assets/update/displayPic.png"
// 		);
// 		return;
// 	}
// }

export async function logout() {
	const logout = await fetch("/api/logout");
	const loggedOut = await logout.json();
	if (loggedOut.success) {
		return true;
	}
	return false;
}
