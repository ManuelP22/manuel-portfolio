// src/components/Section.tsx
import { motion } from "framer-motion";

export default function Section({ id, title }: { id: string; title: string }) {
  return (
    <section
      id={id}
      className="snap-start h-screen flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.6, once: false }} // re-anima al volver
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center"
      >
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4">{title}</h2>
        <p className="text-accent/80">
          Contenido de {title}. Reemplaza con tu Hero/About/Projects/Contact.
        </p>
      </motion.div>
    </section>
  );
}
