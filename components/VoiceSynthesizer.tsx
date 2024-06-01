"use client";

import { useEffect, useState } from "react";

type State = {
  sender: string;
  response: string | null | undefined;
};

function VoiceSynthesizer({ state }: { state?: State }) {
  const [audio, setAudio] = useState<any>(null);

  useEffect(() => {
    async function getSpeech() {
      if (!state || !state.response) return;

      const ttsResponse = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: state.response,
        }),
      });

      if (!ttsResponse.ok) {
        const error = await ttsResponse.json();
        throw new Error(`HTTP error! status: ${JSON.stringify(error)}`);
      }

      // Get the response body as Blob
      const blob = await ttsResponse.blob();

      // Create a URL for the Blob
      const audioUrl = URL.createObjectURL(blob);
      setAudio(audioUrl);
    }

    getSpeech();
  }, [state?.response]);

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {audio && (
        <audio
          style={{ visibility: "hidden", height: 0 }}
          autoPlay
          controls
          src={audio}
        >
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default VoiceSynthesizer;
