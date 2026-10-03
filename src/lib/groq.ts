import "server-only";

import Groq from "groq-sdk";

let groqClient: Groq | undefined;

export const GROQ_MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  groqClient ??= new Groq({
    apiKey,
    timeout: 15_000,
    maxRetries: 1,
  });

  return groqClient;
}
