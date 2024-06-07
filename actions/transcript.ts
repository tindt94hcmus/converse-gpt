"use server";
import { conversePrompt } from "@/constants/prompt";
import { ENDPOINTS } from "@/constants/endpoints";
import { getCompletions } from "@/api/getCompletions";

async function transcript(prevState: any, formData: FormData) {
  "use server";
  console.log("PREVIOUS STATE:", prevState);

  const id = Math.random().toString(36);

  if (process.env.OPENAI_API_KEY === undefined) {
    console.error("OpenAPI credentials not set");
    return {
      sender: "",
      response: "OpenAPI credentials not set",
    };
  }

  const file = formData.get("file") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  console.log(">>", file);

  // ---   get audio transcription from Azure OpenAI Whisper ----

  console.log("== Transcribe Audio Sample ==");

  formData.append("model", "whisper-1");
  formData.append("language", "en");

  const transcriptionRes = await fetch(ENDPOINTS.whisper, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });
  const { text, error } = await transcriptionRes.json();

  if (transcriptionRes.ok) {
  } else {
    console.log("OPEN AI ERROR:");
    console.log(error.message);
    return;
  }

  console.log(`Transcription: ${text}`);

  const response = await getCompletions(text);

  return {
    sender: text,
    response: response,
    id: id,
  };
}

export default transcript;
