import * as Messages from "@/types/messages"
import { fetchLeetCodeQuestions } from "@/components/api/leetcode-questions"

export type Question = {
  info: Messages.QuestionInfo,
  answer: string,
  topic: string,
  explanation: string
}

// Keep your existing questions as fallback
const defaultQuestions: Question[] = [
  // ... your existing questions ...
];

export let questions: Question[] = defaultQuestions;

export async function initializeQuestions() {
  try {
    const leetcodeQuestions = await fetchLeetCodeQuestions(5);
    questions = [...leetcodeQuestions];
    return questions;
  } catch (error) {
    console.error("Failed to fetch LeetCode questions:", error);
    return defaultQuestions;
  }
}