// app/particles-test/page.tsx
"use client";

import ParticleBackground from "../../components/ParticleBackground";

export default function ParticlesTestPage() {
  return (
    <div className="animated-background">
      <ParticleBackground />
      <div style={{ position: "relative", zIndex: 1, padding: "2rem" }}>
        <h1>Particles Test Page</h1>
        <p>This page shows the particle background.</p>
      </div>
    </div>
  );
}
