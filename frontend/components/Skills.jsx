import { motion } from "framer-motion";

const skills = [
  { name: "React", level: 90 },
  { name: "JavaScript", level: 85 },
  { name: "Python", level: 80 },
];

export default function Skills() {
  return (
    <div>
      {skills.map(({ name, level }) => (
        <div key={name} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{name}</div>
          <div
            style={{
              height: 12,
              width: "100%",
              background: "#ddd",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${level}%` }}
              transition={{ duration: 1.2 }}
              style={{
                height: "100%",
                background: "#0078d4",
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
