import { ENDPOINTS } from "@/constants/endpoints";

export async function POST(req: Request) {
  const { text } = await req.json();
  const ttsResponse = await fetch(ENDPOINTS.speech, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: "alloy",
      speed: "1.0",
    }),
  });

  return ttsResponse;
}
