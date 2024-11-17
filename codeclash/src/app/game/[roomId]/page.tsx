import BackendHookup from "@/components/backendHookup";
import { fetchLeetCodeQuestions } from "@/app/api/leetcode-questions";

export default async function GameRoom({
                                         params,
                                       }: {
  params: { roomId: string };
}) {
  // Fetch LeetCode questions
  const questions = await fetchLeetCodeQuestions();

  // Select a random question for the game
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

  return (
      <BackendHookup
          roomID={params.roomId}
          initialQuestion={randomQuestion}
      />
  );
}