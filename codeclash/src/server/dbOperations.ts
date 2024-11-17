type Player = {
  userID: string,
  username: string,
  answers: { questionID: string, question_type: string, userAnswer: string, rightAnswer: string, isCorrect: boolean; }[];
};
const gameState: { gameID: string, players: Player[]; } = { gameID: "", players: [] };

export async function createGame(gameID: string) {
  gameState.gameID = gameID;
}

export async function addUserAnswer(userID: string, questionID: string, question_type: string, userAnswer: string, rightAnswer: string, isCorrect: boolean) {
  if (!gameState.players.find(player => player.userID == userID)) {
    gameState.players.push({ userID, username: userID, answers: [] });
  }
  const qResponse = { questionID, question_type, userAnswer, rightAnswer, isCorrect };
  gameState.players.find(player => player.userID == userID)!.answers.push(qResponse);
}

type LLMReturn = {
  generalFeedback: string,
  userSpecificFeedback: Map<string, string>;
};

export async function finalizeGame(): Promise<LLMReturn> {
  const feedback: Map<string, string> = new Map();
  const url = "http://52.56.54.123:5000/analyze-quiz";
  const body = JSON.stringify(gameState);

  const init = {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };
  try {
    const response = await fetch(url, init);
    if (response.status !== 200) {
      console.error("LLM not loading");
      for (const p of gameState.players) {
        feedback.set(p.userID, "Specific feedback");
      }
      return { generalFeedback: "General feedback", userSpecificFeedback: feedback };
    }
    const resp = await response.json();
    console.log("proper response")
    console.log(resp)
    for (const p of resp.players) {
      feedback.set(p.userID, p.feedback)
    }
    console.log(feedback)
    return {generalFeedback: "general feedback", userSpecificFeedback: feedback}
  } catch {
    console.error("LLM errored");
      for (const p of gameState.players) {
        feedback.set(p.userID, "Specific feedback");
      }
      return { generalFeedback: "General feedback", userSpecificFeedback: feedback };
  }
}

/*

// import { MongoClient, ObjectId, Db, WithId} from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

// const client = new MongoClient(uri);
// const database_name = 'hacksheffield_codeclash';
const database_uri = '';

export interface UserGameData {
  user_id: string;
  username: string;
  questions_answered: number;
  questions_correct: number;
  questions_incorrect: number;
  score: number;
  topics_correct: string[];
  topics_incorrect: string[];
}

export interface GameData {
  game_id: string;
  date: Date;
  players: UserGameData[];
  total_rounds: number;
  player_count: number;
  status: 'in_progress' | 'completed';
  winner_id?: string;
}

export interface UserProfile {
  user_id: string;
  username: string;
  total_games: number;
  total_score: number;
  games_won: number;
  game_history: {
    game_id: string;
    date: Date;
    score: number;
  }[];
}

let db: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (!db) {
    try {
      await client.connect();
      console.log("Connected to MongoDB Atlas");
      db = client.db(database_name);
    } catch (error) {
      console.error("Error connecting to MongoDB Atlas:", error);
      throw error;
    }
  }
  return db;
}

export async function createGame(gameId: string, totalRounds: number, players: { user_id: string, username: string }[]): Promise<string> {
  const db = await connectToDatabase();
  const collection = db.collection<GameData>("games");

  const initializedPlayers: UserGameData[] = players.map(player => ({
    user_id: player.user_id,
    username: player.username,
    questions_answered: 0,
    questions_correct: 0,
    questions_incorrect: 0,
    score: 0,
    topics_correct: [],
    topics_incorrect: []
  }));

  await collection.insertOne({
    game_id: gameId,
    date: new Date(),
    players: initializedPlayers,
    total_rounds: totalRounds,
    player_count: players.length,
    status: 'in_progress'
  });

  return gameId;
}

export async function updatePlayerStats(
    gameId: string,
    correctPlayerIds: string[],
    questionTopic: string
): Promise<void> {
  const db = await connectToDatabase();
  const gamesCollection = db.collection<GameData>("games");

  // Increment questions_answered for all players
  await gamesCollection.updateOne(
      { game_id: gameId },
      { $inc: { "players.$[].questions_answered": 1 } }
  );

  // Update players who answered correctly
  await gamesCollection.updateOne(
      { game_id: gameId },
      {
        $inc: { "players.$[elem].questions_correct": 1, "players.$[elem].score": 1 },
        $push: { "players.$[elem].topics_correct": questionTopic }
      },
      {
        arrayFilters: [{ "elem.user_id": { $in: correctPlayerIds } }]
      }
  );

  // Update players who answered incorrectly
  await gamesCollection.updateOne(
      { game_id: gameId },
      {
        $inc: { "players.$[elem].questions_incorrect": 1 },
        $push: { "players.$[elem].topics_incorrect": questionTopic }
      },
      {
        arrayFilters: [{ "elem.user_id": { $nin: correctPlayerIds } }]
      }
  );
}

export async function finalizeGame(gameId: string, winnerId: string): Promise<WithId<GameData>> {
  const db = await connectToDatabase();
  const gamesCollection = db.collection<GameData>("games");

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const updateResult = await gamesCollection.findOneAndUpdate(
          { game_id: gameId },
          {
            $set: {
              status: 'completed',
              date: new Date(),
              winner_id: winnerId
            }
          },
          { returnDocument: 'after', session }
      );

      if (!updateResult) {
        throw new Error(`Game with id ${gameId} not found in database`);
      }

      // Update all players' profiles
      for (const player of updateResult.players) {
        await updateUserProfile(player.user_id, updateResult);
      }

      return updateResult;
    });

    const finalGameData = await gamesCollection.findOne({ game_id: gameId });

    if (!finalGameData) {
      throw new Error(`Game with id ${gameId} not found after update`);
    }

    return finalGameData;
  } finally {
    await session.endSession();
  }
}

export async function getGameResult(gameId: string): Promise<GameData | null> {
  const db = await connectToDatabase();
  const gamesCollection = db.collection<GameData>("games");

  return await gamesCollection.findOne({ game_id: gameId });
}

export async function updateUserProfile(userId: string, gameData: GameData): Promise<void> {
  const db = await connectToDatabase();
  const userCollection = db.collection<UserProfile>("user_profiles");

  const playerData = gameData.players.find(p => p.user_id === userId);
  if (!playerData) {
    throw new Error(`User ${userId} not found in game ${gameData.game_id}`);
  }

  const gameHistoryEntry = {
    game_id: gameData.game_id,
    date: gameData.date,
    score: playerData.score
  };

  await userCollection.updateOne(
      { user_id: userId },
      {
        $inc: {
          total_games: 1,
          total_score: playerData.score,
          games_won: gameData.winner_id === userId ? 1 : 0
        },
        $push: {
          game_history: {
            $each: [gameHistoryEntry],
            $position: 0
          }
        },
        $setOnInsert: {
          username: playerData.username
        }
      },
      { upsert: true }
  );
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const db = await connectToDatabase();
  const userCollection = db.collection<UserProfile>("user_profiles");

  return await userCollection.findOne({ user_id: userId });
}

export async function closeConnection(): Promise<void> {
  await client.close();
  console.log("Disconnected from MongoDB Atlas");
  db = null;
}
*/
