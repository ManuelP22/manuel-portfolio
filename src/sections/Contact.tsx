import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 md:scroll-mt-28 py-24 md:py-32 border-t border-secondary/60 bg-base text-accent"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-6 text-accent"
      >
        Contacto
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-accent/80"
      >
        <p>¿Construimos algo juntos? Escríbeme:</p>
        <a
          href="mailto:tucorreo@dominio.dev"
          className="underline underline-offset-4 hover:text-accent font-medium"
        >
          tucorreo@dominio.dev
        </a>
      </motion.div>
    </section>
  );
}
