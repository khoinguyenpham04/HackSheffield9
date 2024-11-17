import * as db from './dbOperations';

// Start a new game
const gameId = await db.createGame('game123', 10);

// Update player stats during the game
await db.updatePlayerStats(gameId, {
  user_id: 'user1',
  username: 'Player1',
  rounds: 5,
  rounds_won: 3,
  score: 300,
  topics_correct: ['Math', 'Science'],
  topics_incorrect: ['History']
});

// Finalize the game
const gameData = await db.finalizeGame(gameId);

// Update user profiles
for (const player of gameData.players) {
  await db.updateUserProfile(player.user_id, gameData);
}

// Get a user's profile
const userProfile = await db.getUserProfile('user1');
console.log(userProfile);

// Close the database connection when done
await db.closeConnection();