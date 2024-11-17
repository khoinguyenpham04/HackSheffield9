// src/components/api/leetcode-questions.ts
import * as Messages from "@/types/messages"
import { Question } from "../../../party/questions"

interface LeetCodeQuestion {
    title: string;
    difficulty: string;
    titleSlug: string;
    questionFrontendId: string;
    topicTags: Array<{
        name: string;
        slug: string;
    }>;
}

interface LeetCodeResponse {
    totalQuestions: number;
    count: number;
    problemsetQuestionList: LeetCodeQuestion[];
}

export async function fetchLeetCodeQuestions(limit: number = 5): Promise<Question[]> {
    try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/problems?limit=${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LeetCodeResponse = await response.json();
        console.log('API Response:', data);

        // Check if the response has the expected structure
        if (!data.problemsetQuestionList || !Array.isArray(data.problemsetQuestionList)) {
            throw new Error('Invalid API response format');
        }

        const questions: Question[] = data.problemsetQuestionList.map((q: LeetCodeQuestion): Question => {
            return {
                info: {
                    questionType: "multiSelect",
                    questionDescription: `Problem ${q.questionFrontendId}: ${q.title}`,
                    codeSnippet: `// LeetCode Problem ${q.questionFrontendId}: ${q.title}
function solution() {
  // Your code here
}`,
                    answerOptions: [
                        "Time Complexity: O(n) using HashMap",
                        "Time Complexity: O(n²) using nested loops",
                        "Time Complexity: O(n log n) using sorting",
                        "Time Complexity: O(1) using math"
                    ]
                },
                answer: "Time Complexity: O(n) using HashMap", // Default answer
                topic: q.difficulty.toLowerCase(),
                explanation: `This is a ${q.difficulty} level problem focusing on ${
                    q.topicTags?.map(tag => tag.name).join(', ') || 'algorithms'
                }.`
            };
        });

        return questions;
    } catch (error) {
        console.error('Error fetching LeetCode questions:', error);
        return [];
    }
}