import { ENDPOINTS } from "@/constants/endpoints";
import { conversePrompt } from "@/constants/prompt";

export async function getCompletions(text: string) {
  const messages: any[] = [
    {
      role: "system",
      content: conversePrompt,
    },
    { role: "user", content: text },
  ];

  console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);

  const data = {
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 128,
  };

  const completionsRes = await fetch(ENDPOINTS.completions, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const completions = await completionsRes.json();

  console.log("chatbot: ", completions.choices[0].message?.content);

  const response = completions.choices[0].message?.content;

  return response;
}
