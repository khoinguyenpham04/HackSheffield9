'use client'

import { useRouter } from 'next/navigation'

type params = {
	host: boolean,
	feedback: string,
	leaderboard: { [key: string]: number } // Changed from Map to object type
}

export function EndLobby({ feedback, leaderboard }: params) {
	const router = useRouter()
	console.log(leaderboard)

	// Sort the leaderboard entries
	const sortedScores = Object.entries(leaderboard)
		.sort(([, a], [, b]) => b - a)

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
			<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8">
				<h1 className="text-3xl font-bold text-center mb-8">Game Over!</h1>

				<div className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Final Scores</h2>
					<div className="space-y-4">
						{sortedScores.map(([userId, score], index) => (
							<div
								key={userId}
								className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
							>
								<span className="font-medium">Player {userId}</span>
								<span className="text-lg font-bold">{score} points</span>
							</div>
						))}
					</div>
				</div>

				{feedback && (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">Feedback</h2>
						<p className="text-gray-700">{feedback}</p>
					</div>
				)}

				<button
					onClick={() => router.push('/')}
					className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Return to Home
				</button>
			</div>
		</div>
	)
}
