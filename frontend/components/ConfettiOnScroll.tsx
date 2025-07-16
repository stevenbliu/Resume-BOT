"use client";
import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

export default function ConfettiOnScrollWithToggle() {
  const [enabled, setEnabled] = useState(true);
  const lastY = useRef(0);
  const cooldown = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!enabled || cooldown.current) return;

      const currentY = window.scrollY;

      // Detect crossing over 300px in either direction
      const threshold = 100;

      const crossedDown = lastY.current < threshold && currentY >= threshold;
      const crossedUp = lastY.current > threshold && currentY <= threshold;

      if (crossedDown || crossedUp) {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 },
        });

        cooldown.current = true;
        setTimeout(() => {
          cooldown.current = false;
        }, 1500); // prevent spam/confetti overload
      }

      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled]);

  const toggleConfetti = () => setEnabled((prev) => !prev);

  return (
    <button
      onClick={toggleConfetti}
      style={{
        position: "fixed",
        bottom: 80,
        right: 40,
        padding: "10px 18px",
        borderRadius: 12,
        border: "none",
        background: enabled ? "#0078d4" : "#999",
        color: "#fff",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        fontWeight: "600",
        userSelect: "none",
        zIndex: 9999,
      }}
      aria-pressed={enabled}
      aria-label="Toggle scroll confetti effect"
    >
      {enabled ? "Confetti ON 🎉" : "Confetti OFF 🚫"}
    </button>
  );
}
