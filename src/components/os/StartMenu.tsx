import { useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { useOS } from "@/context/OSProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { ThemeWarp, type ThemeWarpHandle } from "./ThemeWarp";
import type { App } from "@/lib/app";
import { openApp } from "@/lib/app";
import { trapTabKey } from "@/lib/a11y";

const Z_STARTMENU = 2147483600; // enorme pero seguro; deja margen para overlays del warp

type Props = {
  open: boolean;
  onClose: () => void;
  centered?: boolean;
  width?: number;
  height?: number;
  offsetBottom?: number;
  items: App[];
};

function LauncherTileModern({
  item,
  onAction,
  refProp,
}: {
  item: App;
  onAction: (i: App) => void;
  refProp?: React.Ref<HTMLButtonElement>;
}) {
  const Icon = item.icon;
  return (
    <button
      ref={refProp}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      onClick={() => onAction(item)}
      aria-label={item.description ? `${item.title}: ${item.description}` : item.title}
    >
      <span className={`grid place-items-center w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient ?? "from-blue-500 to-indigo-700"}`} aria-hidden>
        <Icon className="w-5 h-5 text-white" />
      </span>
      <div className="text-left">
        <div className="font-medium">{item.title}</div>
        {item.description && <div className="text-xs text-white/70">{item.description}</div>}
      </div>
    </button>
  );
}

function LauncherRowRetro({
  item,
  onAction,
  refProp,
}: {
  item: App;
  onAction: (i: App) => void;
  refProp?: React.Ref<HTMLButtonElement>;
}) {
  const Icon = item.icon;
  return (
    <button
      ref={refProp}
      className="w-full flex items-center justify-center gap-2 px-2 py-1 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-blue-700"
      onClick={() => onAction(item)}
      aria-label={item.title}
    >
      <Icon className="w-4 h-4" />
      <span>{item.title}</span>
    </button>
  );
}

export function StartMenu({
  open,
  onClose,
  centered = false,
  width = 760,
  height = 560,
  offsetBottom = 108,
  items,
}: Props) {
  const os = useOS();
  const theme = useTheme();
  const warpRef = useRef<ThemeWarpHandle>(null);

  const isRetro =
    "isRetro" in theme ? (theme as { isRetro?: boolean }).isRetro : (theme as { theme?: string }).theme === "retro";
  const toggleTheme = (theme as { toggle?: () => void }).toggle ?? (() => { });

  const firstItemRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstItemRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleItemAction = (item: App) => {
    openApp(os, item);
    onClose();
  };

  // ==== Moderno (centrado) ====
  if (!isRetro && centered) {
    return (
      <>
        {/* Warp por ENCIMA del StartMenu (zIndex + 1) */}
        <ThemeWarp ref={warpRef} zIndex={Z_STARTMENU + 1} />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="launcher-title"
          className="fixed inset-0 flex items-end justify-center"
          style={{ zIndex: Z_STARTMENU, paddingBottom: offsetBottom }}
          onClick={onClose}
          onKeyDown={(e) => trapTabKey(e, containerRef.current)}
        >
          <div
            id="start-menu"
            ref={containerRef}
            className="start-menu modern w-[min(92vw,1000px)] overflow-hidden"
            style={{ width, height }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-white/90">
              <span id="launcher-title" className="font-semibold">Launcher</span>
              <button
                onClick={() => {
                  warpRef.current?.start(isRetro ? "toModern" : "toRetro", {
                    holdMs: 1000,
                    onComplete: () => {
                      toggleTheme();
                      onClose();
                    },
                  });
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Switch theme"
              >
                {isRetro ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-sm">{isRetro ? "Return to the present" : "Journey to the past"}</span>
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-white/90">
              {items.map((it, idx) => (
                <LauncherTileModern
                  key={it.title}
                  item={it}
                  onAction={handleItemAction}
                  refProp={idx === 0 ? firstItemRef : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==== Retro (anclado) ====
  return (
    <>
      <ThemeWarp ref={warpRef} zIndex={Z_STARTMENU + 1} />
      <div
        id="start-menu"
        className="start-menu"
        role="menu"
        aria-label="Start"
        style={{ left: 8, bottom: 46, zIndex: Z_STARTMENU }}
      >
        <div className="p-2">
          {items.map((it, idx) => (
            <LauncherRowRetro
              key={it.title}
              item={it}
              onAction={handleItemAction}
              refProp={idx === 0 ? firstItemRef : undefined}
            />
          ))}

          <div className="mt-2 border-t border-black/20 pt-2">
            <button
              className="w-full flex items-center gap-2 px-2 py-1 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-blue-700"
              onClick={() => {
                warpRef.current?.start(isRetro ? "toModern" : "toRetro", {
                  holdMs: 1000,
                  onComplete: () => {
                    toggleTheme();
                    onClose();
                  },
                });
              }}
            >
              {isRetro ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>Switch to {isRetro ? "Modern" : "Retro"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
