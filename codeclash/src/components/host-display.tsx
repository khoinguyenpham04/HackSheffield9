'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlayCircle, PauseCircle, StopCircle } from "lucide-react"

type params = {
  leaderboard: Map<string, number>
  controls: {
    startQuestion: () => void
    endQuestion: () => void
    endGame: () => void
  }
}

export function HostDisplay({ leaderboard, controls }: params) {
  const [activeButton, setActiveButton] = useState<string | null>(null)

  const handleButtonClick = (action: () => void, buttonName: string) => {
    setActiveButton(buttonName)
    action()
    setTimeout(() => setActiveButton(null), 300)
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <Card className="mb-8 p-6 bg-white rounded-2xl shadow-[inset_0px_0px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[inset_0px_0px_30px_rgba(0,0,0,0.15)]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Game Controls</h1>
        <div className="flex flex-wrap justify-center gap-6">
          <NeomorphicButton
            onClick={() => handleButtonClick(controls.startQuestion, 'start')}
            className="bg-green-500 hover:bg-green-600 text-white"
            isActive={activeButton === 'start'}
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Start Question
          </NeomorphicButton>
          <NeomorphicButton
            onClick={() => handleButtonClick(controls.endQuestion, 'end')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            isActive={activeButton === 'end'}
          >
            <PauseCircle className="mr-2 h-5 w-5" />
            End Question
          </NeomorphicButton>
          <NeomorphicButton
            onClick={() => handleButtonClick(controls.endGame, 'stop')}
            className="bg-red-500 hover:bg-red-600 text-white"
            isActive={activeButton === 'stop'}
          >
            <StopCircle className="mr-2 h-5 w-5" />
            End Game
          </NeomorphicButton>
        </div>
      </Card>

      <Card className="p-6 bg-white rounded-2xl shadow-[inset_0px_0px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[inset_0px_0px_30px_rgba(0,0,0,0.15)]">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Live Leaderboard</h2>
        <div className="space-y-4">
          {Array.from(leaderboard.entries())
            .sort(([, a], [, b]) => b - a)
            .map(([playerId, score], index) => (
              <motion.div
                key={playerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl shadow-[inset_0px_0px_10px_rgba(0,0,0,0.1)] hover:shadow-[inset_0px_0px_15px_rgba(0,0,0,0.15)] transition-all duration-300"
              >
                <span className="font-medium text-gray-700">Player {playerId.slice(0, 8)}</span>
                <span className="text-green-600 font-bold text-lg">{score}</span>
              </motion.div>
            ))}
        </div>
      </Card>
    </div>
  )
}

interface NeomorphicButtonProps {
  onClick: () => void
  className: string
  children: React.ReactNode
  isActive: boolean
}

function NeomorphicButton({ onClick, className, children, isActive }: NeomorphicButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`${className} flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        isActive
          ? 'shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2),_inset_-3px_-3px_6px_rgba(255,255,255,0.1)]'
          : 'shadow-[6px_6px_12px_rgba(0,0,0,0.2),_-6px_-6px_12px_rgba(255,255,255,0.1)]'
      } hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2),_inset_-3px_-3px_6px_rgba(255,255,255,0.1)]`}
    >
      {children}
    </Button>
  )
}