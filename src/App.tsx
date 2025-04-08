import React, { useState, useEffect } from "react";
import "./App.css";

type Message = {
  text: string;
  sender: "model" | "user";
};

const App = () => {
  const [newInputValue, setNewInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInputValue.trim() || isLoading) return;
    const userMessage = { text: newInputValue, sender: "user" as const };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewInputValue("");
    setIsLoading(true);

    const history = updatedMessages.map((msg) => ({
      role: msg.sender,
      parts: [{ text: msg.text }],
    }));

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history }),
      });
      const response = await res.json();
      const modelText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response available";

      setMessages([...updatedMessages, { text: modelText, sender: "model" }]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          sender: "model",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "🤖 Hello human. I’m Sharath Bot. How can I assist you today?",
          sender: "model",
        },
      ]);
    }
  }, []);
  useEffect(() => {
    const container = document.querySelector("#chat-container");
    container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* floating particles */}
        <div className="absolute inset-0 z-0 animate-bg-blur space-particles" />

        {/* Human figure animation */}
        {isLoading && (
          <div className="absolute top-4 right-4 z-10 animate-pulse-slow flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-full shadow-lg relative flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
            <p className="text-xs mt-1 text-slate-300">Bot typing...</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center p-4 bg-gradient-to-r from-yellow-400 to-pink-400 shadow-lg z-10 relative rounded-b-xl">
          <h1 className="text-3xl font-extrabold tracking-wide animate-glow">
            🌐 Sharath ChatBot Universe
          </h1>
          <p className="text-sm mt-1">"Powered by Artificial Intelligence."</p>
        </div>

        {/* Main chat window */}
        <main className="z-10 relative flex flex-col items-center mt-6 px-4 sm:px-6 md:px-8">
          <div
            id="chat-container"
            className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-inner border border-white/20 max-h-[70vh] md:max-h-[80vh] overflow-y-auto space-y-4"
          >
            {messages.map((mes, index) => (
              <div
                key={index}
                className={`rounded-3xl px-5 py-3 text-sm transition-all shadow-md break-words whitespace-pre-wrap
                ${
                  mes.sender === "user"
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white self-end ml-auto animate-user-bubble"
                    : "bg-gradient-to-br from-gray-300 to-white text-black self-start mr-auto animate-bot-bubble"
                }
                max-w-[85%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%]
              `}
              >
                {mes.text}
              </div>
            ))}
            {isLoading && (
              <div className="text-sm italic text-gray-400 animate-pulse">
                Generating reply...
              </div>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="mt-6 flex flex-wrap gap-4 w-full max-w-3xl"
          >
            <input
              type="text"
              placeholder="Send a message..."
              className="flex-1 min-w-[0] p-3 rounded-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newInputValue}
              onChange={(e) => setNewInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-semibold transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default App;
