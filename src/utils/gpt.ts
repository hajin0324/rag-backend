import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const callGPTAPI = async (question: string, context: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are assistant." },
      { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` },
    ],
    max_tokens: 150,
  });

  return response.choices?.[0]?.message?.content?.trim() || "No response available.";
};
