import * as Messages from "@/types/messages"
import { fetchLeetCodeQuestions } from "../src/components/api/leetcode-questions"

export type Question = {
  info: Messages.QuestionInfo,
  answer: string,
  topic: string,
  explanation: string
}

// Default questions as fallback
export const defaultQuestions: Question[] = [
  {
    info: {
      questionType: "multiSelect",
      questionDescription: "What will be the output of this code?",
      codeSnippet: `const arr = [1, 2, 3];
arr.push(4);
arr.unshift(0);
console.log(arr);`,
      answerOptions: [
        "[0, 1, 2, 3, 4]",
        "[4, 3, 2, 1, 0]",
        "[1, 2, 3, 4, 0]",
        "[0, 4, 1, 2, 3]"
      ]
    },
    answer: "[0, 1, 2, 3, 4]",
    topic: "arrays",
    explanation: "push adds to the end, unshift adds to the beginning"
  },
  {
    info: {
      questionType: "multiSelect",
      questionDescription: "What is the result of this Promise chain?",
      codeSnippet: `Promise.resolve(1)
  .then(x => x + 1)
  .then(x => x * 2)
  .then(console.log);`,
      answerOptions: [
        "1",
        "2",
        "4",
        "undefined"
      ]
    },
    answer: "4",
    topic: "promises",
    explanation: "The Promise chain executes sequentially: 1 -> 2 -> 4"
  }
];

// Initialize with default questions
export let questions: Question[] = defaultQuestions;

export async function initializeQuestions() {
  try {
    console.log('Fetching LeetCode questions...');
    const leetcodeQuestions = await fetchLeetCodeQuestions(3); // Fetch 3 LeetCode questions

    if (leetcodeQuestions.length > 0) {
      // Combine LeetCode questions with default questions
      questions = [...leetcodeQuestions, ...defaultQuestions];
      console.log(`Successfully loaded ${leetcodeQuestions.length} LeetCode questions`);
    } else {
      console.log('No LeetCode questions fetched, using default questions');
    }

    return questions;
  } catch (error) {
    console.error("Failed to fetch LeetCode questions:", error);
    console.log('Using default questions as fallback');
    return defaultQuestions;
  }
}