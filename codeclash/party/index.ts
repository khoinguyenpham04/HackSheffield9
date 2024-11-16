import type * as Party from "partykit/server";
import * as Messages from "@/types/messages"

import {questions} from "./questions"

export default class Server implements Party.Server {
	host = "";
	qNum = 0;
	inQuestions = false;
	inEndLobby = false;
	userScores: Map<string, number> = new Map()
	usersPendingAnswers: Set<string> = new Set() 

	constructor(readonly room: Party.Room) {
		console.log("Room created:", room.id);
	}

	async onStart() {
		// Load any saved state
		const savedState = await this.room.storage.get("gameState");
		if (savedState) {
			Object.assign(this, savedState);
		}
	}

	async saveState() {
		await this.room.storage.put("gameState", {
			host: this.host,
			qNum: this.qNum,
			inQuestions: this.inQuestions,
			inEndLobby: this.inEndLobby,
			userScores: this.userScores,
			usersPendingAnswers: this.usersPendingAnswers
		});
	}

	async onConnect(connection: Party.Connection) {
		// First connection becomes host
		if (this.room.connections.size === 1) {
			this.host = connection.id;
			connection.send(JSON.stringify({
				type: "userJoin",
				isHost: true
			}))
			return;
		}

		// Send current game state to new players
		connection.send(JSON.stringify({
			type: "userJoin",
			isHost: false
		}))

		// Update leaderboard for all
		this.room.broadcast(JSON.stringify({
			type: "leaderboardUpdate",
			leaderboard: this.userScores
		}))
	}

	async onMessage(message: string, sender: Party.Connection) {
		const msg = JSON.parse(message);
		
		if (msg.sender === "host") {
			await this.handleHostMessage(msg, sender);
		} else {
			await this.handlePlayerMessage(msg, sender);
		}
		
		await this.saveState();
	}

	private async handleHostMessage(msg: Messages.HostMessage, sender: Party.Connection) {
		if (sender.id !== this.host) return;

		switch (msg.type) {
			case "startQuestion":
				this.inQuestions = true;
				this.room.broadcast(JSON.stringify({
					type: "questionStart",
					questionInfo: questions[this.qNum].info
				}))
				break;

			case "endQuestion":
				this.inQuestions = false;
				
				// First, send feedback to any pending players
				for (const userId of this.usersPendingAnswers) {
					const connection = this.room.getConnection(userId);
					if (connection) {
						connection.send(JSON.stringify({
							type: "feedback",
							correct: false,
							timeout: true,
							answer: questions[this.qNum].answer,
							questionInfo: questions[this.qNum].info
						}));
					}
				}

				// Clear pending answers
				this.usersPendingAnswers.clear();

				// Then transition all players to waiting state
				this.room.broadcast(JSON.stringify({
					type: "waitingForNext",
					currentQuestion: this.qNum + 1,
					totalQuestions: questions.length
				}));

				// Move to next question
				this.qNum++;
				
				// Check if game should end
				if (this.qNum >= questions.length) {
					this.inEndLobby = true;
					this.room.broadcast(JSON.stringify({
						type: "endLobby",
						feedback: "Game Over!",
						leaderboard: Object.fromEntries(this.userScores)
					}));
				}
				break;

			case "endGame":
				this.inEndLobby = true;
				this.room.broadcast(JSON.stringify({
					type: "endLobby",
					feedback: "Game Over!",
					leaderboard: this.userScores
				}))
				break;
		}
	}

	private async handlePlayerMessage(msg: Messages.UserMessage, sender: Party.Connection) {
		if (msg.type === "questionAnswer" && this.inQuestions) {
			this.usersPendingAnswers.add(sender.id);
			
			const correct = msg.answer === questions[this.qNum].answer;
			const currentScore = this.userScores.get(sender.id) || 0;
			
			if (correct) {
				this.userScores.set(sender.id, currentScore + 1000);
			}
			
			sender.send(JSON.stringify({
				type: "feedback",
				correct,
				answer: questions[this.qNum].answer,
				timeout: false,
				questionInfo: questions[this.qNum].info
			}));

			// Broadcast updated leaderboard
			this.room.broadcast(JSON.stringify({
				type: "leaderboardUpdate",
				leaderboard: Object.fromEntries(this.userScores)
			}));
		}
	}
}


Server satisfies Party.Worker;
