export async function startgame() {
    const game = await fetch("/api/startgame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "keeles",
          password: "strongPassword2",
        }),
      });
      const response = await game.json();
      console.log("start game", response);
      if (!(response.gameStarted) && response.round_id) {
        const cg = await currentgame();
        console.log("cg", cg)
        return cg;
      }
}

export async function currentgame() {
    const game = await fetch("/api/currentgame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await game.json();
      return response;
}