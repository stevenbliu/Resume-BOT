"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ChatbotModal({ open, onClose }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me anything about Steven Liu's resume." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8001/answer", {
      // const res = await fetch("http://backend:8001/answer", {
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
    inputRef.current?.focus();
  };

  // Focus input when modal opens or after sending
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", bottom: 80, right: 40, zIndex: 1000,
      background: "rgba(255,255,255,0.97)", border: "none", borderRadius: 16,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)", width: 370, maxHeight: 540, display: "flex", flexDirection: "column",
      backdropFilter: "blur(6px)"
    }}>
      <div style={{
        padding: 16, borderBottom: "1px solid #e0e0e0", display: "flex",
        justifyContent: "space-between", alignItems: "center", background: "linear-gradient(90deg,#0078d4 0%,#00c6fb 100%)", color: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16
      }}>
        <b>Resume Chatbot</b>
        <button onClick={onClose} style={{
          border: "none", background: "none", fontSize: 22, color: "#fff", cursor: "pointer"
        }}>&times;</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#f8fafc" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.sender === "user" ? "right" : "left",
            margin: "10px 0"
          }}>
            <span style={{
              display: "inline-block",
              background: msg.sender === "user" ? "#0078d4" : "#e3e8ee",
              color: msg.sender === "user" ? "#fff" : "#222",
              borderRadius: 12,
              padding: "8px 14px",
              maxWidth: "80%",
              fontSize: 15
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div style={{ color: "#888" }}>Bot is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: 14, borderTop: "1px solid #e0e0e0", background: "#f8fafc", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            width: "70%", padding: 9, borderRadius: 8, border: "1px solid #cfd8dc",
            fontSize: 15, outline: "none", marginRight: 8, background: "#fff"
          }}
          placeholder="Ask about my experience, skills, etc."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
          padding: "9px 18px", background: "linear-gradient(90deg,#0078d4 0%,#00c6fb 100%)",
          color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: "pointer"
        }}>
          Send
        </button>
      </div>
    </div>
  );
}