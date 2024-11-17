
import type * as Party from "partykit/server";
import * as Messages from "@/types/messages"

import {questions} from "./questions"
import * as db from "@/server/dbOperations";

export default class Server implements Party.Server {
	host = "";
	qNum = 0;
	inQuestions = false;
	inEndLobby = false;
	userScores: Map<string, number> = new Map()
	usersPendingAnswers: Set<string> = new Set() 
	MAX_QUESTIONS = 3
	gameStarted = false;

	constructor(readonly room: Party.Room) {
		console.log("Room created:", room.id);
	}

	async onStart() {
		// Load any saved state
		const savedHost = await this.room.storage.get("host");
		if (savedHost) {
			this.host = savedHost as string
		}
	}

	async onConnect(connection: Party.Connection) {
		// First connection becomes host
		if (this.host == "") {
			this.host = connection.id;
			connection.send(JSON.stringify({
				type: "userJoin",
				isHost: true
			}))
			this.room.storage.put("host", this.host)
			return;
		}

		// Send current game state to new players
		connection.send(JSON.stringify({
			type: "userJoin",
			isHost: false
		}))
		this.updateScore(connection.id, 0)
	}

	updateScore(userID: string, scoreIncrease: number): void {
		this.userScores.set(userID, (this.userScores.get(userID) || 0) + scoreIncrease)
		// Update leaderboard for all
		this.room.broadcast(JSON.stringify({
			type: "leaderboardUpdate",
			leaderboard: [...this.userScores].reduce((acc, [key, value]) => {
				//@ts-ignore
				acc[key] = value;
				return acc;
			}, {})
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
					if (!this.gameStarted) {
						this.gameStarted = true
						const players: { user_id: string, username: string }[] = []
						for (const playID in this.room.getConnections()) {
							players.push({user_id: playID, username: playID});
						}
						db.createGame(this.room.id)
					}
					
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
						gameOver: false,
						currentQuestion: this.qNum + 1,
						totalQuestions: questions.length
					}
					this.qNum += 1
					if (this.qNum >= questions.length || this.qNum >= this.MAX_QUESTIONS) {
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
						leaderboard: [...this.userScores].reduce((acc, [key, value]) => {
							//@ts-ignore
							acc[key] = value;
							return acc;
						}, {})
					}
					await db.finalizeGame()
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
					this.updateScore(sender.id, 1000)
				} else {
					correct = false;
					feedback = questions[this.qNum].explanation
				}

				db.addUserAnswer()

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
