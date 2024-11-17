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
	gameOver: boolean,
	currentQuestion: number,
	totalQuestions: number
} | ServerMessageFeedback | {
	type: "endLobby",
	feedback: string, // if host,, then personalised message
	leaderboard: object
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

export interface EndLobbyMessage {
	type: "endLobby";
	feedback: string;
	leaderboard: { [key: string]: number };
}

export interface CodeSubmission {
	code: string;
	language: string;
	questionId: string;
}

export interface TestCase {
	input: string;
	expectedOutput: string;
}

export interface ExecutionResult {
	success: boolean;
	output: string;
	error?: string;
	testCases?: {
		passed: boolean;
		input: string;
		expected: string;
		actual: string;
	}[];
}