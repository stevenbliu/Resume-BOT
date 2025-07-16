"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import AboutMe from "../components/AboutMe";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import { motion } from "framer-motion";
import FancySection from "../components/FancySection";
import ConfettiOnScrollWithToggle from "../components/ConfettiOnScroll";

// Lazy load heavy components to speed up initial bundle
const ChatbotModal = dynamic(() => import("./ChatbotModal"), { ssr: false });
const ParticleBackground = dynamic(() => import("../components/ParticleBackground"), { ssr: false });

// Styles moved outside render to avoid recreating objects each render
const backToTopStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 40,
  right: 40,
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  background: "#0078d4",
  color: "#fff",
  fontSize: 24,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const headerStyle = (darkMode: boolean): React.CSSProperties => ({
  position: "sticky",
  top: 0,
  background: darkMode ? "rgba(18,18,18,0.9)" : "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  zIndex: 1000,
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  padding: "12px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontFamily: "'Inter', sans-serif",
});

const navButtonStyle = (darkMode: boolean): React.CSSProperties => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  color: darkMode ? "#ddd" : "#333",
  fontSize: 16,
  textTransform: "capitalize",
  padding: "6px 12px",
});

const themeToggleStyle = (darkMode: boolean): React.CSSProperties => ({
  fontSize: 20,
  cursor: "pointer",
  background: "none",
  border: "none",
  color: darkMode ? "#fff" : "#222",
  userSelect: "none",
});

const scrollProgressBarStyle = (scrollPercent: number): React.CSSProperties => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: `${scrollPercent}%`,
  height: 4,
  background: "linear-gradient(90deg, #0078d4 0%, #00c6fb 100%)",
  zIndex: 1500,
  transition: "width 0.2s ease-out",
});

const glassSectionStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.25)",
  borderRadius: 20,
  padding: "36px 24px",
  marginBottom: 36,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
};

// Memoized components

const BackToTop = memo(() => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.pageYOffset > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button onClick={scrollToTop} aria-label="Back to top" style={backToTopStyle}>
      ↑
    </button>
  );
});

interface HeaderProps {
  onToggleTheme: () => void;
  darkMode: boolean;
}

const Header = memo(({ onToggleTheme, darkMode }: HeaderProps) => {
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <header style={headerStyle(darkMode)}>
      <nav style={{ display: "flex", gap: 20 }}>
        {["about", "projects", "skills", "contact"].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            style={navButtonStyle(darkMode)}
            aria-label={`Go to ${section} section`}
          >
            {section}
          </button>
        ))}
      </nav>
      <button onClick={onToggleTheme} aria-label="Toggle dark/light mode" style={themeToggleStyle(darkMode)}>
        {darkMode ? "🌞" : "🌙"}
      </button>
    </header>
  );
});

const ScrollProgress = memo(() => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollPercent(scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div aria-hidden="true" style={scrollProgressBarStyle(scrollPercent)} />;
});

interface GlassSectionProps {
  id: string;
  children: React.ReactNode;
}

const GlassSection = memo(({ id, children }: GlassSectionProps) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    style={glassSectionStyle}
  >
    {children}
  </motion.section>
));

export default function Home() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Consolidated scroll handler for background CSS variable
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const root = document.documentElement;

      if (scrollY < 500) {
        root.style.setProperty("--bg", "#141E30");
      } else if (scrollY < 1000) {
        root.style.setProperty("--bg", "#243B55");
      } else {
        root.style.setProperty("--bg", "#1e3c72");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect system theme preference on load
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  // Toggle dark/light theme
  const toggleTheme = useCallback(() => setDarkMode((prev) => !prev), []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(120deg, #141E30 0%, #243B55 100%)"
          : "linear-gradient(120deg,#e0eafc 0%,#cfdef3 100%)",
        color: darkMode ? "#ddd" : "#222",
        fontFamily: "Inter,Segoe UI,sans-serif",
        transition: "background 0.5s ease, color 0.5s ease",
      }}
    >
      <ConfettiOnScrollWithToggle />

      <ScrollProgress />
      <FancySection>
        <Header onToggleTheme={toggleTheme} darkMode={darkMode} />
      </FancySection>

      <main
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "80px 24px 40px 24px",
          position: "relative",
          zIndex: 10, // Ensure content is above particle background
        }}
      >
        <FancySection>
          <GlassSection id="about">
            <AboutMe darkMode={darkMode} />
          </GlassSection>
        </FancySection>

        <GlassSection id="projects">
          <Projects darkMode={darkMode} />
        </GlassSection>

        <GlassSection id="skills">
          <Skills darkMode={darkMode} />
        </GlassSection>

        <FancySection>
          <GlassSection id="contact">
            <Contact darkMode={darkMode} />
          </GlassSection>
        </FancySection>
      </main>

      <ParticleBackground />

      {/* Floating Chat Icon with pulse animation */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: 12,
          userSelect: "none",
        }}
      >
        <motion.span
          animate={{
            opacity: [1, 0.6, 1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: darkMode ? "#222" : "#fff",
            color: "#0078d4",
            padding: "6px 14px",
            borderRadius: 16,
            fontWeight: 600,
            boxShadow: darkMode
              ? "0 2px 8px rgba(255,255,255,0.1)"
              : "0 2px 8px rgba(0,0,0,0.08)",
            fontSize: 15,
            userSelect: "none",
          }}
        >
          Chat with my resume?
        </motion.span>

        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "linear-gradient(90deg,#0078d4 0%,#00c6fb 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 64,
            height: 64,
            fontSize: 32,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            userSelect: "none",
          }}
          aria-label="Open Chatbot"
        >
          💬
        </motion.button>
      </div>

      <ChatbotModal open={open} onClose={() => setOpen(false)} />

      <BackToTop />
    </div>
  );
}
