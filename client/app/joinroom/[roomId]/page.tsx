import React from "react";
import { JoinRoomPageClient } from "./page.client";

const JoinRoomPage = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;

  return (
    <>
      <JoinRoomPageClient roomId={roomId} />
    </>
  );
};

export default JoinRoomPage;
