import { createGame, updatePlayerStats, finalizeGame, getGameResult, getUserProfile, closeConnection } from './dbOperations';

async function runTests() {
  try {
    // Test createGame
    const gameId = 'test-game-001';
    const totalRounds = 5;
    const players = [
      { user_id: 'user1', username: 'Alice' },
      { user_id: 'user2', username: 'Bob' },
      { user_id: 'user3', username: 'Charlie' }
    ];
    await createGame(gameId, totalRounds, players);
    console.log('Game created successfully');

    // Test updatePlayerStats
    const topics = ['JavaScript', 'Python', 'Java', 'C++', 'Ruby'];
    for (let i = 0; i < totalRounds; i++) {
      const correctPlayers = players
          .filter(() => Math.random() > 0.5)
          .map(p => p.user_id);
      await updatePlayerStats(gameId, correctPlayers, topics[i]);
      console.log(`Round ${i + 1} updated`);
    }

    // Test finalizeGame
    const winnerId = players[Math.floor(Math.random() * players.length)].user_id;
    const finalizedGame = await finalizeGame(gameId, winnerId);
    console.log('Game finalized:', finalizedGame);

    // Test getGameResult
    const gameResult = await getGameResult(gameId);
    console.log('Game result:', gameResult);

    // Test getUserProfile
    for (const player of players) {
      const userProfile = await getUserProfile(player.user_id);
      console.log(`User profile for ${player.username}:`, userProfile);
    }

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await closeConnection();
  }
}

runTests();