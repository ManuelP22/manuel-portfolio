// components/os/common/AppGlyph.tsx
import * as React from "react";
import type { App } from "@/lib/app";
import { cn } from "@/lib/utils";

type AppGlyphProps = {
  app: Pick<App, "title" | "icon" | "iconImage" | "gradient" | "dockFillIcon" | "dockImageFit">;
  size?: number | string;          // ancho/alto del glyph (px o rem)
  rounded?: string;                // rounded-* tailwind
  className?: string;
  // Cuando no hay imagen: envoltorio con gradiente
  withGradientFallback?: boolean;  // default true
};

/** Renderiza el "glyph" de una App: imagen, icono componente o fallback de letra. */
export function AppGlyph({
  app,
  size = 36,
  rounded = "rounded-lg",
  className,
  withGradientFallback = true,
}: AppGlyphProps) {
  const { title, icon: Icon, iconImage, gradient, dockFillIcon, dockImageFit } = app;

  // Si hay imagen:
  if (iconImage) {
    return (
      <span
        className={cn("inline-grid place-items-center overflow-hidden", rounded, className)}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <img
          src={iconImage}
          alt={title}
          draggable={false}
          className="block w-full h-full select-none"
          style={{
            objectFit: dockImageFit ?? (dockFillIcon ? "cover" : "contain"),
          }}
        />
      </span>
    );
  }

  // Si hay componente:
  if (Icon) {
    return (
      <span
        className={cn(
          "inline-grid place-items-center",
          withGradientFallback && "bg-gradient-to-br",
          withGradientFallback && (gradient ?? "from-blue-500 to-indigo-700"),
          rounded,
          className
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <Icon className="w-[60%] h-[60%] text-white" />
      </span>
    );
  }

  // Fallback: primera letra
  return (
    <span
      className={cn(
        "inline-grid place-items-center text-white font-semibold",
        withGradientFallback && "bg-gradient-to-br",
        withGradientFallback && (gradient ?? "from-slate-400 to-slate-600"),
        rounded,
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {title?.charAt(0).toUpperCase()}
    </span>
  );
}
