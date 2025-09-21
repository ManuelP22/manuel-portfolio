import { useOS } from "@/context/OSProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { DesktopIcon } from "../DesktopIcon";

import { menuOptions } from "./utils";
import { openApp } from "@/lib/app";

export function Desktop() {
  const { isRetro } = useTheme();
  const os = useOS();

  const getGradientClass = (g?: string) =>
    g ? `bg-gradient-to-br ${g}` : "bg-gradient-to-br from-blue-500 to-indigo-700";

  return (
    <div className={`os-desktop ${isRetro ? "" : "modern"}`}>
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
