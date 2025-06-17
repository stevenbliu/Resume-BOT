// app/page.jsx
"use client";
import React, { useState } from "react";
import AboutMe from "../components/AboutMe";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import ChatbotModal from "./ChatbotModal";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg,#e0eafc 0%,#cfdef3 100%)",
      fontFamily: "Inter,Segoe UI,sans-serif"
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px 24px 24px" }}>
        <AboutMe />
        <Projects />
        <Skills />
        <Contact />
      </div>
      {/* Floating Chat Icon with label */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, display: "flex", alignItems: "center" }}>
        <span style={{
          marginRight: 12,
          background: "#fff",
          color: "#0078d4",
          padding: "6px 14px",
          borderRadius: 16,
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          fontSize: 15
        }}>
          Chat with my resume?
        </span>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "linear-gradient(90deg,#0078d4 0%,#00c6fb 100%)",
            color: "#fff", border: "none", borderRadius: "50%",
            width: 64, height: 64, fontSize: 32, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)"
          }}
          aria-label="Open Chatbot"
        >
          💬
        </button>
      </div>
      <ChatbotModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}