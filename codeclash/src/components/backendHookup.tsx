'use client'

import usePartySocket from "partysocket/react";
import { PARTYKIT_HOST } from "../app/env";
import { useState } from "react";
import * as Messages from "@/types/messages";
import { QuestionComponent } from "./question-component";
import { ResultPageComponent } from "./result-page";
import ClientWaitForHost from "./waiting-for-host";
import { Spinner } from "./loading-spinner";
import { HostDisplay } from "./host-display";
import { EndLobby } from "./end-lobby";
import {Question} from "../../party/questions";


interface BackendHookupProps {
	roomID: string;
	initialQuestion?: Question; // Make it optional with ?
}

export default function BackendHookup({ roomID, initialQuestion }: BackendHookupProps) {
	const [state, setState] = useState<Messages.ServerMessage | { type: "loading" } | null>(null);
	const [isHost, setHost] = useState<boolean>(false);
	const [leaderboard, setLeaderboard] = useState<Map<string, number>>(new Map());
	const [error, setError] = useState<string | null>(null);

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: roomID,
		onMessage(event) {
			try {
				const message = JSON.parse(event.data) as Messages.ServerMessage;
				console.log("Received message:", message);

				if (message.type === "userJoin") {
					setHost(message.isHost);
					console.log("host set")
					return;
				} 
				
				console.log(isHost)

				if (message.type === "leaderboardUpdate") {
					setLeaderboard(new Map(Object.entries(message.leaderboard)));
					return;
				}

				setState(message);
			} catch (e) {
				console.error("Error processing message:", e);
				setError("Failed to process server message");
			}
		},
		onClose() {
			setError("Connection lost. Please refresh the page.");
		},
		onError() {
			setError("Failed to connect to game server");
		}
	});

	const hostControls = {
		startQuestion: () => {
			const message: Messages.HostMessage = {
				sender: "host",
				type: "startQuestion"
			};
			socket.send(JSON.stringify(message));
			setState({ type: "loading" });
		},
		endQuestion: () => {
			const message: Messages.HostMessage = {
				sender: "host",
				type: "endQuestion"
			};
			socket.send(JSON.stringify(message));
		},
		endGame: () => {
			const message: Messages.HostMessage = {
				sender: "host",
				type: "endGame"
			};
			socket.send(JSON.stringify(message));
		}
	};

	const answerCallback = (answer: string) => {
		const message: Messages.UserMessage = {
			sender: "user",
			type: "questionAnswer",
			answer
		};
		socket.send(JSON.stringify(message));
		setState({ type: "loading" });
	};

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="bg-red-50 p-4 rounded-lg text-red-700">
					<p>{error}</p>
					<button 
						onClick={() => window.location.reload()}
						className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	
	if (isHost) return <div className="min-h-screen"><HostDisplay leaderboard={leaderboard} controls={hostControls} /></div>
	if (!state ) return <Spinner />;

	return (
		<div className="min-h-screen">
			{
				displayGameState(state, answerCallback)
			}
		</div>
	);
}

function displayGameState(
	state: Messages.ServerMessage | { type: "loading" },
	answerCallback: (answer: string) => void
) {
	switch (state.type) {
		case "loading":
			return <Spinner />;
		case "userJoin":
			return <ClientWaitForHost />;
		case "questionStart":
			return <QuestionComponent answerCallback={answerCallback} qInfo={state.questionInfo} />;
		case "questionEnd":
			return (
				<ClientWaitForHost
					message={`Question ${state.currentQuestion} of ${state.totalQuestions} completed`}
				/>
			);
		case "feedback":
			return <ResultPageComponent results={state} />;
		case "endLobby":
			return (
				<EndLobby
					host={false}
					feedback={state.feedback}
					leaderboard={new Map(Object.entries(state.leaderboard))}
				/>
			);
		default:
			return <ClientWaitForHost />;
	}
}
