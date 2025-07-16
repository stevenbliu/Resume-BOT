import { motion } from "framer-motion";

const projects = [
  { title: "Project A", description: "Cool project description" },
  { title: "Project B", description: "Another cool thing" },
];

type ProjectsProps = {
  darkMode: boolean;
};

export default function Projects({ darkMode }: ProjectsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: 24,
      }}
    >
      {projects.map(({ title, description }) => (
        <motion.div
          key={title}
          whileHover={{ scale: 1.05 }}
          style={{
            padding: 20,
            borderRadius: 16,
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            background: "#fff",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
          tabIndex={0}
          aria-label={`Project: ${title}`}
        >
          <h3>{title}</h3>
          <p>{description}</p>
          {/* Could add modal trigger here */}
        </motion.div>
      ))}
    </div>
  );
}
