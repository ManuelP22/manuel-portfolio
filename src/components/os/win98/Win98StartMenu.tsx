import * as React from "react";
import { useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { useOS } from "@/context/OSProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { ThemeWarp, type ThemeWarpHandle } from "@/components/os/ThemeWarp";
import type { App } from "@/lib/app";
import { openApp } from "@/lib/app";

const Z_STARTMENU = 2147483600;

type Props = {
  open: boolean;
  onClose: () => void;
  centered?: boolean;
  width?: number;
  height?: number;
  offsetBottom?: number;
  items: App[];
};

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
      {/* Icono: imagen -> componente -> inicial */}
      {item.iconImage ? (
        <img
          src={item.iconImage}
          alt=""
          aria-hidden="true"
          className="w-4 h-4 object-contain"
          draggable={false}
        />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : (
        <span
          aria-hidden="true"
          className="w-4 h-4 grid place-items-center text-[10px] font-semibold bg-gray-200 border border-gray-400"
          style={{ boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080" }}
        >
          {item.title?.charAt(0).toUpperCase()}
        </span>
      )}

      <span>{item.title}</span>
    </button>
  );
}


export function Win98StartMenu({
  open,
  onClose,
  items,
}: Props) {
  const os = useOS();
  const theme = useTheme();
  const warpRef = useRef<ThemeWarpHandle>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  const isRetro =
    "isRetro" in theme ? (theme as { isRetro?: boolean }).isRetro : (theme as { theme?: string }).theme === "retro";
  const toggleTheme = (theme as { toggle?: () => void }).toggle ?? (() => {});

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

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.setProperty("--taskbar-h", "40px");
    document.documentElement.style.setProperty("--menubar-h", "0px");
  }, [open]);

  if (!open) return null;

  const handleItemAction = (item: App) => {
    openApp(os, item);
    onClose();
  };

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
