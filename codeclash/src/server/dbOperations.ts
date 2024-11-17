import { MongoClient, ObjectId, Db, WithId} from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

const client = new MongoClient(uri);
const database_name = 'hacksheffield_codeclash';

export interface UserGameData {
  user_id: string;
  username: string;
  rounds: number;
  rounds_won: number;
  score: number;
  topics_correct: string[];
  topics_incorrect: string[];
}

export interface GameData {
  _id?: ObjectId;
  game_id: string;
  date: Date;
  players: UserGameData[];
  total_rounds: number;
  player_count: number;
  status: 'in_progress' | 'completed';
  winner_id?: string;
}

export interface UserProfile {
  _id?: ObjectId;
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

//Saves new game to the database, the status of said database will be "in_progress"
export async function createGame(gameId: string, totalRounds: number): Promise<string> {
  const db = await connectToDatabase();
  const collection = db.collection<GameData>("games");

  await collection.insertOne({
    game_id: gameId,
    date: new Date(),
    players: [],
    total_rounds: totalRounds,
    player_count: 0,
    status: 'in_progress'
  });

  return gameId;
}

//Updates the player data in the current game being played
export async function updatePlayerStats(gameId: string, playerData: UserGameData): Promise<void> {
  const db = await connectToDatabase();
  const gamesCollection = db.collection<GameData>("games");

  await gamesCollection.updateOne(
      { game_id: gameId, "players.user_id": { $ne: playerData.user_id } },
      {
        $push: { players: playerData },
        $inc: { player_count: 1 }
      }
  );
}

//When a game is finished, call this function and it marks its status as finished and adds the completion date/time
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

//Gets the game data for a specific gameID
export async function getGameResult(gameId: string): Promise<GameData | null> {
  const db = await connectToDatabase();
  const gamesCollection = db.collection<GameData>("games");

  return await gamesCollection.findOne({ game_id: gameId });
}

//Updates the user's profile after a game
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