type Project = {
  id: string;
  name: string;
  tagline: string;
  stack: string[];
  description: string;
};

const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "UI Playground",
    tagline: "Colección de micro-interacciones y componentes",
    stack: ["React", "TypeScript", "Framer Motion", "Tailwind"],
    description:
      "Un catálogo vivo de patrones UI con ejemplos prácticos y snippets reutilizables.",
  },
  {
    id: "p2",
    name: "Design System Starter",
    tagline: "Base para sistemas de diseño escalables",
    stack: ["React", "Tailwind", "Radix/shadcn"],
    description:
      "Plantilla para construir y documentar un sistema de componentes accesible.",
  },
  {
    id: "p3",
    name: "Portfolio OS",
    tagline: "Este portfolio con look retro/moderno",
    stack: ["React", "TypeScript", "Framer Motion"],
    description:
      "Explora ventanas, dock, launcher y transiciones temáticas al estilo ‘OS’.",
  },
];

export function ProjectsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <header>
        <h1 className="text-xl font-semibold">Projects</h1>
        <p className="text-muted-foreground">Selección de trabajos y prototipos</p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-white/5"
          >
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-muted-foreground">{p.tagline}</p>
            <p className="mt-2 text-sm">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
