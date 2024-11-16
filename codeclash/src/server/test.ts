import * as dotenv from 'dotenv';
import {
  createGame,
  updatePlayerStats,
  finalizeGame,
  getGameResult,
  updateUserProfile,
  closeConnection
} from './dbOperations';

dotenv.config(); // This loads the .env file

async function runTests() {
  try {
    async function runTests() {
      try {
        // Test createGame
        const gameId = `test_game_${Date.now()}`;
        const totalRounds = 5;
        const createdGameId = await createGame(gameId, totalRounds);
        console.log("Created game with ID:", createdGameId);

        // Test updatePlayerStats
        const playerData = {
          user_id: "test_user_1",
          username: "TestUser1",
          current_game_stats: {
            rounds: 3,
            rounds_won: 2,
            score: 150,
            topics_correct: ["JavaScript", "Python"],
            topics_incorrect: ["Java"]
          }
        };
        await updatePlayerStats(gameId, playerData);
        console.log("Updated player stats");

        // Test getGameResult
        const gameResult = await getGameResult(gameId);
        console.log("Game result:", gameResult);

        // Test finalizeGame
        const finalizedGame = await finalizeGame(gameId);
        console.log("Finalized game:", finalizedGame);

        // Test updateUserProfile
        await updateUserProfile(playerData.user_id, finalizedGame);
        console.log("Updated user profile");

        console.log("All tests passed successfully!");
      } catch (error) {
        console.error("Test failed:", error);
      } finally {
        await closeConnection();
      }
    }
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await closeConnection();
  }
}

runTests();