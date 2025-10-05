import { useOS } from "@/context/OSProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { DesktopIcon } from "../DesktopIcon";
import { menuOptions } from "./utils";
import { openApp } from "@/lib/app";
import React from "react";

export function Desktop() {
  const { isRetro } = useTheme();
  const os = useOS();

  const getGradientClass = (g?: string) =>
    g ? `bg-gradient-to-br ${g}` : "bg-gradient-to-br from-blue-500 to-indigo-700";

  // En moderno: deja espacio arriba para el menubar.
  // En ambos: respeta taskbar abajo si existe.
  const rootStyle: React.CSSProperties = isRetro
    ? {
        paddingBottom: "var(--taskbar-h, 34px)",
        minHeight: "calc(100vh - var(--taskbar-h, 34px))",
      }
    : {
        paddingTop: "var(--menubar-h, 28px)",
        paddingBottom: "var(--taskbar-h, 0px)",
        minHeight:
          "calc(100vh - var(--menubar-h, 28px) - var(--taskbar-h, 0px))",
      };

  return (
    <div className={`os-desktop ${isRetro ? "" : "modern"}`} style={rootStyle}>
      <div className="desktop-grid">
        {menuOptions.map((app, idx) => (
          <DesktopIcon
            key={app.id ?? `${app.title}-${idx}`}
            icon={app.icon}
            label={app.title}
            // En moderno: mismo degradado que StartMenu
            gradientClass={!isRetro ? getGradientClass(app.gradient) : undefined}
            // En retro: el propio DesktopIcon aplica el skin clásico sin colores
            onOpen={() => openApp(os, app)}
          />
        ))}
      </div>
    </div>
  );
}
