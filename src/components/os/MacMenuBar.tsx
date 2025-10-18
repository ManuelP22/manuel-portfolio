import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type Transition, type TargetAndTransition } from "framer-motion";
import { Apple, Wifi, Battery, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Clock } from "./Clock";
import { useTheme } from "@/providers/ThemeProvider";

/* ================== Tipos ================== */
type MenuItem = {
  id: string;
  label: string;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  divider?: boolean;
};

type AppMenu = {
  id: string;
  label: string;
  items: MenuItem[];
};

export interface MacMenuBarProps {
  appName?: string;
  menus?: AppMenu[];
  onToggleVersion?: () => void;
  onSearch?: (query: string) => void;
  batteryPct?: number;
  wifiBars?: 0 | 1 | 2 | 3;
}

/* ================== Animación popovers ================== */
const popInitial: TargetAndTransition = { opacity: 0, y: -6, scale: 0.98 };
const popAnimate: TargetAndTransition = { opacity: 1, y: 0, scale: 1 };
const popExit: TargetAndTransition = { opacity: 0, y: -6, scale: 0.98 };
const popTransition: Transition = { type: "spring", stiffness: 400, damping: 30, mass: 0.6 };

/* ================== Utils ================== */
function useOnClickOutside(ref: React.RefObject<HTMLElement>, cb: () => void) {
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb, ref]);
}

/* ================== Search ================== */
function SearchPopover({ onClose, onSearch }: { onClose: () => void; onSearch?: (q: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, onClose);
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(q);
    onClose();
  };

  return (
    <motion.div
      ref={ref}
      initial={popInitial}
      animate={popAnimate}
      exit={popExit}
      transition={popTransition}
      className="absolute top-full right-0 mt-2 w-72 max-w-[92vw] rounded-xl border border-white/15
                 bg-[rgb(15_23_42/0.9)] text-white backdrop-blur-xl shadow-2xl p-2"
      role="dialog"
      aria-label="Search"
    >
      <form onSubmit={submit} className="flex items-center gap-2">
        <Search className="w-4 h-4 text-white/70" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/50"
        />
        <button type="submit" className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15">
          Enter
        </button>
      </form>
    </motion.div>
  );
}

/* ================== Apple Menu ================== */
function AppleMenu({
  onClose,
  onToggleVersion,
  extraMenus,
}: {
  onClose: () => void;
  onToggleVersion?: () => void;
  extraMenus?: AppMenu[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, onClose);

  const appleItems: MenuItem[] = [
    { id: "about", label: "Acerca de este Portafolio" },
    { id: "pref", label: "Preferencias…" },
    { id: "sep-1", label: "-", divider: true },
    { id: "switch", label: "Journy to the past", onSelect: onToggleVersion },
    { id: "sep-2", label: "-", divider: true },
    { id: "sleep", label: "Reposo", disabled: true },
    { id: "restart", label: "Reiniciar…", disabled: true },
    { id: "shutdown", label: "Apagar…", disabled: true },
  ];

  const baseMenu: AppMenu = { id: "apple", label: "Apple", items: appleItems };
  const menus = [baseMenu, ...(extraMenus ?? [])];

  return (
    <motion.div
      ref={ref}
      initial={popInitial}
      animate={popAnimate}
      exit={popExit}
      transition={popTransition}
      className="absolute top-full left-0 mt-1 min-w-[220px] rounded-md border border-white/15
                 bg-[rgb(15_23_42/0.9)] text-white backdrop-blur-xl shadow-2xl py-1"
      role="menu"
    >
      {menus.map((m) => (
        <div key={m.id} className="py-1">
          {m.items.map((it) =>
            it.divider ? (
              <div key={it.id} className="my-1 h-px bg-white/10 mx-2" aria-hidden />
            ) : (
              <button
                key={it.id}
                disabled={it.disabled}
                onClick={() => {
                  it.onSelect?.();
                  onClose();
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-sm flex items-center justify-between",
                  "hover:bg-white/10 disabled:text-white/40 disabled:hover:bg-transparent"
                )}
                role="menuitem"
              >
                <span>{it.label}</span>
                {it.shortcut && <kbd className="text-[10px] text-white/60">{it.shortcut}</kbd>}
              </button>
            )
          )}
        </div>
      ))}
    </motion.div>
  );
}

/* ================== Menu Bar ================== */
export function MacMenuBar({
  appName = "Portafolio",
  menus,
  onToggleVersion,
  onSearch,
  batteryPct = 76,
  wifiBars = 3,
}: MacMenuBarProps) {
  const { isRetro } = useTheme();
  const [openApple, setOpenApple] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  // 👉 medir barra y exponer --menubar-h
  const barRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const setVar = () => {
      const h = Math.round(barRef.current?.getBoundingClientRect().height ?? 28);
      document.documentElement.style.setProperty("--menubar-h", `${h}px`);
    };
    setVar();
    window.addEventListener("resize", setVar);
    return () => {
      window.removeEventListener("resize", setVar);
      // opcional: deja 0 en moderno cuando no exista barra
      document.documentElement.style.setProperty("--menubar-h", "0px");
    };
  }, []);

  const defaultMenus: AppMenu[] = useMemo(
    () => [
      {
        id: "app",
        label: appName,
        items: [
          { id: "about", label: `Acerca de ${appName}…` },
          { id: "prefs", label: "Preferencias…" },
        ],
      },
      {
        id: "file",
        label: "Archivo",
        items: [
          { id: "new", label: "Nuevo", shortcut: "⌘N", disabled: true },
          { id: "open", label: "Abrir…", shortcut: "⌘O", disabled: true },
        ],
      },
      {
        id: "edit",
        label: "Edición",
        items: [
          { id: "undo", label: "Deshacer", shortcut: "⌘Z", disabled: true },
          { id: "redo", label: "Rehacer", shortcut: "⇧⌘Z", disabled: true },
        ],
      },
      {
        id: "view",
        label: "Vista",
        items: [
          { id: "zoom", label: "Zoom", disabled: true },
          { id: "fullscreen", label: "Pantalla completa", disabled: true },
        ],
      },
    ],
    [appName]
  );

  const mergedMenus = menus ?? defaultMenus;
  const wifiLabel = ["Sin señal", "Baja", "Media", "Alta"][wifiBars] ?? "—";
  const battLabel = `${batteryPct}%`;

  return (
    <div
      ref={barRef}
      className={cn(
        "fixed top-0 left-0 right-0 h-7",
        "bg-black/20 backdrop-blur-xl border-b border-white/10",
        "flex items-center justify-between px-3 text-white text-[13px] z-[10000]"
      )}
      role="menubar"
      aria-label="macOS Menu Bar"
    >
      {/* Left: Apple + Menús */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
            onClick={() => {
              setOpenApple((s) => !s);
              setOpenSearch(false);
            }}
            aria-haspopup="menu"
            aria-expanded={openApple}
          >
            <Apple className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {openApple && (
              <AppleMenu onClose={() => setOpenApple(false)} onToggleVersion={onToggleVersion} extraMenus={mergedMenus} />
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1">
          {mergedMenus.map((m) => (
            <button key={m.id} className="hover:bg-white/10 px-2 py-1 rounded transition-colors font-medium" title={m.label}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: status + reloj */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <button
            className="hover:bg-white/10 p-1 rounded transition-colors"
            onClick={() => {
              setOpenSearch((s) => !s);
              setOpenApple(false);
            }}
            aria-haspopup="dialog"
            aria-expanded={openSearch}
            title="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {openSearch && <SearchPopover onClose={() => setOpenSearch(false)} onSearch={onSearch} />}
          </AnimatePresence>
        </div>

        {/* WiFi */}
        <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded hover:bg-white/10" title={`Wi-Fi: ${wifiLabel}`}>
          <Wifi className="w-4 h-4" />
          <span className="text-white/70 text-[11px]">{wifiBars}</span>
        </span>

        {/* Battery */}
        <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded hover:bg-white/10" title={`Batería: ${battLabel}`}>
          <Battery className="w-4 h-4" />
          <span className="text-white/70 text-[11px]">{batteryPct}%</span>
        </span>

        {/* Clock (usa el mismo componente; cambia estilo según tema) */}
        <Clock isRetro={isRetro} showLanguageToggle />
      </div>
    </div>
  );
}
