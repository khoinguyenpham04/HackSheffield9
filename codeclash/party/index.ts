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

	async onConnect(connection: Party.Connection) {
		if (this.room.connections.size == 1) {
			this.host = connection.id;
			
			connection.send(JSON.stringify({
				"type": "userJoin",
				"isHost": true
			}))
			return;
		}
		connection.send(JSON.stringify({
			"type": "userJoin",
			"isHost": false
		}))
	}

	async onMessage(message: string, sender: Party.Connection) {
		const message_json: Messages.UserMessage | Messages.HostMessage = JSON.parse(message);
		
		let response: Messages.ServerMessage;
		if (message_json.sender == "host") {
			// message sent by host
			switch (message_json.type) {
				case "startQuestion":
					response = {
						type: "questionStart",
						questionInfo: questions[this.qNum].info
					}
					this.room.broadcast(JSON.stringify(response))
					this.usersPendingAnswers = new Set([...this.room.getConnections()].map((val) => {return val.id}))
					this.usersPendingAnswers.delete(this.host)
					break;
				case "endQuestion":
					// see if users have not responded
					response = {
						type: "feedback",
						correct: false,
						timeout: true
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
						this.inQuestions = false;
					}
					
					this.room.broadcast(JSON.stringify(response))
					break;
				case "endGame":
					console.error("endgame not implemented")
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
					timeout: false
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
