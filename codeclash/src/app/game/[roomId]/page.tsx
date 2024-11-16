import BackendHookup from "@/components/backendHookup";
import { PARTYKIT_HOST } from "@/app/env";

export default async function GameRoom({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params

  return <BackendHookup roomID={roomId} />;
} 
