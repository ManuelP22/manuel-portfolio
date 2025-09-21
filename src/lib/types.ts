import type { ReactNode } from "react";

export type WindowState = "normal" | "minimized" | "maximized";

export type OsWindow = {
  id: string;                 // "about", "projects", etc.
  title: string;
  icon?: ReactNode;
  state: WindowState;
  zIndex: number;
  bounds?: { x: number; y: number; w: number; h: number }; // opcional
  content: ReactNode;
  isFocused: boolean;
};

export type WindowConfig = {
  id: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
  bounds?: { x: number; y: number; w: number; h: number };
};

export type OSApi = {
    windows: OsWindow[];
    open: (win: WindowConfig) => void;
    close: (id: string) => void;
    focus: (id: string) => void;
    minimize: (id: string) => void;
    maximize: (id: string) => void;
    restore: (id: string) => void;
    toggle: (win: WindowConfig) => void; // abre si no existe, si existe lo enfoca/restaura
    setBounds: (id: string, bounds: NonNullable<OsWindow["bounds"]>) => void;
    isOpen: (id: string) => boolean;
    getWindow: (id: string) => OsWindow | undefined;
    focusOrRestore: (id: string) => void
};
