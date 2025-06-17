// components/Skills.jsx
export default function Skills() {
  return (
    <section style={{ margin: "40px 0" }}>
      <h2>Skills</h2>
      <ul style={{ display: "flex", flexWrap: "wrap", gap: 16, listStyle: "none", padding: 0 }}>
        <li>Python</li>
        <li>Django</li>
        <li>FastAPI</li>
        <li>Docker</li>
        <li>AWS</li>
        <li>Pytest</li>
        <li>Airflow</li>
        <li>React</li>
        {/* Add more skills */}
      </ul>
    </section>
  );
}