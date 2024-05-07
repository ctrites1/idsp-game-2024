import { database } from "./databaseConnection";
import bcrypt from "bcrypt";

export async function getHand(deckID: number) {
	try {
		const deckChoice = deckID;
		let getDeck = `
    SELECT card.name, power FROM card
    WHERE card.element_id = :deckChoice AND card.unit_type_id IS NOT NULL
    LIMIT 7;
    `;
		const results = await database.query(getDeck, { deckChoice });
		return results[0];
	} catch (err) {
		console.log("Error getting deck");
		return null;
	}
}

export async function logMove(
	round_id: number,
	card_id: number,
	trench_position: number,
	player_id: number
) {
	const params = {
		round_id,
		card_id,
		trench_position,
		player_id,
	};
	let logMove = `
    INSERT INTO move 
    (round_id, card_id, trench_position, player_id)
    VALUES
    (:round_id, :card_id, :trench_position, :player_id);
  `;
	try {
		const results = database.query(logMove, params);
		return true;
	} catch (err) {
		console.log("ERROR: Move not logged");
		return false;
	}
}

export async function startGame(player_1_id: number, player_2_id: number) {
	try {
		let startTransaction = `START TRANSACTION;`;
		const transaction = await database.query(startTransaction);

		let startMatch = "INSERT INTO `match` (is_completed) VALUES (0);";
		const matchStarted = await database.query(startMatch);

		const getMatchId = "SELECT MAX(match_id) AS 'created_match' FROM `match`;";
		let match = await database.query(getMatchId);
		const match_id = match[0][0].created_match;

		let startRound = "INSERT INTO round (match_id) VALUES (:match_id);";
		const roundStarted = await database.query(startRound, { match_id });

		let getRound = "SELECT MAX(round_id) AS 'created_round' FROM `round`;";
		const round = await database.query(getRound);
		const round_id = round[0][0].created_round;

		let commitChanges = `COMMIT;`;
		const commit = await database.query(commitChanges);
		return round_id;
	} catch (err) {
		let rollback = `ROLLBACK;`;
		const rollbackChanges = await database.query(rollback);
		console.log("ERROR: Game not started");
		return null;
	}
}

export async function checkForExistingGame(
	player_1_id: number,
	player_2_id: number
) {
	let checkForPlayer1Matches =
		"SELECT match_id, player_1_id, player_2_id, is_completed FROM `match` WHERE player_1_id = :player_1_id OR player_2_id = :player_1_id;";

	const player1Games = await database.query(checkForPlayer1Matches, {
		player_1_id,
	});
	const gameAlreadyExists = player1Games[0][0].filter((game) => {
		if (
			(game.player_1_id !== player_2_id || game.player_2_id !== player_2_id) &&
			!game.is_completed
		) {
			return game;
		}
	});

	if (gameAlreadyExists.length > 0) {
		let existing_game_id = gameAlreadyExists[0].game_id;
		let getCurrentRound =
			"SELECT MAX(round_id) FROM `round` WHERE game_id = :existing_game_id";
		let round = await database.query(getCurrentRound, { existing_game_id });
		return { gameExists: true, round_id: round[0][0].round_id };
	}
	return { gameExists: false, round_id: null };
}

export async function createPlayer(data: any) {
	const saltRounds = 10;
	bcrypt.genSalt(saltRounds, function (err, salt) {
		bcrypt.hash(data.password, salt, function (err, hash) {
			const createPlayerQuery = `
        INSERT INTO player (username, email, password_hash)
        VALUES ('${data.username}', '${data.email}', '${hash}')
      `;
			database
				.query(createPlayerQuery)
				.then(() => {
					console.log("Player created successfully!");
					return { message: "Player created successfully!" };
				})
				.catch((error) => {
					console.error("Error creating player:", error);

					if (error.code === "ER_DUP_ENTRY") {
						if (error.sqlMessage.includes("username")) {
							console.log("Username already in use.");
							return { error: "Username already in use" };
						} else if (error.sqlMessage.includes("email")) {
							console.log("Email already in use.");
							return { error: "Email already in use" };
						}
					} else {
						console.log("An unexpected error occurred.");
					}
				});
		});
	});
}

/* -------------------------- Seeding Demo Players -------------------------- */
// const demoPlayer1 = {
// 	username: "potat",
// 	password: "strongPassword1",
// 	email: "catrites@gmail.com",
// };

// const demoPlayer2 = {
// 	username: "keeles",
// 	password: "strongPassword2",
// 	email: "kyleeeles@gmail.com",
// };

// await createPlayer(demoPlayer1);
// await createPlayer(demoPlayer2);

export async function removePlayerById(playerId: number) {
	const removePlayerQuery = `
    DELETE FROM player WHERE player_id = ${playerId};
  `;
	database
		.query(removePlayerQuery)
		.then(() => {
			console.log("Player removed successfully...");
		})
		.catch((error) => {
			console.error("Error deleting player from db: ", error);
		});
}
