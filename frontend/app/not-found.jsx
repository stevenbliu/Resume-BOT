"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: 20,
      fontFamily: "Inter, sans-serif",
    }}>
      <h1 style={{ fontSize: 96, margin: 0 }}>404</h1>
      <p style={{ fontSize: 24, margin: "20px 0" }}>
        Oops! Looks like you wandered off the beaten path. GO BAAAACK!
      </p>

      {/* <img
        src="/funny-404-illustration.svg"
        alt="Funny 404 illustration"
        style={{ maxWidth: 300, width: "100%" }}
      /> */}
      <video autoPlay loop muted playsInline style={{ maxWidth: '70%', maxHeight: '50%', borderRadius: 12 }}>
      <source src="flamingos-404-error-page-waza.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p style={{ marginBottom: 40 }}>
        Maybe check out my <Link href="/projects" style={{color: "#0078d4", textDecoration: "underline"}}>projects</Link> or <Link href="/" style={{color: "#0078d4", textDecoration: "underline"}}>home page</Link>.
      </p>
    </div>
  );
}
