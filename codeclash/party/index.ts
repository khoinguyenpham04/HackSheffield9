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
		if (this.host == "") {
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
		// Todo add database support, store info about what users get right and wrong
		const message_json: Messages.UserMessage | Messages.HostMessage = JSON.parse(message);
		
		let response: Messages.ServerMessage;
		if (this.inEndLobby) {
			console.error(`In end lobby, but new request came through of ${message_json}`);
		}

		if (message_json.sender == "host") {
			// message sent by host
			switch (message_json.type) {
				case "startQuestion":
					this.inQuestions = true;
					
					response = {
						type: "questionStart",
						questionInfo: questions[this.qNum].info
					}
					this.room.broadcast(JSON.stringify(response))
					this.usersPendingAnswers = new Set([...this.room.getConnections()].map((val) => {return val.id}))
					this.usersPendingAnswers.delete(this.host)
					break;
				case "endQuestion":
					this.inQuestions = false;
					// see if users have not responded
					response = {
						type: "feedback",
						correct: false,
						timeout: true,
						answer: questions[this.qNum].answer,
						questionInfo: questions[this.qNum].info
					}
					for (const user in this.usersPendingAnswers) {
						// user has failed to answer question
						this.room.getConnection(user)?.send(JSON.stringify(response))
					}

					response = {
						type: "questionEnd",
						gameOver: false
					}
					this.qNum += 1
					if (this.qNum >= questions.length) {
						// Game over
						response.gameOver = true
						console.log("Game Over")
					}
					
					this.room.broadcast(JSON.stringify(response))
					break;
				case "endGame":
					response = {
						type: "endLobby",
						feedback: "", // personalised feedback unimplemented
						leaderboard: this.userScores
					}
					// TODO personalise feedback, general feedback of everyone for host
					this.inEndLobby = true;
					this.room.broadcast(JSON.stringify(response))
					break;
				/* default:
					console.error(`Host command ${message_json} not supported`)
					break; */
			}
			return
		}

		// user responses
		switch (message_json.type) {
			case "questionAnswer":
				if (!this.inQuestions) return
				let correct;
				let feedback
				if (message_json.answer == questions[this.qNum].answer) {
					correct = true;
					this.userScores.set(sender.id, (this.userScores.get(sender.id) || 0) + 1000)
				} else {
					correct = false;
					feedback = "Feedback for if wrong" // TODO add AI?
				}
				response = {
					type: "feedback",
					correct,
					feedback,
					timeout: false,
					answer: questions[this.qNum].answer,
					questionInfo: questions[this.qNum].info
				}
				sender.send(JSON.stringify(response))
				this.usersPendingAnswers.delete(sender.id)
				break;
		
/* 			default:
				break; */
		}
	}
}


Server satisfies Party.Worker;
