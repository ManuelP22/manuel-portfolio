import { motion } from "framer-motion";

type Project = { title: string; tag: string };

const projects: Project[] = [
  { title: "Dashboard SaaS", tag: "React + Tailwind + Charts" },
  { title: "E-commerce Animado", tag: "React + Framer Motion" },
  { title: "Landing 3D", tag: "React + Three.js (WIP)" },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 md:scroll-mt-28 py-24 md:py-32 border-t border-secondary/60 bg-base text-accent"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-accent">
        Proyectos
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="rounded-lg border border-secondary bg-secondary/20 p-5 hover:border-accent transition"
          >
            <h3 className="font-semibold text-accent">{p.title}</h3>
            <p className="text-sm text-accent/80 mt-2">{p.tag}</p>
            <button className="mt-4 text-sm underline underline-offset-4 hover:text-accent">
              Ver más
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
