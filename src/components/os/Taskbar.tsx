/* eslint-disable no-console */
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3 } from "lucide-react";

import { useOS } from "@/context/OSProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { StartMenu } from "./StartMenu";
import { menuOptions } from "./utils";
import { cn } from "@/lib/utils";
import { Clock } from "./Clock";

/** Alturas para reservar espacio inferior/superior */
const TASKBAR_HEIGHT_RETRO = 40; // ~h-10
const TASKBAR_HEIGHT_MODERN = 0; // dock flotante, no reserva

// ===== Dock compacto =====
const ICON_BASE = 44;      // tamaño base del botón
const SLOT_PAD = 8;        // aire vertical del slot
const SLOT = ICON_BASE + SLOT_PAD; // alto/ancho fijo del slot
const SCALE_HOVER = 1.12;  // escala al hover
const LIFT_HOVER = -6;     // levanta un poco al hover

export function Taskbar() {
  const { isRetro } = useTheme();
  const os = useOS();

  const [startOpen, setStartOpen] = useState(false);

  // Autohide (moderno)
  const [reveal, setReveal] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Reservas de safe-areas: taskbar (abajo) + menubar (arriba, en moderno)
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--taskbar-h",
      `${isRetro ? TASKBAR_HEIGHT_RETRO : TASKBAR_HEIGHT_MODERN}px`
    );
    document.documentElement.style.setProperty("--menubar-h", `${isRetro ? 0 : 28}px`);
  }, [isRetro]);

  // atajos
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Meta") setStartOpen((s) => !s);
      if (e.key === "Escape") setStartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleStart = () => setStartOpen((s) => !s);

  // meta de apps (para icon/gradient)
  const appMeta = useMemo(() => {
    const entries = menuOptions.map((o) => {
      const key = (o.id ?? o.title)?.toLowerCase();
      return [
        key,
        { Icon: o.icon, gradient: o.gradient ?? "from-blue-500 to-indigo-700", title: o.title },
      ] as const;
    });
    return Object.fromEntries(entries) as Record<
      string,
      { Icon: React.ComponentType<{ className?: string }>; gradient: string; title: string }
    >;
  }, []);

  const anyMaximized = useMemo(() => os.windows.some((w) => w.state === "maximized"), [os.windows]);

  // click apps
  const onAppClick = (id: string) => {
    const w = os.getWindow?.(id) ?? os.windows.find((x) => x.id === id);
    if (!w) return;
    if (!isRetro && w.isFocused && w.state !== "minimized") {
      os.minimize(id);
    } else {
      os.toggle({ id: w.id, title: w.title, content: w.content, bounds: w.bounds, icon: w.icon });
    }
  };

  // ======================= MODERNO (Dock tipo mac – compacto & centrado) =======================
  if (!isRetro) {
    const hidden = anyMaximized && !reveal && !startOpen;

    const onDockLeave = () => {
      setReveal(false);
      setHoveredId(null);
    };

    return (
      <>
        {/* strip para revelar el dock cuando está oculto */}
        {anyMaximized && (
          <div
            className="fixed inset-x-0 bottom-0 h-8 z-[9998]"
            onMouseEnter={() => setReveal(true)}
            onMouseLeave={() => setReveal(false)}
            aria-hidden
          />
        )}

        {/* Dock flotante (padding compacto) */}
        <motion.div
          role="menubar"
          aria-label="Dock"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-2.5 py-1.5 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl"
          initial={false}
          animate={{ y: hidden ? 76 : 0, opacity: hidden ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          style={{ pointerEvents: hidden ? "none" : "auto" }}
          onMouseEnter={() => setReveal(true)}
          onMouseLeave={onDockLeave}
        >
          <div className="flex items-end gap-1.5">
            {/* Launcher */}
            <DockItem
              id="::launcher"
              label="Launcher"
              gradient="from-blue-500/35 to-indigo-500/35"
              icon={<Grid3X3 className="w-5 h-5" />}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onClick={toggleStart}
              running={false}
            />

            {/* Ítems por ventanas (apps abiertas) */}
            {os.windows.map((w) => {
              const key = (w.id ?? w.title)?.toLowerCase();
              const meta = key ? appMeta[key] : undefined;

              const content = w.icon ? (
                <span className="grid place-items-center w-5 h-5">{w.icon}</span>
              ) : meta ? (
                <meta.Icon className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white/90 text-sm font-semibold">
                  {w.title?.charAt(0).toUpperCase()}
                </span>
              );

              return (
                <DockItem
                  key={w.id}
                  id={w.id}
                  label={w.title}
                  gradient={meta?.gradient ? meta.gradient : "from-slate-400 to-slate-600"}
                  icon={content}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onClick={() => onAppClick(w.id)}
                  active={false}
                  running={w.state !== "minimized"}
                />
              );
            })}
          </div>
        </motion.div>

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

  // ======================= RETRO (Win98) =======================
  return (
    <>
      <div
        role="menubar"
        aria-label="Taskbar"
        className={cn(
          "fixed bottom-0 left-0 right-0 h-10 z-[9999] flex items-center gap-2 px-2",
          "bg-[#c0c0c0] border-t-2 border-white",
          "shadow-[inset_0_2px_0_#fff,inset_0_-2px_0_#808080]"
        )}
      >
        {/* Start */}
        <button
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 font-bold text-black",
            "bg-[#c0c0c0]",
            "border-[2px] border-t-white border-l-white border-b-[#808080] border-r-[#808080]",
            "active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
          )}
          onClick={toggleStart}
          aria-expanded={startOpen}
          aria-controls="start-menu"
          title="Start"
        >
          <span
            className="w-5 h-5 grid place-items-center bg-red-600 text-white text-[11px] font-bold"
            style={{ boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080" }}
          >
            ⊞
          </span>
          Start
        </button>

        {/* Ventanas */}
        <div className="flex-1 flex items-center gap-1 px-2 overflow-x-auto">
          {os.windows.map((w) => (
            <button
              key={w.id}
              className={cn(
                "inline-flex items-center gap-2 px-2 py-1 text-sm text-black",
                "bg-[#c0c0c0]",
                "border-[2px] border-t-white border-l-white border-b-[#808080] border-r-[#808080]",
                "hover:bg-[#d7d7d7]",
                w.isFocused &&
                  w.state !== "minimized" &&
                  "bg-[#e3e3e3] border-t-[#808080] border-l-[#808080] border-b-white border-r-white"
              )}
              onClick={() => {
                const win = os.getWindow?.(w.id) ?? w;
                if (!win) return;
                os.toggle({
                  id: win.id,
                  title: win.title,
                  content: win.content,
                  bounds: win.bounds,
                  icon: win.icon,
                });
              }}
              aria-pressed={w.isFocused && w.state !== "minimized"}
              title={w.title}
            >
              <span
                className="w-4 h-4 grid place-items-center bg-gray-200 border border-gray-400 mr-1"
                style={{ boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080" }}
              >
                <span className="w-3 h-3 grid place-items-center text-black">
                  {w.icon ?? w.title?.charAt(0).toUpperCase()}
                </span>
              </span>
              <span className="truncate max-w-[200px]">{w.title}</span>
            </button>
          ))}
        </div>

        {/* Reloj retro con calendario */}
        <div className="px-2">
          <Clock isRetro showLanguageToggle={false} />
        </div>
      </div>

      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} items={menuOptions} />
    </>
  );
}

/* ============================== Dock Item (centrado real) ============================== */
function DockItem({
  id,
  label,
  icon,
  gradient,
  hoveredId,
  setHoveredId,
  onClick,
  active = false,
  running = true,
}: {
  id: string;
  label: string | undefined;
  icon: React.ReactNode;
  gradient: string;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onClick: () => void;
  active?: boolean;
  running?: boolean;
}) {
  const isHovered = hoveredId === id;

  return (
    <div
      // ⬇️ Centrado horizontal + pegado al fondo (ANTES: grid place-items-end → descentraba)
      className="relative flex flex-col items-center justify-end"
      style={{ width: SLOT, height: SLOT }}
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
      title={label}
    >
      <motion.button
        onClick={onClick}
        className={cn("relative grid place-items-center rounded-xl", "border border-white/25 bg-white/12 shadow-lg")}
        style={{ width: ICON_BASE, height: ICON_BASE }}
        animate={{ scale: isHovered ? SCALE_HOVER : 1, y: isHovered ? LIFT_HOVER : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 36, mass: 0.6 }}
        aria-pressed={active}
      >
        <span
          className={cn("grid place-items-center rounded-xl", "bg-gradient-to-br", gradient || "from-slate-400 to-slate-600")}
          style={{ width: Math.round(ICON_BASE * 0.66), height: Math.round(ICON_BASE * 0.66) }}
        >
          {icon}
        </span>

        {/* Indicador de app ejecutándose */}
        {running && (
          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/85" />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !!label && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: -9, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.6 }}
            className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2 py-0.5 rounded shadow whitespace-nowrap"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
