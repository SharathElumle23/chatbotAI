import type { Message } from "../types.ts";

export type Provider = "gemini" | "groq";

export async function generateGeminiContent(
  currentMessages: Message[],
  apiKey: string
): Promise<string> {
  const history = currentMessages.map((msg) => ({
    role: msg.sender,
    parts: [{ text: msg.text }],
  }));

  const primaryModel = import.meta.env.VITE_GEMINI_MODEL?.toString().trim();
  const fallbackModel = "gemini-2.5-flash";

  const buildApiUrl = (model: string) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const tryGenerate = async (model: string) => {
    const apiUrl = buildApiUrl(model);
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    });

    const response = await res.json().catch(() => ({}));
    const modelText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response available";

    return { res, response, modelText };
  };

  const modelToTry = primaryModel || fallbackModel;

  const { res, response, modelText } = await tryGenerate(modelToTry);

  // If the model name is wrong/unavailable, Gemini returns 404.
  // If the model is experiencing high demand, Gemini returns 503.
  if (res.status === 404 || res.status === 503) {
    const { res: fallbackRes, response: fallbackResponse, modelText: fallbackText } =
      await tryGenerate(fallbackModel);

    if (!fallbackRes.ok) {
      const apiMessage =
        fallbackResponse?.error?.message || "Model call failed (fallback).";
      throw new Error(apiMessage);
    }

    return fallbackText;
  }

  if (res.status === 401) {
    throw new Error("Invalid Gemini API Key. Please enter a valid API Key.");
  }

  if (!res.ok) {
    const apiMessage = response?.error?.message || "Model call failed.";
    throw new Error(apiMessage);
  }

  return modelText;
}

export async function generateGroqContent(
  currentMessages: Message[],
  apiKey: string
): Promise<string> {
  // If VITE_GROQ_MODEL is not provided, default to a currently supported Groq model.
  const groqModel = import.meta.env.VITE_GROQ_MODEL?.toString().trim();
  if (!groqModel) {
    throw new Error(
      "Groq model is not set. Please define VITE_GROQ_MODEL in your .env (example: groq/llama3-70b-8192 or a current Groq model ID)."
    );
  }





  const messagesForGroq = currentMessages.map((m) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: groqModel,
      messages: messagesForGroq,
      temperature: 0.7,
    }),
  });

  const response = await res.json().catch(() => ({}));

  if (res.status === 401) {
    throw new Error("Invalid Groq API Key. Please enter a valid API Key.");
  }

  if (!res.ok) {
    const apiMessage = response?.error?.message || "Model call failed.";
    throw new Error(apiMessage);
  }

  return response?.choices?.[0]?.message?.content || "No response available";
}
