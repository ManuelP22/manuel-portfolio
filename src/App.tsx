import { Desktop } from "./components/os/Desktop";
import { Taskbar } from "./components/os/Taskbar";
import { WindowsLayer } from "./components/os/WindowsLayer";
import { OSProvider } from "./context/OSProvider";
import { ThemeProvider, useTheme } from "./providers/ThemeProvider";
import { MacMenuBar } from "./components/os/MacMenuBar";

/** Contenido de la app con acceso al tema */
function Shell() {
  const theme = useTheme();
  const { isRetro } = theme;

  const handleToggleVersion = () => {
    if (typeof theme.setTheme === "function") theme.setTheme("retro");
    // @ts-expect-error – fallback
    else if (typeof theme.toggleTheme === "function") theme.toggleTheme();
  };

  return (
    <div className="os-root">
      {/* Barra superior solo en moderno */}
      {!isRetro && (
        <MacMenuBar
          appName="Portafolio"
          onToggleVersion={handleToggleVersion}
          // onSearch={(q) => ...} // opcional
          // batteryPct={76} wifiBars={3} locale="es-ES" // opcionales
        />
      )}

      <Desktop />
      <WindowsLayer />
      <Taskbar />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <OSProvider>
        <Shell />
      </OSProvider>
    </ThemeProvider>
  );
}
