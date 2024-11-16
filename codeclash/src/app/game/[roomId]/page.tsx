import { GameNotFound } from "@/components/game-not-found";
import BackendHookup from "@/components/backendHookup";
import { PARTYKIT_HOST } from "@/app/env";

async function checkRoomExists(roomId: string) {
  try {
    const res = await fetch(`http://${PARTYKIT_HOST}/party/${roomId}`, {
      method: 'HEAD',
      cache: 'no-store'
    });
    return res.status !== 404;
  } catch (e) {
    return false;
  }
}

export default async function GameRoom({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = await params
  const roomExists = true // isnt needed, room auto created if doesnt exist
  //const roomExists = await checkRoomExists(roomId);

  if (!roomExists) {
    return <GameNotFound />;
  }

  return <BackendHookup roomID={roomId} />;
} 
