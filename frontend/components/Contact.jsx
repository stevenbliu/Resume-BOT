// components/Contact.jsx
export default function Contact() {
  return (
    <section style={{ margin: "40px 0" }}>
      <h2>Contact</h2>
      <p>
        Email: <a href="mailto:steventheliu@gmail.com">steventheliu@gmail.com</a>
      </p>
      <p>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">GitHub</a> |{" "}
        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </p>
    </section>
  );
}