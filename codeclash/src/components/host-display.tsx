'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type params = {
	leaderboard: Map<string, number>
	controls: {
		startQuestion: () => void
		endQuestion: () => void
		endGame: () => void
	}
}

export function HostDisplay({leaderboard, controls}: params) {
	return (
		<div className="p-8">
			<Card className="mb-8 p-6">
				<h1 className="text-2xl font-bold mb-4">Game Controls</h1>
				<div className="flex gap-4">
					<Button 
						onClick={controls.startQuestion}
						className="bg-green-500 hover:bg-green-600"
					>
						Start Question
					</Button>
					<Button 
						onClick={controls.endQuestion}
						className="bg-yellow-500 hover:bg-yellow-600"
					>
						End Question
					</Button>
					<Button 
						onClick={controls.endGame}
						className="bg-red-500 hover:bg-red-600"
					>
						End Game
					</Button>
				</div>
			</Card>

			<Card className="p-6">
				<h2 className="text-2xl font-bold mb-4">Live Leaderboard</h2>
				<div className="space-y-2">
					{Array.from(leaderboard.entries())
						.sort(([, a], [, b]) => b - a)
						.map(([playerId, score]) => (
							<div key={playerId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
								<span className="font-medium">Player {playerId.slice(0, 8)}</span>
								<span className="text-green-600 font-bold">{score}</span>
							</div>
						))}
				</div>
			</Card>
		</div>
	)
}
