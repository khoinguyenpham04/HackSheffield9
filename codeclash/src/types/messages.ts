export type HostMessage = {
	"type": "startQuestion" | "endQuestion"
}

export type UserMessage = {
	"type": "questionAnswer",
	"answer": string
}

export enum QuestionType {
	"number",
	"string",
	"multiSelect"
}

export type QuestionInfo = {
	"questionType": QuestionType,
	"questionDescription": string,
	"codeSnippet": string,
	answerOptions: [string] | null
}

export type ServerMessage = {
	"type": "questionStart",
	"questionInfo": QuestionInfo
} | {
	"type": "questionEnd"
} | {
	"type": "feedback",
	"correct": boolean,
	"feedback": string
} | {
	"type": "endLobby",
	"feedback": string
}
