import BackendHookup from "@/components/backendHookup";

export default async function GameRoom({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params

  //@ts-expect-error
  return <BackendHookup roomID={roomId} />;
} 
