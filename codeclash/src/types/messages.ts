export type HostMessage = {
	sender: "host",
	type: "startQuestion" | "endQuestion" | "endGame"
}

export type UserMessage = {
	sender: "user",
	type: "questionAnswer",
	answer: string
}

export type QuestionInfo = {
	questionType: "number" | "string" | "multiSelect",
	questionDescription: string,
	codeSnippet: string,
	answerOptions?: string[]
}

export type ServerMessage = {
	type: "questionStart",
	questionInfo: QuestionInfo
} | {
	type: "questionEnd",
	gameOver: boolean
} | {
	type: "feedback",
	correct: boolean,
	answer?: string,
	feedback?: string,
	timeout: boolean
} | {
	type: "endLobby",
	feedback: string,
} | {
	type: "userJoin",
	isHost: boolean
} | {
	type: "userLeaves",
	isHost: boolean
}
