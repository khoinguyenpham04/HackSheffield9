'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { QuestionInfo } from "@/types/messages"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ChevronRight } from 'lucide-react'
import Editor from "@monaco-editor/react"

type Props = {
  qInfo: QuestionInfo
  answerCallback: (answer: string) => void
}

export function QuestionComponent({ qInfo, answerCallback }: Props) {
  const [code, setCode] = useState<string>(qInfo.codeSnippet || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (code.trim()) {
      setIsSubmitting(true)
      answerCallback(code)
      setIsSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
        >
          <Card className="bg-white rounded-3xl shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
              <CardTitle className="text-2xl font-bold text-white">{qInfo.questionDescription}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="h-[400px] rounded-xl overflow-hidden shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1)]">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                />
              </div>

              <div className="space-y-4">
                <div className="bg-gray-100 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">Example Test Cases:</h3>
                  <SyntaxHighlighter
                      language="javascript"
                      style={vscDarkPlus}
                      className="text-sm"
                  >
                    {`// Test Case 1
Input: nums = [2,7,11,15], target = 9
Output: [0,1]

// Test Case 2
Input: nums = [3,2,4], target = 6
Output: [1,2]`}
                  </SyntaxHighlighter>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button
                      onClick={handleSubmit}
                      className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                          code.trim()
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2)]'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!code.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Running Tests...' : 'Submit Solution'} <ChevronRight className="ml-2" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
  )
}