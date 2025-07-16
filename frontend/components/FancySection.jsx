import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export default function FancySection({ children }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50, scale: 0.8 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
        whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
            style={{ marginBottom: 48 }}

    >
      {children}
    </motion.div>
  );
}
