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

export type ServerMessageFeedback = {
	type: "feedback",
	correct: boolean,
	answer: string,
	feedback?: string,
	timeout: boolean,
	questionInfo: QuestionInfo
}

export type ServerMessage = {
	type: "questionStart",
	questionInfo: QuestionInfo
} | {
	type: "questionEnd",
	gameOver: boolean
} | ServerMessageFeedback | {
	type: "endLobby",
	feedback: string, // if host,, then personalised message
	leaderboard: Map<string, number>
} | {
	type: "userJoin",
	isHost: boolean
} | {
	type: "userLeaves",
	isHost: boolean
} | {
	type: "leaderboardUpdate",
	leaderboard: Map<string, number>
}
