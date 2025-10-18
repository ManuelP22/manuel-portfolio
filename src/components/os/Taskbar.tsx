import { useTheme } from "@/providers/ThemeProvider";
import { MacDock } from "./mac/dock/MacDock";
import { Win98Bar } from "./win98/Win98Bar";

export function Taskbar() {
  const { isRetro } = useTheme();
  // Render condicional de componentes completos. No hay hooks condicionales.
  return isRetro ? <Win98Bar /> : <MacDock />;
}
