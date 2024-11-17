'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { QuestionComponent } from '@/components/question-component'
import { usePartySocket } from "partysocket/react"
import { QuestionInfo } from "@/types/messages"

export default function GamePage() {
    const { gameId } = useParams()
    const [questions, setQuestions] = useState<QuestionInfo[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const socket = usePartySocket({
        host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
        room: gameId as string,
    })

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/api/leetcode-questions')
                const data = await response.json()
                // Transform LeetCode questions to match QuestionInfo type
                const transformedQuestions: QuestionInfo[] = data.map((q: any) => ({
                    questionDescription: q.title,
                    codeSnippet: q.codeSnippet || '',
                    questionType: 'multiSelect', // Adjust based on question type
                    answerOptions: q.answerOptions || [],
                    // Add other necessary fields
                }))
                setQuestions(transformedQuestions)
            } catch (error) {
                console.error('Failed to fetch LeetCode questions:', error)
            }
        }

        fetchQuestions()
    }, [])

    useEffect(() => {
        socket.addEventListener("message", (event) => {
            // Handle incoming messages (e.g., opponent's answers, game state updates)
            const data = JSON.parse(event.data)
            // Update game state based on received data
        })
    }, [socket])

    const handleAnswer = (answer: string) => {
        // Send answer to PartyKit server
        socket.send(JSON.stringify({ type: 'answer', answer, questionIndex: currentQuestionIndex }))

        // Move to next question
        setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1))
    }

    if (questions.length === 0) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Game: {gameId}</h1>
            <QuestionComponent
                qInfo={questions[currentQuestionIndex]}
                answerCallback={handleAnswer}
            />
        </div>
    )
}