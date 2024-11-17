import BackendHookup from "@/components/backendHookup";
import { Question } from "../../../../party/questions"; // Make sure path is correct

export default async function GameRoom({
                                           params,
                                       }: {
    params: { roomId: string };
}) {
    // If you want to pass the initial question:
    const initialQuestion: Question = {
        info: {
            questionType: "multiSelect",
            questionDescription: "Initial question",
            codeSnippet: "",
            answerOptions: []
        },
        answer: "",
        topic: "",
        explanation: ""
    };

    return (
        <BackendHookup
            roomID={params.roomId}
            initialQuestion={initialQuestion}
        />
    );
}