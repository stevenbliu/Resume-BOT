import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me anything about Steven Liu's resume." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch("/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.answer || "Sorry, I couldn't find an answer." },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Error contacting the server." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Resume Chatbot</h2>
      <div style={{ border: "1px solid #ccc", padding: 16, minHeight: 200 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <b>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
          </div>
        ))}
        {loading && <div>Bot is typing...</div>}
      </div>
      <div style={{ marginTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ width: "80%", padding: 8 }}
          placeholder="Ask about my experience, skills, etc."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: 8 }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;