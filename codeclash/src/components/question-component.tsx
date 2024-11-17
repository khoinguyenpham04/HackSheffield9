'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { QuestionInfo } from "@/types/messages"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ChevronRight } from 'lucide-react'

type Props = {
  qInfo: QuestionInfo
  answerCallback: (answer: string) => void
}

export function QuestionComponent({ qInfo, answerCallback }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  
  const handleSubmit = () => {
    if (selectedAnswer) {
      answerCallback(selectedAnswer)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="bg-white rounded-3xl shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
            <CardTitle className="text-2xl font-bold text-white">{qInfo.questionDescription}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {qInfo.codeSnippet && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <SyntaxHighlighter 
                  language="javascript" 
                  style={vscDarkPlus}
                  className="rounded-xl shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1),inset_-5px_-5px_10px_rgba(255,255,255,0.1)]"
                >
                  {qInfo.codeSnippet}
                </SyntaxHighlighter>
              </motion.div>
            )}

            <div className="space-y-6">
              {qInfo.questionType === "multiSelect" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {qInfo.answerOptions?.map((option, index) => (
                    <motion.div
                      key={option}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                    >
                      <Button
                        variant={selectedAnswer.includes(option) ? "default" : "outline"}
                        onClick={() => setSelectedAnswer(option)}
                        className={`w-full py-4 rounded-xl text-left justify-start text-lg transition-all duration-300 ${
                          selectedAnswer.includes(option)
                            ? 'bg-blue-500 text-white shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2)]'
                            : 'bg-gray-100 text-gray-700 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1)]'
                        }`}
                      >
                        <span className="mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="w-full p-4 border-none rounded-xl bg-gray-100 shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Type your answer..."
                  />
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button 
                onClick={handleSubmit}
                className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  selectedAnswer
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2)]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!selectedAnswer}
              >
                Submit Answer <ChevronRight className="ml-2" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}