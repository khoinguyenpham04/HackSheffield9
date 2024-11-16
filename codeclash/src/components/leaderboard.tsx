'use client'

import { useState, useEffect } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from 'framer-motion'

const codeSnippet = `
function mystery(x) {
  return x * 2 + 1;
}

console.log(mystery(5));
`

const initialPlayers = [
  { id: 1, name: "Alice", score: 950, avatar: "/placeholder.svg?height=32&width=32" },
  { id: 2, name: "Bob", score: 920, avatar: "/placeholder.svg?height=32&width=32" },
  { id: 3, name: "Charlie", score: 890, avatar: "/placeholder.svg?height=32&width=32" },
  { id: 4, name: "David", score: 860, avatar: "/placeholder.svg?height=32&width=32" },
  { id: 5, name: "Eve", score: 830, avatar: "/placeholder.svg?height=32&width=32" },
]

export function LeaderboardComponent() {
  const [players, setPlayers] = useState(initialPlayers)

  useEffect(() => {
    const timer = setTimeout(() => {
      const newPlayers = [...players]
      newPlayers[2].score = 955 // Charlie overtakes Alice and Bob
      newPlayers.sort((a, b) => b.score - a.score)
      setPlayers(newPlayers)
    }, 2000) // Trigger after 2 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          CodeClash Leaderboard
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800">Code Snippet</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Highlight theme={themes.nightOwl} code={codeSnippet.trim()} language="javascript">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-6 rounded-b-lg text-sm`} style={style}>
                    {tokens.map((line, i) => (
                      <div 
                        key={i} 
                        {...getLineProps({ line })}
                      >
                        {line.map((token, key) => (
                          <span 
                            key={key} 
                            {...getTokenProps({ token })}
                          />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800">Top 5 Players</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                    className="py-4 flex items-center justify-between border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-700 mr-4">{index + 1}</span>
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-lg text-gray-800">{player.name}</span>
                    </div>
                    <motion.span
                      key={`score-${player.id}-${player.score}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-lg font-semibold text-gray-700"
                    >
                      <CountUp from={player.id === 3 ? 890 : player.score} to={player.score} />
                    </motion.span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CountUp({ from, to }: { from: number; to: number }) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / 1000, 1)
      setCount(Math.floor(progress * (to - from) + from))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrame)
  }, [from, to])

  return count
}