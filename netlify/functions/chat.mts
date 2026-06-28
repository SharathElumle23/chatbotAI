import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: We declare process so TS can compile in this repo.
// Netlify provides process.env at runtime.
declare const process: { env: Record<string, string | undefined> };



export default async (req: Request) => {

  try {
    const { messages, provider } = await req.json();

    if (!messages || !provider) {
      return new Response("Missing messages or provider", { status: 400 });
    }

    if (provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY ?? "";
      const baseUrl = process.env.GOOGLE_GEMINI_BASE_URL;


      const genAI = new GoogleGenerativeAI(apiKey);
      // Gemini model is fixed here; override via function code if you truly need dynamism.

      const model = genAI.getGenerativeModel(
        { model: "gemini-2.5-flash" },
        baseUrl ? { baseUrl } : undefined
      );


      // Gemini requires history starting from the first user turn
      const firstUserIndex = messages.findIndex(
        (m: { sender: string }) => m.sender === "user"
      );
      const historyMessages =
        firstUserIndex === -1 ? [] : messages.slice(firstUserIndex, -1);
      const lastUserMessage = messages[messages.length - 1];

      const history = historyMessages.map((m: { text: string; sender: string }) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastUserMessage.text);
      const text = result.response.text();

      return Response.json({ text });
    }

    if (provider === "groq") {
      const apiKey = process.env.GROQ_API_KEY ?? "";



      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: messages.map((m: { text: string; sender: string }) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Groq error: ${err}`);
      }

      const data = await response.json();
      return Response.json({ text: data.choices[0].message.content });
    }

    return new Response("Invalid provider", { status: 400 });
  } catch (err) {
    console.error("Chat function error:", err);
    return new Response("Internal server error", { status: 500 });
  }
};


// (intentionally no Netlify config export here)

