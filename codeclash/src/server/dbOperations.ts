import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const database_name = "";

//User data for a specific game
interface UserGameData {
  user_id: string;
  username: string;
  current_game_stats: {
    rounds: number;
    rounds_won: number;
    score: number;
    topics_correct: [];
    topics_incorrect: [];
  };
}

// Result for a specific game
interface GameResult {
  _id?: ObjectId;
  game_id: string;
  date: Date;
  players: {
    user_id: string;
    username: string;
    final_score: number;
    game_won: boolean;
  }[];
  total_rounds: number;
}

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client.db(database_name);
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  }
}

export async function createGame(gameId: string, totalRounds: number): Promise<string> {
  const db = await connectToDatabase();
  const collection = db.collection<GameResult>("game_results");

  const result = await collection.insertOne({
    game_id: gameId,
    date: new Date(),
    players: [],
    total_rounds: totalRounds
  });

  return result.insertedId.toString();
}

export async function updatePlayerStats(gameId: string, playerData: UserGameData): Promise<void> {
  const db = await connectToDatabase();
  const collection = db.collection<GameResult>("game_results");

  await collection.updateOne(
    { game_id: gameId },
    {
      $set: {
        [`players.${playerData.user_id}`]: {
          username: playerData.username,
          final_score: playerData.current_game_stats.score,
          questions_answered: playerData.current_game_stats.questions_answered
        }
      }
    },
    { upsert: true }
  );
}

export async function finalizeGame(gameId: string): Promise<GameResult> {
  const db = await connectToDatabase();
  const collection = db.collection<GameResult>("game_results");

  const gameResult = await collection.findOneAndUpdate(
    { game_id: gameId },
    { $set: { date: new Date() } },
    { returnDocument: 'after' }
  );

  if (!gameResult.value) {
    throw new Error(`Game with id ${gameId} not found`);
  }

  return gameResult.value;
}

export async function getGameResult(gameId: string): Promise<GameResult | null> {
  const db = await connectToDatabase();
  const collection = db.collection<GameResult>("game_results");

  return await collection.findOne({ game_id: gameId });
}

export async function updateUserProfile(userId: string, gameResult: GameResult): Promise<void> {
  const db = await connectToDatabase();
  const collection = db.collection("user_profiles");

  const playerResult = gameResult.players.find(player => player.user_id === userId);
  if (!playerResult) return;

  await collection.updateOne(
    { user_id: userId },
    {
      $inc: {
        total_games: 1
        total_score: playerResult.final_score,
        total_questions_answered: playerResult.questions_answered
        games_won: playerResult.game_won ? 1 : 0
        // TODO: Add topics that they get correct or struggle with
      },
      $push: {
        game_history: {
          game_id: gameResult.game_id,
          date: gameResult.date,
          score: playerResult.final_score,
          questions_answered: playerResult.questions_answered
        }
      }
    },
    { upsert: true }
  );
}

export async function closeConnection(): Promise<void> {
  await client.close();
  console.log("Disconnected from MongoDB Atlas");
}