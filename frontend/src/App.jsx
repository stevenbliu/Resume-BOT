import Chatbot from "./Chatbot";
import { SocialSidebar } from "./components/SocialSidebar";
import ParticleBackground from "./components/ParticleBackground";

function App() {
  return (
    <>
      {/* Particle background fixed behind all content */}
      <ParticleBackground
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          pointerEvents: "none", // So it doesn't block clicks
        }}
      />

      <SocialSidebar />
      <Chatbot />
    </>
  );
}

export default App;
