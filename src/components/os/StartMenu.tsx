import { useTheme } from "@/providers/ThemeProvider";
import type { App } from "@/lib/app";
import { MacLauncher } from "./mac/MacLauncher";
import { Win98StartMenu } from "./win98/Win98StartMenu";
import * as React from "react";

export type StartMenuProps = {
  open: boolean;
  onClose: () => void;
  centered?: boolean;
  width?: number;
  height?: number;
  offsetBottom?: number;
  items: App[];
};

export function StartMenu(props: StartMenuProps) {
  const theme = useTheme();
  
  // Manejo seguro de tema
  const isRetro = React.useMemo(() => {
    if (!theme) return false;
    
    // Opción 1: Verificar propiedad isRetro
    if ("isRetro" in theme) {
      return Boolean((theme as { isRetro?: boolean }).isRetro);
    }
    
    // Opción 2: Verificar tema string
    if ("theme" in theme) {
      return (theme as { theme?: string }).theme === "retro";
    }
    
    return false;
  }, [theme]);

  // Renderizado condicional seguro
  if (!props.items || props.items.length === 0) {
    return null;
  }

  if (isRetro) {
    return <Win98StartMenu {...props} />;
  }
  
  return <MacLauncher {...props} />;
}