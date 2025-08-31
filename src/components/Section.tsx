// src/components/Section.tsx
import { motion } from "framer-motion";
import type React from "react";

export default function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="snap-start h-screen flex"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.6, once: false }} // re-anima al volver
        transition={{ duration: 0.6 }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </section>
  );
}
