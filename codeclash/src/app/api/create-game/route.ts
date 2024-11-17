import { NextResponse } from 'next/server'
import { fetchLeetCodeQuestions } from '@/components/api/leetcode-questions'

export async function POST(request: Request) {
    try {
        const { gameId } = await request.json()

        // Initialize game data here if needed
        // const questions = await fetchLeetCodeQuestions()

        return NextResponse.json({ success: true, gameId })
    } catch (error) {
        console.error('Error creating game:', error)
        return NextResponse.json(
            { error: 'Failed to create game' },
            { status: 500 }
        )
    }
}