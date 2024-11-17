// src/components/api/leetcode-questions.ts
import * as Messages from "@/types/messages"
import { Question } from "../../../party/questions"

interface LeetCodeAPIResponse {
    title: string;
    content: string;
    code: string;
    difficulty: string;
}

export async function fetchLeetCodeQuestions(): Promise<Question[]> {
    // This is a placeholder for actual LeetCode API integration
    const leetcodeQuestions: Question[] = [
        {
            info: {
                questionType: "multiSelect",
                questionDescription: "Two Sum: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                codeSnippet: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
}`,
                answerOptions: [
                    "Use nested loops (O(n²))",
                    "Use hash map (O(n))",
                    "Sort and use two pointers",
                    "Use binary search"
                ]
            },
            answer: "Use hash map (O(n))",
            topic: "arrays",
            explanation: "Using a hash map allows us to solve this in O(n) time complexity by storing complements"
        },
        // Add more LeetCode-style questions following your format
    ];

    return leetcodeQuestions;
}