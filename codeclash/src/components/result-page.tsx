'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"
import type { ServerMessageFeedback } from "@/types/messages"

type Props = {
  results: ServerMessageFeedback
}

export function ResultPageComponent({ results }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl">
              {results.correct ? (
                <CheckCircle2 className="w-8 h-8 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500 mr-2" />
              )}
              {results.correct ? "Correct!" : "Incorrect"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-gray-600">The correct answer was:</p>
              <p className="text-lg font-semibold mt-1">{results.answer}</p>
            </div>
            {results.feedback && (
              <p className="text-sm text-gray-500">{results.feedback}</p>
            )}
            <p className="text-sm text-gray-500 text-center">
              Waiting for host to start next question...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
