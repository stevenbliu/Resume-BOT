// components/Projects.jsx
export default function Projects() {
  return (
    <section style={{ margin: "40px 0" }}>
      <h2>Projects</h2>
      <div>
        <div style={{ marginBottom: 24 }}>
          <h3>Ship Routing Simulation API</h3>
          <p>
            Built a monolithic RESTful API using Django for ship routing simulation, optimizing routes and simulating ship movements.
          </p>
          <a href="https://github.com/yourusername/ship-routing" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        {/* Add more projects here */}
      </div>
    </section>
  );
}