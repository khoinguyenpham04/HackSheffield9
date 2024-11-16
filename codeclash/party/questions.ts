import * as Messages from "@/types/messages"

export type Question = {info: Messages.QuestionInfo, answer: string, topic: string}

// Literally going to be a JSON file or array of questions
export const questions: Question[] = [{info: {questionType: "string", questionDescription: "What is the output of this code?", "codeSnippet": "print(\"Hello world\")"}, answer: "Hello world", topic: "basics"},
	{info: {questionType: "multiSelect", questionDescription: "Select A!", codeSnippet:"print(\"a\")", answerOptions:["A", "B", "C", "D"]}, answer: "A", topic:"selection"},
	{info: {questionType: "number", questionDescription: "How many times will the below loop run?", codeSnippet:"for i in range(0, 10):\n    print(\"hello\")"}, answer: "10", topic: "loops"}
]
