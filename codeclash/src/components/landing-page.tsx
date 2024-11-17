'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Code, Zap, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { generateId } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export function LandingPage() {
  const [gameId, setGameId] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const router = useRouter()

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  const handleJoinGame = () => {
    if (gameId.trim()) {
      router.push(`/game/${gameId}`)
    }
  }

  const handleCreateGame = () => {
    const newGameId = generateId()
    router.push(`/game/${newGameId}`)
  }

  const features = [
    {
      icon: Code,
      title: "Code Challenges",
      description: "Face diverse coding puzzles",
      color: "from-blue-400 to-blue-600",
      code: `function fizzBuzz(n) {
  return n % 15 === 0 ? "FizzBuzz"
       : n % 3 === 0 ? "Fizz"
       : n % 5 === 0 ? "Buzz"
       : n.toString();
}`,
    },
    {
      icon: Zap,
      title: "Real-time Battles",
      description: "Compete against the clock",
      color: "from-yellow-400 to-orange-600",
      code: `async function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
  }
  return [...await quickSort(left), pivot, ...await quickSort(right)];
}`,
    },
    {
      icon: Users,
      title: "Multiplayer",
      description: "Challenge friends and rivals",
      color: "from-green-400 to-green-600",
      code: `socket.on('challenge', ({ opponent, problem }) => {
  console.log(\`New challenge from \${opponent}!\`);
  startCodingBattle(problem);
});

function submitSolution(code) {
  socket.emit('solution', { code, timestamp: Date.now() });
}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div 
        className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50 transition-all duration-300 ease-in-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.2), rgba(167, 139, 250, 0.2), rgba(236, 72, 153, 0.2))`,
        }}
      />
      
      <main className="z-10 max-w-6xl w-full space-y-12 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto text-center relative z-20 py-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Code Battles at <br /> 
          
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Lightning Speed
            </span>
          
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 max-w-2xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Engage in real-time multiplayer coding quizzes. Challenge your friends, test your skills, and become the ultimate code master!
        </motion.p>
        
        <motion.div 
          className="flex flex-col items-center justify-center gap-6 max-w-4xl mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative w-full max-w-xl">
            <Input
              type="text"
              placeholder="Enter Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border-gray-700 rounded-full text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-300"
            />
            <Code className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={24} />
          </div>
          <Button
            onClick={handleJoinGame}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!gameId.trim()}
          >
            Join Game
          </Button>
          
          <span className="text-gray-400 font-semibold">or</span>
          
          <Button
            onClick={handleCreateGame}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-lg font-semibold transition-all duration-300 shadow-[0_4px_14px_0_rgba(255,0,128,0.39)] hover:shadow-[0_6px_20px_rgba(255,0,128,0.23)]"
          >
            Create New Game
          </Button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="relative overflow-hidden rounded-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-75 z-0`} />
              <div className="relative z-10 p-6 h-full flex flex-col justify-between backdrop-blur-sm bg-gray-900 bg-opacity-50">
                <div>
                  <feature.icon className="w-12 h-12 mb-4 text-white" />
                  <h2 className="text-2xl font-bold mb-2 text-white">{feature.title}</h2>
                  <p className="text-gray-200 mb-4">{feature.description}</p>
                </div>
                <div className="mt-4 text-sm">
                  <SyntaxHighlighter 
                    language="javascript" 
                    style={vscDarkPlus}
                    customStyle={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                    }}
                  >
                    {feature.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
      
      <motion.footer 
        className="mt-16 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        © 2024 CodeClash. All rights reserved.
      </motion.footer>
    </div>
  )
}