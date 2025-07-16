"use client";


import { Particles } from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticleBackground() {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
        <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
            fullScreen: { enable: true, zIndex: -1 },  // <-- This sets the canvas behind
            background: { color: "green" },
            particles: {
            number: { value: 50 },
            size: { value: 2 },
            move: { enable: true, speed: 0.5 },
            opacity: { value: 0.6 },
            links: { enable: true, color: "red", distance: 100 },
            },
            interactivity: {
            events: { onHover: { enable: true, mode: "repulse" } },
            },
        }}
        />

  );
}
