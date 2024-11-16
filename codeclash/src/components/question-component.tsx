'use client'

import { QuestionInfo } from "@/types/messages"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{qInfo.questionDescription}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {qInfo.codeSnippet && (
            <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
              {qInfo.codeSnippet}
            </SyntaxHighlighter>
          )}

          <div className="space-y-4">
            {qInfo.questionType === "multiSelect" ? (
              <div className="grid grid-cols-2 gap-4">
                {qInfo.answerOptions?.map((option) => (
                  <Button
                    key={option}
                    variant={selectedAnswer.includes(option) ? "default" : "outline"}
                    onClick={() => setSelectedAnswer(option)}
                    className="w-full"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Type your answer..."
              />
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
