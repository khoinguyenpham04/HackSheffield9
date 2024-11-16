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
        total_games: 1,
        total_score: playerResult.final_score,
        total_questions_answered: playerResult.questions_answered,
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


/* This is how the above functions should be called:

import * as Party from "partykit/server";
import * as db from './dbOperations';

export default class MyPartyServer extends Party.Server {
  gameId: string;

  constructor(readonly room: Party.Room) {
    super(room);
    this.gameId = `game_${Math.random().toString(36).substr(2, 9)}`;
  }

  async onConnect(conn: Party.Connection) {
    if (this.room.connections.size === 1) {
      // First player joined, create the game
      await db.createGame(this.gameId, 5); // 5 rounds
    }
    // ... rest of your connection logic
  }

  async onMessage(message: string, sender: Party.Connection) {
    // ... your message handling logic

    if (message === 'END_ROUND') {
      // Update player stats at the end of each round
      await db.updatePlayerStats(this.gameId, {
        user_id: sender.id,
        username: sender.state.username,
        current_game_stats: sender.state.gameStats
      });
    }

    if (message === 'END_GAME') {
      // Finalize the game
      const finalGameResult = await db.finalizeGame(this.gameId);

      // Update each player's profile
      for (const conn of this.room.connections) {
        await db.updateUserProfile(conn.id, finalGameResult);
      }

      // Broadcast game results to all players
      this.room.broadcast(JSON.stringify({
        type: 'GAME_RESULTS',
        results: finalGameResult
      }));
    }
  }

  async onClose() {
    // Close the database connection when the server shuts down
    await db.closeConnection();
  }
}
*/