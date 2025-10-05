import { useRef } from "react";
import { Minus, Square, X } from "lucide-react";
import type { OsWindow } from "@/lib/types";
import { useTheme } from "@/providers/ThemeProvider";
import { useOS } from "@/context/OSProvider";
import {
  clamp,
  getDesktopSize,
  MIN_H,
  MIN_W,
  preventTextSelection,
  type Bounds,
  type Edge,
} from "@/lib/windows-utils";
import { cn } from "@/lib/utils";

export function Window({
  win,
  initialBounds,
}: {
  win: OsWindow;
  initialBounds: Bounds;
}) {
  const { isRetro } = useTheme();
  const os = useOS();

  // Fuente de verdad: bounds en el provider (con fallback a initialBounds)
  const b: Bounds = (win.bounds as Bounds) ?? initialBounds;

  // Refs para drag/resize
  const dragRef = useRef<{ startX: number; startY: number; orig: Bounds } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    orig: Bounds;
    edge: Edge;
  } | null>(null);

  const isFullscreen = win.state === "maximized";

  // clases con override cuando está fullscreen en moderno
  const classBase = cn(
    "window",
    !isRetro && "modern",
    // En fullscreen (moderno) sin bordes ni sombras
    !isRetro && isFullscreen && "!rounded-none !shadow-none"
  );

  const barClass = cn(
    "window-titlebar",
    !isRetro && "modern",
    !isRetro && isFullscreen && "!rounded-none"
  );

  // Estilo para respetar menubar moderno y/o taskbar retro
  const style: React.CSSProperties =
    isFullscreen
      ? {
          top: isRetro ? 0 : "var(--menubar-h, 0px)",
          left: 0,
          width: "100%",
          height: isRetro
            ? "calc(100% - var(--taskbar-h, 34px))"
            : "calc(100% - var(--menubar-h, 0px) - var(--taskbar-h, 0px))",
          zIndex: win.zIndex,
          // backup por si alguna clase global aplica radius/sombras
          ...(isRetro ? {} : { borderRadius: 0, boxShadow: "none" }),
        }
      : { top: b.y, left: b.x, width: b.w, height: b.h, zIndex: win.zIndex };

  // ========= DRAG =========
  const onMouseDownTitle = (e: React.MouseEvent) => {
    if (win.state !== "normal") return;
    os.focus(win.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, orig: { ...b } };
    preventTextSelection(true);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd, { once: true });
  };

  const onDragMove = (e: MouseEvent) => {
    const ctx = dragRef.current;
    if (!ctx) return;

    const { width: deskW, height: deskH } = getDesktopSize();
    const dx = e.clientX - ctx.startX;
    const dy = e.clientY - ctx.startY;

    const maxX = Math.max(0, deskW - ctx.orig.w);
    const maxY = Math.max(0, deskH - ctx.orig.h);

    const next: Bounds = {
      x: clamp(ctx.orig.x + dx, 0, maxX),
      y: clamp(ctx.orig.y + dy, 0, maxY),
      w: ctx.orig.w,
      h: ctx.orig.h,
    };

    os.setBounds(win.id, next);
  };

  const onDragEnd = () => {
    dragRef.current = null;
    preventTextSelection(false);
    window.removeEventListener("mousemove", onDragMove);
  };

  const onDoubleTitle = () => {
    if (win.state === "maximized") os.restore(win.id);
    else os.maximize(win.id);
  };

  // ========= RESIZE (8 direcciones) =========
  const startResize = (edge: Edge) => (e: React.MouseEvent) => {
    if (win.state !== "normal") return;
    e.stopPropagation();
    os.focus(win.id);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      orig: { ...b },
      edge,
    };
    preventTextSelection(true);
    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", onResizeEnd, { once: true });
  };

  const onResizeMove = (e: MouseEvent) => {
    const ctx = resizeRef.current;
    if (!ctx) return;

    const { width: deskW, height: deskH } = getDesktopSize();
    const dx = e.clientX - ctx.startX;
    const dy = e.clientY - ctx.startY;

    let { x, y, w, h } = ctx.orig;

    const clampWest = (nx: number) => clamp(nx, 0, ctx.orig.x + ctx.orig.w - MIN_W);
    const clampNorth = (ny: number) => clamp(ny, 0, ctx.orig.y + ctx.orig.h - MIN_H);

    // E/W
    if (ctx.edge.includes("e")) {
      const maxW = deskW - x;
      w = clamp(ctx.orig.w + dx, MIN_W, Math.max(MIN_W, maxW));
    }
    if (ctx.edge.includes("w")) {
      const newX = clampWest(ctx.orig.x + dx);
      w = ctx.orig.w + (ctx.orig.x - newX);
      x = newX;
    }

    // N/S
    if (ctx.edge.includes("s")) {
      const maxH = deskH - y;
      h = clamp(ctx.orig.h + dy, MIN_H, Math.max(MIN_H, maxH));
    }
    if (ctx.edge.includes("n")) {
      const newY = clampNorth(ctx.orig.y + dy);
      h = ctx.orig.h + (ctx.orig.y - newY);
      y = newY;
    }

    // No salir del desktop
    w = Math.min(w, deskW - x);
    h = Math.min(h, deskH - y);

    os.setBounds(win.id, { x, y, w, h });
  };

  const onResizeEnd = () => {
    resizeRef.current = null;
    preventTextSelection(false);
    window.removeEventListener("mousemove", onResizeMove);
  };

  // ========= Botones =========
  const ctrlBtn = isRetro
    ? [
        "inline-grid place-items-center",
        "w-[18px] h-[18px]",
        "cursor-pointer leading-none select-none",
        "bg-[#c0c0c0]",
        "border-2",
        "border-t-white border-l-white border-b-[#808090] border-r-[#808090]",
        "hover:bg-[#d7d7d7]",
        "active:border-t-[#808090] active:border-l-[#808090] active:border-b-white active:border-r-white",
      ].join(" ")
    : [
        "inline-grid place-items-center",
        "w-6 h-6 rounded-md",
        "cursor-pointer leading-none select-none",
        "hover:bg-black/10 active:scale-[0.98] transition",
      ].join(" ");

  const ctrlIcon = isRetro ? "w-3 h-3 text-black" : "w-[18px] h-[18px]";

  return (
    <section
      className={classBase}
      style={style}
      role="dialog"
      aria-label={win.title}
      onMouseDown={() => os.focus(win.id)}
    >
      {/* Title bar */}
      <header
        className={cn(barClass, "select-none")}
        onMouseDown={onMouseDownTitle}
        onDoubleClick={onDoubleTitle}
      >
        <div className="flex items-center gap-2">
          {/* Botonera a la izquierda (estilo macOS) cuando NO es retro */}
          {!isRetro && (
            <div className="flex items-center gap-1 mr-1 [-webkit-app-region:no-drag]">
              {/* Close */}
              <button
                aria-label="Close"
                title="Close"
                className="title-dot red cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  os.close(win.id);
                }}
              />
              {/* Minimize */}
              <button
                aria-label="Minimize"
                title="Minimize"
                className="title-dot yellow cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  os.minimize(win.id);
                }}
              />
              {/* Max/Restore */}
              <button
                aria-label={win.state === "maximized" ? "Restore" : "Maximize"}
                title={win.state === "maximized" ? "Restore" : "Maximize"}
                className="title-dot green cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  win.state === "maximized" ? os.restore(win.id) : os.maximize(win.id);
                }}
              />
            </div>
          )}

          <h3 className="window-title">{win.title}</h3>
        </div>

        {/* Botonera derecha solo para retro */}
        {isRetro && (
          <div className="window-controls flex items-center gap-1 pr-1 [-webkit-app-region:no-drag]">
            <button
              aria-label="Minimize"
              title="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                os.minimize(win.id);
              }}
              className={ctrlBtn}
            >
              <Minus className={ctrlIcon} />
            </button>

            <button
              aria-label={win.state === "maximized" ? "Restore" : "Maximize"}
              title={win.state === "maximized" ? "Restore" : "Maximize"}
              onClick={(e) => {
                e.stopPropagation();
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                win.state === "maximized" ? os.restore(win.id) : os.maximize(win.id);
              }}
              className={ctrlBtn}
            >
              <Square className={ctrlIcon} />
            </button>

            <button
              aria-label="Close"
              title="Close"
              onClick={(e) => {
                e.stopPropagation();
                os.close(win.id);
              }}
              className={ctrlBtn}
            >
              <X className={ctrlIcon} />
            </button>
          </div>
        )}
      </header>

      {/* Contenido */}
      <div className={cn("window-body", !isRetro && "modern", !isRetro && isFullscreen && "!rounded-none")}>
        {win.content}
      </div>

      {/* Handles de resize (8 lados) — sólo en estado normal */}
      {win.state === "normal" && (
        <>
          {/* bordes */}
          <div
            onMouseDown={startResize("n")}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-n-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onMouseDown={startResize("s")}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-s-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onMouseDown={startResize("e")}
            className="absolute top-2 bottom-2 right-0 w-1.5 cursor-e-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onMouseDown={startResize("w")}
            className="absolute top-2 bottom-2 left-0 w-1.5 cursor-w-resize"
            style={{ touchAction: "none" }}
          />

          {/* esquinas */}
          <div
            onMouseDown={startResize("ne")}
            className="absolute -top-0 -right-0 w-3.5 h-3.5 cursor-ne-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onMouseDown={startResize("nw")}
            className="absolute -top-0 -left-0 w-3.5 h-3.5 cursor-nw-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onMouseDown={startResize("se")}
            className="absolute -bottom-0 -right-0 w-3.5 cursor-se-resize h-3.5"
            style={{ touchAction: "none" }}
          />
          <div
            onMouseDown={startResize("sw")}
            className="absolute -bottom-0 -left-0 w-3.5 h-3.5 cursor-sw-resize"
            style={{ touchAction: "none" }}
          />
        </>
      )}
    </section>
  );
}
