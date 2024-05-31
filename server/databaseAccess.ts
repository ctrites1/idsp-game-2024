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
    if (hand[0].length === 0) {
      return { success: false, hand: null };
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
    const cardIdsPlayed: number[] = cardsPlayed[0].map((c: any) => c.card_id);
    const latestHand = initialHand[0][0];
    const newHand: any = {};
    Object.keys(latestHand).filter((key: any) => {
      if (!cardIdsPlayed.includes(latestHand[key])) {
        newHand[key] = latestHand[key];
        return;
      }
    });
    let insertNewHand = `
      INSERT INTO hand 
      (player_id, round_id, card_1_id, card_2_id, card_3_id, card_4_id, card_5_id, card_6_id, card_7_id)
      VALUES
      (:player_id, :round_id, :card_1_id, :card_2_id, :card_3_id, :card_4_id, :card_5_id, :card_6_id, :card_7_id)
    `;
    let insertParams = {
      player_id: playerId,
      round_id: newRoundId,
      card_1_id: newHand["card_1_id"] || null,
      card_2_id: newHand["card_2_id"] || null,
      card_3_id: newHand["card_3_id"] || null,
      card_4_id: newHand["card_4_id"] || null,
      card_5_id: newHand["card_5_id"] || null,
      card_6_id: newHand["card_6_id"] || null,
      card_7_id: newHand["card_7_id"] || null,
    };
    const returnedHand = await database.query(insertNewHand, insertParams);
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
    const round_id = round[0][0].created_round;

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
      "SELECT m.match_id, player_1_id, player_2_id, is_completed, round_id, p1.username AS player_1_username, p2.username AS player_2_username  FROM `match` AS m  JOIN `round` AS r ON m.match_id = r.match_id  JOIN player AS p1 ON m.player_1_id = p1.player_id  JOIN player AS p2 ON m.player_2_id = p2.player_id WHERE player_1_id = :player_1_id OR player_2_id = :player_1_id HAVING is_completed = 0 ORDER BY round_id desc;";

    const player1Games: any = await database.query(checkForPlayer1Matches, {
      player_1_id,
    });
    const gameAlreadyExists = player1Games[0].filter((game: any) => {
      if (
        game.player_1_id !== player_2_id &&
        game.player_2_id !== player_2_id
      ) {
        if (!game.is_completed) {
          return;
        }
        return;
      }
      return game;
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
        match_id: gameAlreadyExists[0].match_id,
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
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(data.password, salt);

    const createPlayerQuery = `
    INSERT INTO player (username, email, password_hash)
      VALUES (:username, :email, :password);;
    `;
    const createPlayerParams = {
      username: data.username,
      email: data.email,
      password: hash,
    };

    await database.query(createPlayerQuery, createPlayerParams);

    const getUserIdQuery = `
      SELECT player_id FROM player
      WHERE username = :username;
    `;
    const playerIdResult = await database.query(getUserIdQuery, {
      username: data.username,
    });

    if (playerIdResult.length > 0) {
      return {
        success: true,
        message: "Player created successfully!",
        data: playerIdResult[0],
      };
    } else {
      return { success: false, message: "Player creation failed." };
    }
  } catch (error: any) {
    console.error("Error creating player:", error);

    if (error.code === "ER_DUP_ENTRY") {
      if (error.sqlMessage.includes("username")) {
        console.log("Username already in use.");
        return { success: false, message: "Username already in use" };
      } else if (error.sqlMessage.includes("email")) {
        console.log("Email already in use.");
        return { success: false, message: "Email already in use" };
      }
    }

    return { success: false, message: "An unexpected error occurred." };
  }
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
      const comparepass = await bcrypt.compare(
        password,
        user[0][0].password_hash
      );
      if (comparepass) {
        return {
          success: true,
          playerId: user[0][0].player_id,
          message: "Logged in successfully",
        };
      } else {
        return {
          success: false,
          playerId: null,
          message: "the password is incorrect",
        };
      }
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

function randomizeDeck(cards: Card[]) {
  const deck = cards.filter(
    (card) => card.unit_type_id === 1 || card.unit_type_id === 2
  );
  const hand: Card[] = [];
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const randomCard = deck[randomIndex];
    if (hand.includes(randomCard)) {
      i--;
    } else {
      hand.push(randomCard);
    }
  }
  return hand;
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

  const lastMove = latMove[0][0];
  return {
    success: true,
    data: {
      round_id: lastMove.round_id,
      playerTurn: lastMove.player_id === 3 ? 4 : 3,
    },
  };
}

export async function countTotalMoves(roundId: number, winnerId: number) {
  try {
    const getMatch = "SELECT match_id FROM `round` WHERE round_id = :round_id;";
    //@ts-ignore
    const matchId: any = await database.query(getMatch, {
      round_id: roundId,
    });
    const sql =
      "SELECT COUNT(*) AS moveCount, m.player_id, ma.match_id FROM move as m JOIN `round` as r on m.round_id = r.round_id JOIN `match` as ma on r.match_id = ma.match_id WHERE ma.match_id = :match_id GROUP BY player_id;";
    const rows: any[] = await database.query(sql, {
      match_id: matchId[0][0].match_id,
    });
    const totalMoves: any = rows[0].reduce((acc: any, cur: any) => {
      return acc + cur.moveCount;
    }, 0);
    if (totalMoves === 6 || totalMoves === 12 || totalMoves === 14) {
      const newRoundId = await startNewRound(
        matchId[0][0].match_id,
        winnerId,
        roundId,
        rows[0][0].player_id,
        rows[0][1].player_id
      );
      if (newRoundId?.roundStarted && newRoundId.roundId) {
        const players = await getPlayersInMatch(matchId[0][0].match_id);
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
              winner_id: winnerId,
            },
          };
        } else {
          return {
            success: false,
            newRound: true,
            data: {
              round_id: newRoundId.roundId,
              winner_id: winnerId,
              error: "Could not create new hands for players",
            },
          };
        }
      } else {
        return {
          success: true,
          newRound: false,
          gameOver: true,
          gameWinner: newRoundId?.winner_id,
        };
      }
    }
  } catch (err) {
    console.error("ERROR: Failed to count total moves in match", err);
    throw new Error("Failed to count total moves in match");
  }
}

export async function updateGameState(
  playerId: number,
  oppId: number,
  roundId: number
) {
  const gameState = await getRoundState(playerId, oppId, roundId);
  const playerHand = await getCurrentHand(playerId, roundId);
  if (gameState.success && playerHand.success) {
    return {
      success: true,
      gameState: gameState.data,
      hand: playerHand.hand,
    };
  } else {
    return {
      success: false,
      error: "Error getting updated game state",
    };
  }
}

export async function startNewRound(
  matchId: number,
  winnerId: number | null,
  roundId: number,
  player1: number,
  player2: number
) {
  try {
    if (winnerId === 0) {
      winnerId = null;
    }
    const updateWinner =
      "UPDATE `round` SET winner_id = :winner_id WHERE round_id = :round_id;";

    const winnerUpdated = await database.query(updateWinner, {
      winner_id: winnerId,
      round_id: roundId,
    });
    const countRounds =
      "SELECT winner_id, COUNT(*) AS rounds_won FROM `round` WHERE match_id = :match_id GROUP BY winner_id;";
    const roundTotal: any = await database.query(countRounds, {
      match_id: matchId,
    });

    const totalRounds: any = roundTotal[0].reduce((acc: any, cur: any) => {
      return acc + cur.rounds_won;
    }, 0);

    if (totalRounds >= 3) {
      let player1Rounds = { id: roundTotal[0][0].winner_id, score: 0 };
      let player2Rounds = { id: roundTotal[0][1].winner_id, score: 0 };

      let whoisthewinner = null;

      if (roundTotal.length > 0) {
        player1Rounds.score = roundTotal[0][0]?.rounds_won || 0;
      }
      if (roundTotal.length > 1) {
        player2Rounds.score = roundTotal[0][1]?.rounds_won || 0;
      }
      if (player1Rounds.score === player2Rounds.score) {
        whoisthewinner = null;
      } else if (player1Rounds.score > player2Rounds.score) {
        whoisthewinner = player1Rounds.id;
      } else if (player1Rounds.score < player2Rounds.score) {
        whoisthewinner = player2Rounds.id;
      } else {
        whoisthewinner = null;
      }
      const gameOver = await endGame(matchId);
      console.log(gameOver);
      if (gameOver.gameEnded) {
        return {
          roundStarted: false,
          gameCompleted: true,
          winner_id: whoisthewinner,
        };
      }
      return {
        roundStarted: false,
        gameCompleted: false,
        round: totalRounds,
      };
    }

    const createNewRound = `
    INSERT INTO round (match_id)
    VALUES (:matchId)
  `;

    const newRound = await database.query(createNewRound, { matchId });

    let getRound = "SELECT MAX(round_id) AS 'created_round' FROM `round`;";
    const round: any = await database.query(getRound);
    const round_id = round[0][0].created_round;

    return { roundStarted: true, roundId: round_id };
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

export async function endGame(matchId: number) {
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

export async function getLatestOppMove(oppId: number) {
  try {
    let getMove = `
    SELECT card.card_id, card.power, card.name, trench_position, player_id, round_id
    FROM move 
    JOIN card on move.card_id = card.card_id
    WHERE player_id = :oppId 
    ORDER BY move_time DESC
    LIMIT 1;
    `;
    let params = {
      oppId,
    };
    const cardPlayed: any = await database.query(getMove, params);
    return cardPlayed[0][0];
  } catch (err) {
    console.log(err);
    console.log("ERROR getting opponents move");
  }
}

export async function getExistingGames(playerId: number) {
  try {
    const existingGames =
      "SELECT match_id, is_completed, player_1_id, player_2_id, player.username AS player_1_username, p.username AS player_2_username FROM `match` JOIN player ON player_1_id = player.player_id JOIN player AS p ON player_2_id = p.player_id WHERE (player_1_id = :playerId OR player_2_id = :playerId) AND is_completed = 0;";
    const params = {
      playerId,
    };
    const games = await database.query(existingGames, params);
    return { success: true, games: games[0] };
  } catch (err) {
    console.log(`Error getting existing games: ${err}`);
    return { success: false, games: null };
  }
}

export async function getAllPlayers(playerId: number) {
  try {
    let getPlayers = `
    SELECT player_id, username
    from player
    where player_id != :playerId;
    `;

    const players: any = await database.query(getPlayers, { playerId });
    return { success: true, players: players[0] };
  } catch (err) {
    console.log(err);
    console.log("ERROR getting players");
    return { success: false, players: null };
  }
}

export async function getLobbyData(playerId: number) {
  try {
    if (playerId > 0) {
      const players: any = await getAllPlayers(playerId);
      const matches: any = await getExistingGames(playerId);
      const leaderboard: any = await getLeaderBoard();

      if (players && matches) {
        return {
          success: true,
          players: players,
          games: matches,
          leaderboard: leaderboard.data,
          currentUserId: playerId,
        };
      } else {
        return {
          success: false,
          players: null,
          games: null,
          currentUserId: playerId,
        };
      }
    }
  } catch (err) {
    console.log(err);
    console.log("ERROR getting lobby data");
    return {
      success: false,
      players: null,
      games: null,
    };
  }
}

export async function getUsernameById(playerId: number) {
  try {
    let getUsername = `
    SELECT username
    FROM player 
    WHERE player_id = :playerId;
    `;
    const username: any = await database.query(getUsername, { playerId });
    return { username: username[0][0] };
  } catch (err) {
    console.log(err);
    console.log("ERROR getting player");
    return { success: false, players: null };
  }
}

export async function getLeaderBoard() {
  try {
    let getLeaderBoard =
      "WITH RoundWins AS ( SELECT r.match_id, r.winner_id, COUNT(*) AS rounds_won FROM `round` r GROUP BY r.match_id, r.winner_id), MatchWinners AS (SELECT rw.match_id, rw.winner_id FROM RoundWins rw WHERE rw.rounds_won >= 2 ) SELECT p.username, COUNT(mw.match_id) AS matches_won FROM MatchWinners mw JOIN `player` p ON mw.winner_id = p.player_id GROUP BY  p.username ORDER BY  matches_won DESC Limit 10;";

    const leaderboard: any = await database.query(getLeaderBoard);
    return { success: true, data: leaderboard[0] };
  } catch (error) {
    console.log(error);
    console.log("ERROR getting leaderboard");
    return { success: false, leaderboard: null };
  }
}

export async function getRoundsData(matchId: number) {
  try {
    const sql =
      "select r.winner_id, count(round_id) as roundswon from round as r join `match` as m on r.match_id = m.match_id where r.match_id = :matchId group by winner_id;";

    const rounds: any = await database.query(sql, { matchId: matchId });
    console.log("se", rounds)
    return { sucess: true, data: rounds[0] };
  } catch (error) {
    console.log(error);
    return { success: false, data: null };
  }
}
