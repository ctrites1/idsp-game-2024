export async function addPlayerDetailsToArena(
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

export async function register(
  username: string,
  email: string,
  password: string
) {
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
    // const roundState = await startgame();
    // const currentPlayer = roundState.data.player_2_username;
    // const currentOpponent = roundState.data.player_1_username;
    // await getHandData(roundState.data);
    // await addPlayerDetailsToArena(
    // 	currentPlayer,
    // 	"/assets/update/displayPic.png",
    // 	currentOpponent,
    // 	"/assets/update/oppPic.png"
    // );
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
  if (userResponse.success) {
    // const roundState = await startgame();
    // console.log(roundState, "more testing!!!");
    // const currentPlayer = roundState.data.player_2_username;
    // const currentOpponent = roundState.data.player_1_username;
    // console.log(currentPlayer, currentOpponent, "testing!!");
    // await getHandData(roundState.data);
    // await addPlayerDetailsToArena(
    // 	currentPlayer,
    // 	"/assets/update/displayPic.png",
    // 	currentOpponent,
    // 	"/assets/update/oppPic.png"
    // );
    // history.pushState(null, "", "/lobby");
    window.location.href = "/lobby";
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
