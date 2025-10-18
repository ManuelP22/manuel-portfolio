import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "modern" | "retro";
type Ctx = {
  theme: Theme;
  isModern: boolean;
  isRetro: boolean;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "retro" || saved === "modern" ? (saved as Theme) : "modern";
  });

  useEffect(() => {
    const root = document.body;

    // Limpia clases previas
    root.classList.remove("theme-modern", "theme-retro", "cursor-mac");

    // Aplica tema
    if (theme === "retro") {
      root.classList.add("theme-retro");
      // En retro NO aplicamos cursor-mac
    } else {
      root.classList.add("theme-modern");
      // Activa cursores estilo macOS (CSS ya cargado en main.tsx)
      root.classList.add("cursor-mac");
    }

    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value: Ctx = {
    theme,
    isModern: theme === "modern",
    isRetro: theme === "retro",
    setTheme,
    toggle: () => setTheme((t) => (t === "modern" ? "retro" : "modern")),
  };

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
