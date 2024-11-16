import usePartySocket from "partysocket/react";

import { PARTYKIT_HOST } from "@/app/env";
import { useState } from "react";

import * as Messages from "@/types/messages";
import { QuestionComponent } from "./question-component";
import { ResultPageComponent } from "./result-page";
import ClientWaitForHost from "./waiting-for-host";
import { Spinner } from "./loading-spinner";
import { HostDisplay } from "./host-display";
import { EndLobby } from "./end-lobby";

export default function BackendHookup(roomID: string) {
	type loading = {type: "loading"}
	const [state, setState] = useState<Messages.ServerMessage | loading | null>(null)
	const [isHost, setHost] = useState<boolean>(false);
	const [leaderboard, setLeaderboard] = useState<Map<string, number>>(new Map())
	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: roomID,
		onMessage(event) {
			const message = JSON.parse(event.data) as Messages.ServerMessage;
			if (message.type == "userJoin") {
				console.log("User is now in the game")
				setHost(message.isHost)
			}
			if (message.type == "leaderboardUpdate") {
				setLeaderboard(message.leaderboard)
				return
			}
			if (message.type == "userLeaves") {
				console.log("User left") 
				// run code for when a user leaves
				return
			}

			setState(message)
		}
	});

	const qAnswerCallback = (answer: string) => {
		const toSend: Messages.UserMessage = {
			type: "questionAnswer",
			sender: "user",
			answer
		}
		socket.send(JSON.stringify(toSend))
		setState({type: "loading"}); // add loading wheel while results are being fetched
	} 

	// setup for host messages here

	const displayChooser = () => {
		if (!state) return <p>Error, state not set</p>
		if (isHost) return <HostDisplay leaderboard={leaderboard}/>
		if (state.type == "endLobby") return <EndLobby host={isHost} feedback={state.feedback} leaderboard={state.leaderboard}/>
		if (state.type == "loading") return <Spinner />
		if (state.type == "leaderboardUpdate") {
			console.error("Leaderboard update passed through entire body")
		}
		if (state.type == "questionEnd") {

		}

		switch (state.type) {
			case "userJoin":
				// Initial waiting for things to start
				return <ClientWaitForHost />
				
			case "questionStart":
				return <QuestionComponent answerCallback={qAnswerCallback} qInfo={state.questionInfo} />
			case "feedback":
				return <ResultPageComponent results={state}/>
			// case "questionEnd":
				// return <ClientWaitForHost />
			case "userLeaves":
				console.error("User left recieved by state chooser")
				return <p>User Left state passed to state chooser, error</p>
		}
		return <p>Unknown state</p>
	}
	return(<div>{ displayChooser() }</div>);
}
