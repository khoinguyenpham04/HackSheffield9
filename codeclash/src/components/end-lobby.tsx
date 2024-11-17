'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type params = {
	host: boolean, // if true then it is the host
	feedback: string,
	leaderboard: Map<string, number>
}
export function EndLobby({ feedback, leaderboard }: params) {
	const router = useRouter()
	console.log(leaderboard)
	const sortedScores = Array.from(Object.entries(leaderboard))
		.sort(([, a], [, b]) => b - a)

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl text-center">Game Over!</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{feedback && (
						<p className="text-center text-gray-600">{feedback}</p>
					)}
					
					<div className="space-y-4">
						<h3 className="text-xl font-semibold">Final Scores</h3>
						{sortedScores.map(([playerId, score], index) => (
							<div key={playerId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
								<span>#{index + 1} Player {playerId.slice(0, 8)}</span>
								<span className="font-bold">{score}</span>
							</div>
						))}
					</div>

					<Button 
						onClick={() => router.push('/')}
						className="w-full mt-4"
					>
						Back to Home
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
