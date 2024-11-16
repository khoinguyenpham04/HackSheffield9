import * as Messages from "@/types/messages"

export type Question = {info: Messages.QuestionInfo, answer: string}

// Literally going to be a JSON file or array of questions
export const questions: Question[] = [{info: {questionType: "string", questionDescription: "What is the output of this code?", "codeSnippet": "print(\"Hello world\")"}, answer: "Hello world"}]
