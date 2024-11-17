export type UserAnswer = {
	questionTopic: string,
	answerType: "number" | "string" | "multiSelect",
	correct: boolean
}

export type roundAnalytics = {
	questionCount: number,
	averageScore: number,
	users: Map<string, UserAnswer>
}
