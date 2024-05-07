import { database } from "./databaseConnection";
import bcrypt from "bcrypt";

async function getDeck() {
	let getDeck = `

    `;
}

async function createPlayer(data: any) {
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
				})
				.catch((error) => {
					console.error("Error creating player:", error);

					if (error.code === "ER_DUP_ENTRY") {
						//TODO: display errors to client
						if (error.sqlMessage.includes("username")) {
							console.log("Username already in use.");
						} else if (error.sqlMessage.includes("email")) {
							console.log("Email already in use.");
						}
					} else {
						console.log("An unexpected error occurred.");
					}
				});
		});
	});
}

const demoPlayer1 = {
	username: "potat",
	password: "strongPassword1",
	email: "catrites@gmail.com",
};

const demoPlayer2 = {
	username: "keeles",
	password: "strongPassword2",
	email: "kyleeeles@gmail.com",
};

/* -------------------------- Seeding Demo Players -------------------------- */
// await createPlayer(demoPlayer1);
// await createPlayer(demoPlayer2);

async function removePlayerById(playerId: number) {
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
