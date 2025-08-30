import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <section
      id="home"
      ref={ref}
      className="scroll-mt-24 md:scroll-mt-28 relative py-28 md:py-40 overflow-hidden bg-base text-accent"
    >
      {/* blobs usando la paleta */}
      <motion.div
        className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-accent/20 blur-3xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full bg-secondary/40 blur-3xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative">
        <motion.h1
          style={{ y: titleY, opacity }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          Construyo experiencias web{" "}
          <span className="text-accent">rápidas</span> &{" "}
          <span className="text-accent">elegantes</span>.
        </motion.h1>

        <motion.p
          style={{ y: subtitleY, opacity }}
          className="mt-4 max-w-2xl text-accent/80"
        >
          Frontend Developer • React • TailwindCSS • Animations con Framer Motion • UX-first.
        </motion.p>

        <div className="mt-8 flex gap-3">
          <motion.a
            href="#projects"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-3 rounded-md bg-accent text-base font-medium"
          >
            Ver proyectos
          </motion.a>
          <motion.a
            href="/resume"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-3 rounded-md border border-accent hover:bg-secondary/60"
          >
            Resume
          </motion.a>
        </div>
      </div>
    </section>
  );
}
