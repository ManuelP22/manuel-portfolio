import type { ComponentType, ReactNode } from "react";

/** App ahora soporta icono por componente o por imagen */
export type App = {
  id?: string;
  title: string;
  description?: string;

  // Icono vectorial (Lucide, etc.) — opcional
  icon?: ComponentType<{ className?: string }>;

  // Icono por imagen — opcional
  iconImage?: string;           // ruta pública (ej: "/images/bunny.png")
  dockFillIcon?: boolean;       // si quieres usarlo en el dock a pantalla completa
  dockImageFit?: "cover" | "contain" | "fill" | "none" | "scale-down";

  gradient?: string;
  content?: ReactNode | (() => ReactNode);
  onClick?: () => void;
};

/** OS mínimo… (sin cambios) */
export type OsLike = {
  toggle: (args: { id: string; title: string; content: ReactNode }) => void;
  open?: (args: { id: string; title: string; content: ReactNode }) => void;
};

export function resolveAppContent(
  c?: ReactNode | (() => ReactNode)
): ReactNode | undefined {
  return typeof c === "function" ? (c as () => ReactNode)() : c;
}

export function openApp(os: OsLike, app: App): void {
  if (app.onClick) {
    app.onClick();
    return;
  }
  if (!app.id) return;

  const content: ReactNode = resolveAppContent(app.content) ?? null;

  const payload = { id: app.id, title: app.title, content };
  if (typeof os.open === "function") os.open(payload);
  else os.toggle(payload);
}
