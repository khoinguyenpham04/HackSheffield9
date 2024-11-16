'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Code, Play } from 'lucide-react'

export function LandingPage() {
  const [gameId, setGameId] = useState('')

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-gray-800 opacity-10 font-mono text-sm"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {`const codeClash = () => { return "Fun!" }`}
            </div>
          ))}
        </div>
      </div>
      
      <main className="z-10 max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
          <span className="text-blue-400">Code</span>
          <span className="text-green-400">Clash</span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Engage in real-time multiplayer coding quizzes. Challenge your friends, test your skills, and become the ultimate code master!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Enter Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center">
            Join Game
            <ChevronRight className="ml-2" size={20} />
          </Button>
        </div>
        
        <div className="pt-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center mx-auto">
            Start New Game
            <Play className="ml-2" size={20} />
          </Button>
        </div>
      </main>
      
      <footer className="mt-16 text-gray-500 text-sm">
        © 2024 CodeClash. All rights reserved.
      </footer>
    </div>
  )
}