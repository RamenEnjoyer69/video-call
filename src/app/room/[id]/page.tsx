"use client";

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  LiveKitRoom,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [room, setRoom] = useState<string>();
  const [name, setName] = useState<string>();
  const username = searchParams.get("username");

  const [token, setToken] = useState<string | null>(null);

  const [roomInstance] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );

  if (!livekitUrl) {
    throw new Error("Livekit url is not defined.");
  }

  useEffect(() => {
    if (username) {
      setName(username);
    }
  }, [username]);
  useEffect(() => {
    if (id) {
      setRoom(id);
    }
  }, [id]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${room}&username=${name}`);
        const data = await resp.json();
        if (!mounted) return;

        if (data.token) {
          setToken(data.token); // <- Save the token
          await roomInstance.connect(livekitUrl, data.token);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance, room, name]);

  // Show loading while token is being fetched
  if (!token) {
    return <div>Getting token...</div>;
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      serverUrl={livekitUrl}
      room={roomInstance}
      token={token}
      onDisconnected={() => {
        setToken("");
        router.push("/");
      }}
    >
      <div data-lk-theme="default" style={{ height: "100dvh" }}>
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
