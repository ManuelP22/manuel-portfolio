import { useEffect, useMemo, useState } from "react";
import { useOS } from "@/context/OSProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { StartMenu } from "./StartMenu";
import { Grid3X3 } from "lucide-react";
import { menuOptions } from "./utils";

export function Taskbar() {
  const theme = useTheme();
  const { isRetro } = theme;
  const os = useOS();
  const [startOpen, setStartOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Reloj (cada 30s)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Atajos: Meta -> toggle Start, Esc -> cierra
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Meta") setStartOpen((s) => !s);
      if (e.key === "Escape") setStartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleStart = () => setStartOpen((s) => !s);

  // Lookup para estilos/íconos del StartMenu
  const appMeta = useMemo(() => {
    // key por id; fallback por título en minúsculas
    const entries = menuOptions.map((o) => {
      const key = (o.id ?? o.title)?.toLowerCase();
      return [
        key,
        {
          Icon: o.icon,
          gradient: o.gradient ?? "from-blue-500 to-indigo-700",
          title: o.title,
        },
      ] as const;
    });
    return Object.fromEntries(entries) as Record<
      string,
      { Icon: React.ComponentType<{ className?: string }>; gradient: string; title: string }
    >;
  }, []);

  // Click en una app del dock
  const onAppClick = (id: string) => {
    const w = os.getWindow?.(id) ?? os.windows.find((x) => x.id === id);
    if (!w) return;
    if (!isRetro && w.isFocused && w.state !== "minimized") {
      os.minimize(id);
    } else {
      os.toggle({
        id: w.id,
        title: w.title,
        content: w.content,
        bounds: w.bounds,
        icon: w.icon,
      });
    }
  };

  // ============== MODERNO (dock centrado + reloj) ==============
  if (!isRetro) {
    return (
      <>
        {/* Dock flotante centrado */}
        <div className="os-taskbar modern" role="menubar" aria-label="Dock">
          <button
            className="start-btn modern"
            onClick={toggleStart}
            aria-expanded={startOpen}
            aria-controls="start-menu"
            aria-label="Open Launcher"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>

          {os.windows.map((w) => {
            // clave para buscar estilos
            const key = (w.id ?? w.title)?.toLowerCase();
            const meta = key ? appMeta[key] : undefined;

            // 1) Si la ventana trae su propio icono (w.icon), lo mostramos dentro de la “pastilla”
            // 2) Si no, usamos el Icon + gradient definido en menuOptions (si existe)
            // 3) Si no hay nada, fallback a inicial del título
            let content: React.ReactNode;
            if (w.icon) {
              content = (
                <span className="grid place-items-center w-7 h-7 rounded-lg bg-white/10">
                  {/* el propio icono de la ventana */}
                  <span className="grid place-items-center w-5 h-5">{w.icon}</span>
                </span>
              );
            } else if (meta) {
              const { Icon, gradient } = meta;
              content = (
                <span
                  className={`grid place-items-center w-7 h-7 rounded-lg bg-gradient-to-br ${gradient}`}
                >
                  <Icon className="w-4.5 h-4.5 text-white" />
                </span>
              );
            } else {
              content = (
                <span className="text-white/90 text-sm font-semibold">
                  {w.title?.charAt(0).toUpperCase()}
                </span>
              );
            }

            return (
              <button
                key={w.id}
                className={`taskbtn modern ${
                  w.isFocused && w.state !== "minimized" ? "is-active" : ""
                }`}
                onClick={() => onAppClick(w.id)}
                aria-pressed={w.isFocused && w.state !== "minimized"}
                title={w.title}
              >
                {content}
                {w.state !== "minimized" && <span className="dock-indicator" />}
              </button>
            );
          })}
        </div>

        {/* Reloj estilo glass (inferior derecha) */}
        <div
          className="fixed bottom-5 right-5 z-50 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl px-3 py-1 shadow-2xl text-white text-xs"
          aria-label="clock"
        >
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>

        {/* Launcher centrado */}
        <StartMenu
          open={startOpen}
          onClose={() => setStartOpen(false)}
          centered
          width={760}
          height={560}
          items={menuOptions}
        />
      </>
    );
  }

  // ================= RETRO =================
return (
    <>
      <div className="os-taskbar" role="menubar" aria-label="Taskbar">
        <button
          className="start-btn"
          onClick={toggleStart}
          aria-expanded={startOpen}
          aria-controls="start-menu"
        >
          Start
        </button>

        <div className="flex-1 flex items-center gap-1 px-2 overflow-x-auto">
          {os.windows.map((w) => {
            const key = (w.id ?? w.title)?.toLowerCase();
            const meta = key ? appMeta[key] : undefined;

            // En retro: icono monocromo (sin gradiente ni fondo llamativo)
            let content: React.ReactNode;
            if (w.icon) {
              content = <span className="grid place-items-center w-5 h-5">{w.icon}</span>;
            } else if (meta) {
              const { Icon } = meta;
              content = <Icon className="w-4 h-4 text-black" />; // monochrome
            } else {
              content = <span className="text-xs">{w.title?.charAt(0).toUpperCase()}</span>;
            }

            return (
              <button
                key={w.id}
                className={`taskbtn ${w.isFocused && w.state !== "minimized" ? "is-active" : ""}`}
                onClick={() => onAppClick(w.id)}
                aria-pressed={w.isFocused && w.state !== "minimized"}
                title={w.title}
              >
                {/* Ícono + título para conservar el look retro */}
                <span className="mr-1 inline-flex items-center">{content}</span>
                {w.title}
              </button>
            );
          })}
        </div>

        <div className="text-xs px-2" aria-label="clock">
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} items={menuOptions} />
    </>
  );
}
