import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-24 md:scroll-mt-28 py-24 md:py-32 border-t border-secondary/60 bg-base text-accent"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-6 text-accent"
      >
        Sobre mí
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-2xl text-accent/80"
      >
        Soy desarrollador frontend enfocado en performance, accesibilidad y UI animada.
      </motion.p>
    </section>
  );
}
