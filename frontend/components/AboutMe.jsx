// components/AboutMe.jsx
export default function AboutMe() {
  return (
    <section style={{ margin: "40px 0" }}>
      {/* <img
        src="/profile.jpg"
        alt="Steven Liu"
        style={{ width: 120, borderRadius: "50%", marginBottom: 16 }}
      /> */}

        <h1 style={{
          fontSize: 38, fontWeight: 800, color: "#0078d4", marginBottom: 12,
          letterSpacing: "-1px"
        }}>
          Steven Liu's Resume Chatbot5
        </h1>

      <h2>About Me</h2>
      <p>
        Hi, I'm Steven Liu, a software engineer based in San Francisco. I specialize in backend development, data engineering, and building scalable systems.
      </p>
    </section>
  );
}