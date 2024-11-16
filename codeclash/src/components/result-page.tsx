'use client'

import { Highlight, themes } from 'prism-react-renderer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as Messages from "@/types/messages";

const codeSnippet = `
function mystery(x) {
  return x * 2 + 1;
}

console.log(mystery(5));
`
type params = {
  results: Messages.ServerMessageFeedback
}
export function ResultPageComponent({ state }: params) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Code Result
        </h1>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl text-gray-800">Code Snippet</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Highlight theme={themes.nightOwl} code={codeSnippet.trim()} language="javascript">
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={`${className} p-6 rounded-b-lg text-sm`} style={style}>
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
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl text-gray-800">Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-lg text-gray-800">
                  11
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-xl h-full">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800">Explanation</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-800">
                  The code outputs <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-800">11</code>. 
                  Here's why:
                </p>
                <ol className="mt-4 space-y-3 text-gray-700">
                  <li>
                    The <code className="bg-gray-100 px-2 py-0.5 rounded">mystery</code> function 
                    takes an input <code className="bg-gray-100 px-2 py-0.5 rounded">x</code> and 
                    returns <code className="bg-gray-100 px-2 py-0.5 rounded">x * 2 + 1</code>
                  </li>
                  <li>
                    When we call <code className="bg-gray-100 px-2 py-0.5 rounded">mystery(5)</code>, 
                    we're passing <code className="bg-gray-100 px-2 py-0.5 rounded">5</code> as the argument
                  </li>
                  <li>
                    Inside the function, <code className="bg-gray-100 px-2 py-0.5 rounded">x</code> becomes 
                    <code className="bg-gray-100 px-2 py-0.5 rounded">5</code>
                  </li>
                  <li>
                    The calculation is then: <code className="bg-gray-100 px-2 py-0.5 rounded">5 * 2 + 1</code>
                  </li>
                  <li>
                    This evaluates to: <code className="bg-gray-100 px-2 py-0.5 rounded">10 + 1</code>
                  </li>
                  <li>
                    The final result is <code className="bg-gray-100 px-2 py-0.5 rounded">11</code>
                  </li>
                </ol>
                <p className="mt-4 text-gray-800">
                  So, when we <code className="bg-gray-100 px-2 py-0.5 rounded">console.log(mystery(5))</code>, 
                  it outputs <code className="bg-gray-100 px-2 py-0.5 rounded">11</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
