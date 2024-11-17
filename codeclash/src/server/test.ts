import * as db from './dbOperations'; // Adjust the import path as needed
import { ObjectId } from 'mongodb';

async function runTests() {
  try {
    // Test 1: Create a new game
    console.log("Test 1: Creating a new game");
    const gameId = await db.createGame('testGame', 5);
    console.log(`Game created with ID: ${gameId}`);

    // Test 2: Add players to the game
    console.log("\nTest 2: Adding players to the game");
    const players = [
      { user_id: 'user1', username: 'Player1' },
      { user_id: 'user2', username: 'Player2' },
    ];

    for (const player of players) {
      await db.updatePlayerStats(gameId, {
        ...player,
        rounds: 5,
        rounds_won: 3,
        score: 300,
        topics_correct: ['Math', 'Science'],
        topics_incorrect: ['History'],
      });
    }
    console.log("Players added to the game");

    // Test 3: Finalize the game
    console.log("\nTest 3: Finalizing the game");
    const finalizedGame = await db.finalizeGame(gameId, 'user1');
    console.log("Game finalized:", finalizedGame);

    // Test 4: Get game result
    console.log("\nTest 4: Getting game result");
    const gameResult = await db.getGameResult(gameId);
    console.log("Game result:", gameResult);

    // Test 5: Check user profiles
    console.log("\nTest 5: Checking user profiles");
    for (const player of players) {
      const userProfile = await db.getUserProfile(player.user_id);
      console.log(`Profile for ${player.username}:`, userProfile);
    }

    // Test 6: Create and finalize another game
    console.log("\nTest 6: Creating and finalizing another game");
    const gameId2 = await db.createGame('testGame2', 3);
    for (const player of players) {
      await db.updatePlayerStats(gameId2, {
        ...player,
        rounds: 3,
        rounds_won: 2,
        score: 200,
        topics_correct: ['Geography'],
        topics_incorrect: ['Literature'],
      });
    }
    const finalizedGame2 = await db.finalizeGame(gameId2, 'user2');
    console.log("Second game finalized:", finalizedGame2);

    // Test 7: Check updated user profiles
    console.log("\nTest 7: Checking updated user profiles");
    for (const player of players) {
      const userProfile = await db.getUserProfile(player.user_id);
      console.log(`Updated profile for ${player.username}:`, userProfile);
    }

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await db.closeConnection();
  }
}

runTests().then(() => console.log("Tests completed"));