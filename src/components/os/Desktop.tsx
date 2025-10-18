import { useOS } from "@/context/OSProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { DesktopIcon } from "../DesktopIcon";
import { menuOptions } from "./utils";
import { openApp, type App } from "@/lib/app";
import React from "react";

export function Desktop() {
  const { isRetro } = useTheme();
  const os = useOS();

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
      {isRetro && (
        <div className="desktop-grid">
          {menuOptions.map(opt => (
            <DesktopIcon
              key={opt.id ?? opt.title}
              item={{
                id: opt.id,
                title: opt.title,
                description: opt.description,
                icon: opt.icon,
                iconImage: opt.iconImage, 
                gradient: opt.gradient,   
                content: opt.content,        
              } as App}
              onOpen={(app) => openApp(os, app)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
