import React, { useState } from "react";
import "./App.css"; // Make sure to import the CSS file for styling

type Message = {
  text: string;
  sender: "ai" | "user";
};
const functionUrl = "https://xxxxxxxxx.lambda-url.eu-west-2.on.aws/";

function App() {
  const [newInputValue, setNewInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Ahoy! How can I assist ye today?",
      sender: "ai",
    },
    {
      text: "What is the capital of India?",
      sender: "user",
    },
    {
      text: "The capital of India be New Delhi",
      sender: "ai",
    },
  ]);
  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setNewInputValue("");
    const data: Message[] = [
      ...messages,
      { text: newInputValue, sender: "user" },
    ];
    setMessages(data);
    const response = await fetch(functionUrl, {
      method: "POST",
      body: JSON.stringify({ messages: data }),
    });
    setMessages([
      ...data,
      {
        sender: "ai",
        text: await response.text(),
      },
    ]);
  };
  return (
    <>
      <div className="marquee">
        <p>This is a AI Chat Bot! Some times it give wrong answer!</p>
      </div>
      <main className="chat-container">
        <h1 className="title">AI Chat Bot</h1>
        <div className="chat-box">
          {messages.map((mes) => {
            return mes.sender == "ai" ? (
              <p className="message ai">{mes.text}</p>
            ) : (
              <p className="message user">{mes.text}</p>
            );
          })}
        </div>
        <form className="chat-form" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Message"
            className="input-field"
            value={newInputValue}
            onChange={(e) => setNewInputValue(e.currentTarget.value)}
          />
          <input type="submit" value="Send" className="submit-btn" />
        </form>
      </main>
    </>
  );
}

export default App;
