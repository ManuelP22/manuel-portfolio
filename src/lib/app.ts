import type { ComponentType, ReactNode } from "react";

/** Tipo único y compartido para las “apps” (StartMenu, Desktop, Taskbar, etc.) */
export type App = {
  id?: string; // si hay id, usaremos os.open/os.toggle por defecto
  title: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
  gradient?: string; // ej: "from-green-500 to-emerald-700"
  content?: ReactNode | (() => ReactNode);
  onClick?: () => void; // si lo defines, tiene prioridad
};

/** OS mínimo para abrir/togglear ventanas sin acoplar al provider concreto
 *  ⟵ content es REQUERIDO para que sea compatible con tu OSApi.toggle(WindowConfig)
 */
export type OsLike = {
  toggle: (args: { id: string; title: string; content: ReactNode }) => void;
  open?: (args: { id: string; title: string; content: ReactNode }) => void;
};

/** Resuelve contenido “perezoso” (función) o lo retorna tal cual si es ReactNode */
export function resolveAppContent(
  c?: ReactNode | (() => ReactNode)
): ReactNode | undefined {
  return typeof c === "function" ? (c as () => ReactNode)() : c;
}

/** Abre/ejecuta una App con onClick (si existe) o usando os.open/os.toggle */
export function openApp(os: OsLike, app: App): void {
  if (app.onClick) {
    app.onClick();
    return;
  }
  if (!app.id) return;

  // Aseguramos content SIEMPRE (null es un ReactNode válido)
  const content: ReactNode = resolveAppContent(app.content) ?? null;

  const payload = {
    id: app.id,
    title: app.title,
    content,
  };

  if (typeof os.open === "function") os.open(payload);
  else os.toggle(payload);
}
