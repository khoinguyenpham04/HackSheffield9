'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Trophy, Meh } from 'lucide-react'
import type { ServerMessageFeedback } from "@/types/messages"
import { useState, useEffect } from "react"
import confetti from 'canvas-confetti'

type Props = {
  results: ServerMessageFeedback
}

export function ResultPageComponent({ results }: Props) {
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    if (results.correct) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    const timer = setTimeout(() => setShowExplanation(true), 500)
    return () => clearTimeout(timer)
  }, [results.correct])

  const getEmoji = () => {
    if (results.correct) return <Trophy className="w-12 h-12 text-yellow-400" />
    return <Meh className="w-12 h-12 text-orange-400" />
  }

  const getExplanation = () => {
    if (results.correct) {
      return "Great job! You've mastered this concept. Keep up the excellent work!"
    }
    return `Don't worry! The correct answer was "${results.answer}". Let's understand why...`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Card className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
          <CardHeader className={`p-8 ${results.correct ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-red-50 to-red-100'}`}>
            <CardTitle className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center"
              >
                {results.correct ? (
                  <CheckCircle2 className="w-12 h-12 text-green-500 mr-4" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500 mr-4" />
                )}
                {getEmoji()}
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold"
              >
                {results.correct ? "Excellent!" : "Keep Learning!"}
              </motion.span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="p-4 bg-gray-50 rounded-xl shadow-inner">
                  <h3 className="font-semibold mb-2">Answer:</h3>
                  <p className="text-lg">{results.answer}</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl shadow-inner">
                  <h3 className="font-semibold mb-2">Explanation:</h3>
                  <p className="text-gray-700">{getExplanation()}</p>
                  {results.feedback && (
                    <p className="text-gray-600 mt-2 italic">{results.feedback}</p>
                  )}
                </div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <p className="text-sm text-gray-500 text-center p-3 bg-gray-100 rounded-full shadow-md animate-pulse">
                Waiting for host to start next question...
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}