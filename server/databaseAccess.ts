import { database } from "./databaseConnection";
import bcrypt from "bcrypt";
import { Card } from "./types/Card";
import { create } from "domain";
import { match } from "assert";

export async function createInitialHand(
  deckID: number,
  playerId: number,
  roundId: number
) {
  try {
    const deckChoice = deckID;
    let getDeck = `
    SELECT card_id, name, power, unit_type_id FROM card
    WHERE element_id = :deckChoice;
    `;
    const deck: any = await database.query(getDeck, { deckChoice });
    const hand = randomizeDeck(deck[0]);

    let logHand = `
    INSERT INTO hand 
    (player_id, round_id, card_1_id, card_2_id, card_3_id, card_4_id, card_5_id, card_6_id, card_7_id)
    VALUES
    (:playerId, :roundId, :card_1_id, :card_2_id, :card_3_id, :card_4_id, :card_5_id, :card_6_id, :card_7_id);
    `;

    const handParams = {
      playerId,
      roundId,
      card_1_id: hand[0].card_id,
      card_2_id: hand[1].card_id,
      card_3_id: hand[2].card_id,
      card_4_id: hand[3].card_id,
      card_5_id: hand[4].card_id,
      card_6_id: hand[5].card_id,
      card_7_id: hand[6].card_id,
    };

    await database.query(logHand, handParams);
    return { success: true, hand };
  } catch (err) {
    console.log(`Error getting deck: ${err}`);
    return { success: false, hand: null };
  }
}

export async function getCurrentHand(playerId: number, roundId: number) {
  //? Send back info about whether it is player or opponent turn
  try {
    let getHand = `
    SELECT 
    h.player_id, 
    h.round_id,
    c.card_id AS card_id, c.name AS name, c.power AS power, c.element_id AS element, c.unit_type_id AS unit_type, c.support_type_id AS support_type
    FROM hand h
    JOIN card as c ON c.card_id in (h.card_1_id, h.card_2_id, h.card_3_id, h.card_4_id, h.card_5_id, h.card_6_id, h.card_7_id)
    WHERE h.player_id = :playerId AND h.round_id = :roundId;`;

    let handParams = {
      playerId,
      roundId,
    };
    const hand: any = await database.query(getHand, handParams);
    console.log(hand);
    if (hand.length === 0) {
      throw new Error("No hand exists for this player in the current round");
    }
    return { success: true, hand: hand[0] };
  } catch (err) {
    console.log(`Error getting current hand: ${err}`);
    return { success: false, hand: null };
  }
}

async function createUpdatedHand(
  playerId: number,
  previousRoundId: number,
  newRoundId: number
) {
  try {
    let getCardsPlayed = `
        SELECT card_id FROM move WHERE player_id = :playerId AND round_id = :roundId;
        `;
    let cardsPlayedParams = {
      playerId,
      roundId: previousRoundId,
    };
    const cardsPlayed: any = await database.query(
      getCardsPlayed,
      cardsPlayedParams
    );

    let getLatestHand = `
        SELECT card_1_id, card_2_id, card_3_id, card_4_id, card_5_id, card_6_id, card_7_id FROM hand WHERE player_id = :playerId AND round_id = :roundId;
    `;
    let latestHandParams = {
      playerId,
      roundId: previousRoundId,
    };
    const initialHand: any = await database.query(
      getLatestHand,
      latestHandParams
    );
    //? Don't think this is correct, need to Object.values() to get the cards inside of the hand
    const newHand = initialHand[0].filter(
      (card: Card) => !cardsPlayed[0].includes(card)
    );
    return { success: true, hand: newHand };
  } catch (err) {
    console.log(`Error Updating Hand: ${err}`);
    return { success: false, hand: null };
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
  // count moves
  // if move = 6 -> new round
  try {
    await database.query(logMove, params);
    return { success: true, newRound: false };
  } catch (err) {
    console.log("ERROR: Move not logged");
    return { success: false };
  }
}

export async function startGame(player_1_id: number, player_2_id: number) {
  try {
    let startTransaction = `START TRANSACTION;`;
    await database.query(startTransaction);

    let startMatch =
      "INSERT INTO `match` (is_completed, player_1_id, player_2_id) VALUES (0, :player_1_id, :player_2_id);";
    let startParams = {
      player_1_id,
      player_2_id,
    };
    await database.query(startMatch, startParams);

    const getMatchId = "SELECT MAX(match_id) AS 'created_match' FROM `match`;";
    let match: any = await database.query(getMatchId);
    const match_id = match[0][0].created_match;

    let startRound = "INSERT INTO round (match_id) VALUES (:match_id);";
    await database.query(startRound, { match_id });

    let getRound = "SELECT MAX(round_id) AS 'created_round' FROM `round`;";
    const round: any = await database.query(getRound);
    const round_id = round[0].created_round;

    let commitChanges = `COMMIT;`;
    await database.query(commitChanges);
    return round_id;
  } catch (err) {
    let rollback = `ROLLBACK;`;
    await database.query(rollback);
    console.log(err);
    console.log("ERROR: Game not started");
    return null;
  }
}

export async function checkForExistingGame(
  player_1_id: number,
  player_2_id: number
) {
  try {
    let checkForPlayer1Matches =
      "SELECT m.match_id, player_1_id, player_2_id, is_completed, round_id, p1.username AS player_1_username, p2.username AS player_2_username FROM `match` AS m JOIN `round` AS r ON m.match_id = r.match_id JOIN player AS p1 ON m.player_1_id = p1.player_id JOIN player AS p2 ON m.player_2_id = p2.player_id WHERE player_1_id = :player_1_id OR player_2_id = :player_1_id ORDER BY round_id desc LIMIT 1;";

    const player1Games: any = await database.query(checkForPlayer1Matches, {
      player_1_id,
    });

    const gameAlreadyExists = player1Games[0].filter((game: any) => {
      if (
        (game.player_1_id !== player_2_id ||
          game.player_2_id !== player_2_id) &&
        !game.is_completed
      ) {
        return game;
      }
    });

    if (gameAlreadyExists.length > 0) {
      let existing_game_id = gameAlreadyExists[0].match_id;
      let getCurrentRound =
        "SELECT MAX(round_id) as round_id FROM `round` WHERE match_id = :existing_game_id";
      let round: any = await database.query(getCurrentRound, {
        existing_game_id,
      });
      let getRound =
        "SELECT COUNT(*) AS round FROM `round` WHERE match_id = :existing_game_id;";
      const roundCount: any = await database.query(getRound, {
        existing_game_id,
      });

      return {
        gameExists: true,
        round_id: round[0][0].round_id,
        player_1_username: gameAlreadyExists[0].player_1_username,
        player_2_username: gameAlreadyExists[0].player_2_username,
        round: roundCount[0][0].round,
      };
    }
    return { gameExists: false, round_id: null };
  } catch (err) {
    console.log(err);
    console.log("ERROR: checking for existing game error");
    return { gameExists: false, round_id: null };
  }
}

export async function getRoundState(
  playerId: number,
  oppId: number,
  roundId: number
) {
  try {
    let getPlayersMoves = `
    SELECT m.card_id, trench_position, name, power, username, m.player_id
	  FROM move AS m
	  JOIN card on m.card_id = card.card_id
	  JOIN player AS p ON m.player_id = p.player_id
    WHERE m.player_id = :playerId 
    AND round_id = :roundId;
  `;
    let getOppMoves = `
    SELECT m.card_id, trench_position, name, power, username
	  FROM move AS m
	  JOIN card on m.card_id = card.card_id
	  JOIN player AS p ON m.player_id = p.player_id
    WHERE m.player_id = :oppId 
    AND round_id = :roundId;
  `;

    const playersMoves: any = await database.query(getPlayersMoves, {
      playerId,
      roundId,
    });
    const oppMoves: any = await database.query(getOppMoves, { oppId, roundId });

    return {
      success: true,
      data: {
        playersMoves: playersMoves[0],
        oppMoves: oppMoves[0],
        round_id: roundId,
      },
    };
  } catch (err) {
    console.log(`Error getting round state: ${err}`);
    return { success: false, data: err };
  }
}

export async function createPlayer(data: any) {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
    bcrypt.hash(data.password, salt, function (err: any, hash: any) {
      const createPlayerQuery = `
        INSERT INTO player (username, email, password_hash)
        VALUES (:username, :email, :password)
      `;
      const createPlayerParams = {
        username: data.username,
        email: data.email,
        password: hash,
      };
      database
        .query(createPlayerQuery, createPlayerParams)
        .then(() => {
          console.log("Player created successfully!");
          return { success: true, message: "Player created successfully!" };
        })
        .catch((error: any) => {
          console.error("Error creating player:", error);

          if (error.code === "ER_DUP_ENTRY") {
            if (error.sqlMessage.includes("username")) {
              console.log("Username already in use.");
              return { success: false, message: "Username already in use" };
            } else if (error.sqlMessage.includes("email")) {
              console.log("Email already in use.");
              return { success: false, message: "Email already in use" };
            }
          } else {
            console.log("An unexpected error occurred.");
            return { success: false, message: "An unexpected error occurred." };
          }
        });
    });
  });
}

export async function validateUser(username: string, password: string) {
  try {
    const validateQuery = `
    SELECT * FROM player WHERE username = :username;
  `;
    const validateParams = {
      username: username,
    };
    const user: any = await database.query(validateQuery, validateParams);
    if (user[0][0]) {
      await bcrypt.compare(password, user[0][0].password_hash);
      return {
        success: true,
        playerId: user[0][0].player_id,
        message: "Logged in successfully",
      };
    } else {
      return { success: false, playerId: null, message: "No user found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, playerId: null, message: "Incorrect Password" };
  }
}

export async function test() {
  let sqlQuery = `
  SHOW VARIABLES LIKE 'version';
`;
  const test = await database.query(sqlQuery);
  return test;
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
    .catch((error: any) => {
      console.error("Error deleting player from db: ", error);
    });
}

//! These are functions that are not getting exported - could move to separate file
function randomizeDeck(cards: Card[]) {
  const hand = cards.filter(
    (card) => card.unit_type_id === 1 || card.unit_type_id === 2
  );
  return hand;
  //   const deck = [];
  //   const nonHeroCards = cards.filter((card) => card.unit_type_id === 1 || card.unit_type_id === 2);
  //   for (let i = 0; i < 7; i++) {
  //     const randomIndex = Math.floor(Math.random() * nonHeroCards.length);
  //   }
  //   return deck;
}

export async function loadGameState(roundId: number) {
  const latestMove = `SELECT m.move_id, m.round_id, m.card_id, m.trench_position, m.player_id
  FROM move as m
  join round as r on m.round_id = r.round_id 
  Where m.round_id = :roundId
  ORDER BY m.move_time DESC 
  LIMIT 1;`;
  const latMove: any = await database.query(latestMove, roundId);
  if (!latMove.length) {
    console.error("No moves found for this match.");
    return null;
  }

  console.log("last move", latMove);

  const lastMove = latMove[0][0];
  return {
    success: true,
    data: {
      round_id: lastMove.round_id,
      playerTurn: lastMove.player_id === 3 ? 4 : 3,
    },
  };
}

// async function countPlayerMoves(roundId: number, playerId: number): Promise<number> {
//   const sql = `
//       SELECT COUNT(*) AS moveCount
//       FROM move
//       WHERE round_id = :roundId and player_id = :playerId;
//   `;
//   try {
//       const rows: any[] = await database.query(sql, {roundId, playerId});
//       return rows[0].moveCount;
//   } catch (err) {
//       console.error("ERROR: Failed to count moves in round", err);
//       throw new Error('Failed to count moves in round');
//   }
// }

// console.log(countPlayerMoves(6, 3));

export async function countTotalMoves(roundId: number) {
  const sql = `
    SELECT COUNT(*) AS moveCount, m.player_id, r.match_id
    FROM move as m
    JOIN round as r on m.round_id = r.round_id
    WHERE r.round_id = :roundId
    GROUP BY player_id;
  `;
  try {
    const rows: any[] = await database.query(sql, { roundId });
    const matchId = rows[0][0].match_id;

    const totalMoves: any = rows[0].reduce((acc: any, cur: any) => {
      return acc + cur.moveCount;
    }, 0);
    // check total moves id it's 6 start new round, send newRound: false or true
    if (totalMoves === 6) {
      const newRoundId = await startNewRound(matchId);
      if (newRoundId?.roundStarted && newRoundId.roundId) {
        const players = await getPlayersInMatch(matchId);
        const player1Hand = await createUpdatedHand(
          players?.player1,
          roundId,
          newRoundId.roundId
        );
        const player2Hand = await createUpdatedHand(
          players?.player2,
          roundId,
          newRoundId.roundId
        );
        if (player1Hand.success && player2Hand.success) {
          return {
            success: true,
            newRound: true,
            data: {
              round_id: newRoundId.roundId,
            },
          };
        } else {
          return {
            success: false,
            newRound: true,
            data: {
              round_id: newRoundId.roundId,
              error: "Could not create new hands for players",
            },
          };
        }
      } else {
        return { success: true, newRound: false, gameOver: true };
      }
    }
  } catch (err) {
    console.error("ERROR: Failed to count total moves in match", err);
    throw new Error("Failed to count total moves in match");
  }
}

//export async function updateGameState(playerId: number, roundId: number) {
//   try {
//       const movesThisRound = await countPlayerMoves(roundId, playerId);
//       const totalMoves = await countTotalMoves(roundId);

//       console.log({ movesThisRound, totalMoves });
//   } catch (err) {
//       console.error("Failed to update game state:", err);
//   }
// }

export async function startNewRound(matchId: number) {
  try {
    const countRounds =
      "SELECT COUNT(*) AS rounds FROM `round` WHERE match_id = :match_id;";

    const roundTotal: any = await database.query(countRounds, {
      match_id: matchId,
    });
    if (roundTotal[0][0].rounds >= 3) {
      const gameOver = await endGame(matchId);
      if (gameOver.gameEnded) {
        return { roundStarted: false, gameCompleted: true };
      }
      return {
        roundStarted: false,
        gameCompleted: false,
        round: roundTotal[0][0].rounds,
      };
    }

    const createNewRound = `
    INSERT INTO round (match_id)
    VALUES (:matchId)
  `;

    const newRound = await database.query(createNewRound, { matchId });

    let getRound = "SELECT MAX(round_id) AS 'created_round' FROM `round`;";
    const round: any = await database.query(getRound);
    const round_id = round[0].created_round;

    return { roundStarted: true, roundId: round_id.round_id };
  } catch (err) {
    console.log(err);
    console.log("ERROR: Error starting new round");
  }
}

async function getPlayersInMatch(match_id: number) {
  try {
    let playerQuery =
      "SELECT player_1_id, player_2_id FROM `match` WHERE match_id = :match_id;";
    const players: any = await database.query(playerQuery, { match_id });
    const player1 = players[0][0].player_1_id;
    const player2 = players[0][0].player_2_id;
    return { player1, player2 };
  } catch (err) {
    console.log(err);
    console.log("ERROR: Cannot get players in this match");
  }
}

export async function countTotalRounds(matchId: number) {
  const sql = `
    SELECT COUNT(*) AS roundCount
    FROM match
    WHERE match_id = :matchId;
  `;

  const rows: any[] = await database.query(sql, { matchId });
  const totalRounds = rows[0][0].roundCount;

  return totalRounds;
}

async function endGame(matchId: number) {
  try {
    const completeGame =
      "UPDATE `match` SET is_completed = 1 WHERE match_id = :match_id;";

    const completedGame = await database.query(completeGame, {
      match_id: matchId,
    });
    return { gameEnded: true };
  } catch (err) {
    console.log(err);
    console.log("ERROR: Error ending game");
    return { gameEnded: false };
  }
}
