'use client'

import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function QuestionComponent() {
  const [answer, setAnswer] = useState('')

  const codeSnippet = `
function mystery(x) {
  return x * 2 + 1;
}

console.log(mystery(5));
`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-indigo-600 text-white p-6">
          <CardTitle className="text-2xl font-bold text-center">Guess the Output!</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">What will be the output of this code?</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <Highlight theme={themes.nightOwl} code={codeSnippet.trim()} language="javascript">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-4 text-sm`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-grow text-lg"
            />
            <Button
              onClick={() => console.log('Submitted:', answer)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full text-lg transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}