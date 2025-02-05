import MultiplayerPageClient from "./page.client";

const MultiplayerPage = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;
  return <MultiplayerPageClient roomId={roomId} />;
};

export default MultiplayerPage;
