import { Music, LayoutGrid, ClipboardList } from "lucide-react";

type Project = {
  id: string;
  name: string;
  summary: string;
  highlights: string[];
  stack: string[];
  role?: string;
  repoUrl?: string;
  demoUrl?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string; // Tailwind gradient like "from-purple-500 to-purple-700"
};

const projects: Project[] = [
  {
    id: "luna",
    name: "Luna — Music App",
    summary:
      "Aplicación de música tipo Spotify: búsqueda, vista de artistas y reproducción de previews.",
    highlights: [
      "Búsqueda por canciones/artistas con autosuggest",
      "Top charts por país/categoría",
      "Páginas de artista y detalle de track",
      "Reproductor con cola simple y estado global",
    ],
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "Axios",
      "Shazam API",
    ],
    role: "Frontend completo, integración API",
    repoUrl: "https://github.com/tu-usuario/luna", // opcional
    demoUrl: "https://demo-tu-dominio.app/luna", // opcional
    icon: Music,
    gradient: "from-pink-500 to-purple-700",
  },
  {
    id: "kanban-lite",
    name: "Kanban Lite",
    summary:
      "Gestor de tareas estilo kanban para pequeñas squads. CRUD de tarjetas, columnas y etiquetas.",
    highlights: [
      "Drag & drop fluido (HTML5/Pointer events)",
      "Filtros por etiqueta/estado",
      "Persistencia en API propia",
    ],
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "Axios",
      "C# .NET Web API",
      "SQL Server",
    ],
    role: "Full-stack (API .NET + front)",
    repoUrl: "https://github.com/tu-usuario/kanban-lite",
    icon: ClipboardList,
    gradient: "from-green-500 to-emerald-700",
  },
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    summary:
      "Panel administrativo con métricas, tablas filtrables y gráficos básicos para monitoreo.",
    highlights: [
      "Tablas con paginación/orden y filtros por columna",
      "Autenticación simple (JWT) y roles",
      "Despliegue en IIS",
    ],
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "Axios",
      "C# .NET Web API",
      "SQL Server",
      "IIS",
    ],
    role: "Front principal + soporte de backend",
    repoUrl: "https://github.com/tu-usuario/admin-dashboard",
    icon: LayoutGrid,
    gradient: "from-blue-500 to-indigo-700",
  },
];

export function ProjectsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Selección de proyectos con enfoque en React, APIs REST y un toque de .NET/SQL Server cuando hace falta.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg grid place-items-center bg-gradient-to-br ${p.gradient}`}
              >
                <p.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-medium">{p.name}</h2>
                {p.role && (
                  <p className="text-xs text-muted-foreground">{p.role}</p>
                )}
              </div>
            </div>

            <p className="text-sm">{p.summary}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
                  Highlights
                </h3>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {p.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
                  Stack
                </h3>
                <div className="flex flex-wrap gap-1">
                  {p.stack.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-2 py-1 rounded-md bg-black/10 dark:bg-white/10 hover:bg-black/15 transition"
                >
                  Demo
                </a>
              )}
              {p.repoUrl && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-2 py-1 rounded-md bg-black/10 dark:bg-white/10 hover:bg-black/15 transition"
                >
                  Repo
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
