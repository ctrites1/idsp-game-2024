import {database} from "./databaseConnection";
import bcrypt from "bcrypt";

export async function createInitialHand(deckID: number, playerId: number, roundId: number) {
  try {
    const deckChoice = deckID;
    let getDeck = `
    SELECT name, power, unit_type_id FROM card
    WHERE element_id = :deckChoice;
    `;
    const deck = await database.query(getDeck, {deckChoice})[0];
    const hand = randomizeDeck(deck);

    let logHand = `
    INSERT INTO hand 
    (player_id, round_id, card_1_id, card_2_id, card_3_id, card_4_id, card_5_id, card_6_id, card_7_id)
    VALUES
    (:playerId, :roundId, :card_1_id, :card_2_id, :card_3_id, :card_4_id, :card_5_id, :card_6_id, :card_7_id);
    `;

    const handParams = {
      playerId,
      roundId,
      card_1_id: hand[0],
      card_2_id: hand[1],
      card_3_id: hand[2],
      card_4_id: hand[3],
      card_5_id: hand[4],
      card_6_id: hand[5],
      card_7_id: hand[6],
    };
    const handCreated = await database.query(logHand, handParams);
    return hand;
  } catch (err) {
    console.log("Error getting deck");
    return null;
  }
}

export async function getCurrentHand(playerId: number, roundId: number) {
  try {
    let getHand = `
        SELECT * FROM hand 
        WHERE player_id = :playerId AND round_id = roundId;
        `;
    let handParams = {
      playerId,
      roundId,
    };
    const hand = await database.query(getHand)[0];
    if (hand.length === 0) {
      throw new Error("No hand exists for this player in the current round");
    }
    return {success: true, hand};
  } catch (err) {
    console.log(`Error: ${err}`);
    return {success: false, hand: null};
  }
}

async function createUpdatedHand(playerId: number, previousRoundId: number, newRoundId: number) {
  try {
    let getCardsPlayed = `
        SELECT card_id FROM move WHERE player_id = :playerId AND round_id = :roundId;
        `;
    let cardsPlayedParams = {
      playerId,
      roundId: previousRoundId,
    };
    const cardsPlayed = await database.query(getCardsPlayed, cardsPlayedParams)[0];

    let getLatestHand = `
        SELECT card_1_id, card_2_id, card_3_id, card_4_id, card_5_id, card_6_id, card_7_id FROM hand WHERE player_id = :playerId AND round_id = :roundId;
    `;
    let latestHandParams = {
      playerId,
      roundId: previousRoundId,
    };
    const initialHand = await database.query(getLatestHand, latestHandParams)[0];
    //? Don't think this is correct, need to Object.values() to get the cards inside of the hand
    const newHand = initialHand.filter((card) => !cardsPlayed.includes(card));
    return {success: true, hand: newHand};
  } catch (err) {
    console.log(`Error: ${err}`);
    return {success: false, hand: null};
  }
}

export async function logMove(round_id: number, card_id: number, trench_position: number, player_id: number) {
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
    const roundStarted = await database.query(startRound, {match_id});

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

export async function checkForExistingGame(player_1_id: number, player_2_id: number) {
  let checkForPlayer1Matches =
    "SELECT match_id, player_1_id, player_2_id, is_completed FROM `match` WHERE player_1_id = :player_1_id OR player_2_id = :player_1_id;";

  const player1Games = await database.query(checkForPlayer1Matches, {
    player_1_id,
  });
  const gameAlreadyExists = player1Games[0][0].filter((game) => {
    if ((game.player_1_id !== player_2_id || game.player_2_id !== player_2_id) && !game.is_completed) {
      return game;
    }
  });

  if (gameAlreadyExists.length > 0) {
    let existing_game_id = gameAlreadyExists[0].game_id;
    let getCurrentRound = "SELECT MAX(round_id) FROM `round` WHERE game_id = :existing_game_id";
    let round = await database.query(getCurrentRound, {existing_game_id});
    return {gameExists: true, round_id: round[0][0].round_id};
  }
  return {gameExists: false, round_id: null};
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
          return {message: "Player created successfully!"};
        })
        .catch((error) => {
          console.error("Error creating player:", error);

          if (error.code === "ER_DUP_ENTRY") {
            if (error.sqlMessage.includes("username")) {
              console.log("Username already in use.");
              return {error: "Username already in use"};
            } else if (error.sqlMessage.includes("email")) {
              console.log("Email already in use.");
              return {error: "Email already in use"};
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

//! These are functions that are not getting exported - could move to separate file
function randomizeDeck(cards) {
  return cards.filter((card) => card.unit_type_id === 1 || card.unit_type_id === 2);
  //   const deck = [];
  //   const nonHeroCards = cards.filter((card) => card.unit_type_id === 1 || card.unit_type_id === 2);
  //   for (let i = 0; i < 7; i++) {
  //     const randomIndex = Math.floor(Math.random() * nonHeroCards.length);
  //   }
  //   return deck;
}
