import { Desktop } from "./components/os/Desktop";
import { Taskbar } from "./components/os/Taskbar";
import { WindowsLayer } from "./components/os/WindowsLayer";
import { OSProvider } from "./context/OSProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <OSProvider>
        <div className="os-root">
          <Desktop />
          <WindowsLayer />
          <Taskbar />
        </div>
      </OSProvider>
    </ThemeProvider>
  );
}
