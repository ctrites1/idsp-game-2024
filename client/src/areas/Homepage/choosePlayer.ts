import { getHandData } from "../Arena/cardArena";
import { startgame } from "../Arena/game";
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
	const oppName = document.querySelector(".oppName") as HTMLDivElement;
	oppName.textContent = opponent;
	const oppPic = document.querySelector("#oppDisplayPic") as HTMLImageElement;
	oppPic.src = oppProfileImgSrc;

	const playerName = document.querySelector(".playerName") as HTMLDivElement;
	playerName.textContent = username;
	const playerPic = document.querySelector("#displayPic") as HTMLImageElement;
	playerPic.src = profileImgSrc;
}

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
	if (userResponse.success) {
		await loginSuccess();
		const roundState = await startgame();
		await getHandData(roundState.data);
		await addPlayerDetailsToArena(
			"Player 1",
			"/assets/update/displayPic.png",
			"Player 2",
			"/assets/update/oppPic.png"
		);

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
		await loginSuccess();
		const roundState = await startgame();
		await getHandData(roundState.data);
		await addPlayerDetailsToArena(
			"Player 2",
			"/assets/update/oppPic.png",
			"Player 1",
			"/assets/update/displayPic.png"
		);
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
