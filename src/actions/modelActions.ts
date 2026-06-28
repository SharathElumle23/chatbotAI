import type { Message } from "../types";

export async function generateGeminiContent(messages: Message[]): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, provider: "gemini" }),
  });
  if (!response.ok) throw new Error("Failed to get response from Gemini");
  const data = await response.json();
  return data.text;
}

export async function generateGroqContent(messages: Message[]): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, provider: "groq" }),
  });
  if (!response.ok) throw new Error("Failed to get response from Groq");
  const data = await response.json();
  return data.text;
}
