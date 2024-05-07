import {database} from "./databaseConnection";

export async function getDeck(deckID: number) {
  const deckChoice = deckID;
  let getDeck = `
    SELECT card.name, power FROM card
    WHERE card.element_id = :deckChoice AND card.unit_type_id IS NOT NULL
    LIMIT 7;
    `;
  try {
    const results = await database.query(getDeck, {deckChoice});
    return results[0];
  } catch (err) {
    console.log("Error getting deck");
    return null;
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

export async function startGame() {
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
