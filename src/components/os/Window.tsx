import { useRef } from "react";
import { Minus, Square, X } from "lucide-react";
import type { OsWindow } from "@/lib/types";
import { useTheme } from "@/providers/ThemeProvider";
import { useOS } from "@/context/OSProvider";
import { clamp, getDesktopSize, MIN_H, MIN_W, type Bounds, type Edge } from "@/lib/windows-utils";


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

  // Refs para drag/resize (sin estado local)
  const dragRef = useRef<{ startX: number; startY: number; orig: Bounds } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    orig: Bounds;
    edge: Edge;
  } | null>(null);

  const classBase = `window ${isRetro ? "" : "modern"}`;
  const barClass = `window-titlebar ${isRetro ? "" : "modern"}`;

  const style =
    win.state === "maximized"
      ? { top: 0, left: 0, width: "100%", height: "100%", zIndex: win.zIndex }
      : { top: b.y, left: b.x, width: b.w, height: b.h, zIndex: win.zIndex };

  // ========= DRAG (confinado al desktop) =========
  const onMouseDownTitle = (e: React.MouseEvent) => {
    if (win.state !== "normal") return;
    os.focus(win.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, orig: { ...b } };
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

    const clampWest = (nx: number) =>
      clamp(nx, 0, ctx.orig.x + ctx.orig.w - MIN_W);
    const clampNorth = (ny: number) =>
      clamp(ny, 0, ctx.orig.y + ctx.orig.h - MIN_H);

    // E/W afectan x/w
    if (ctx.edge.includes("e")) {
      const maxW = deskW - x;
      w = clamp(ctx.orig.w + dx, MIN_W, Math.max(MIN_W, maxW));
    }
    if (ctx.edge.includes("w")) {
      const newX = clampWest(ctx.orig.x + dx);
      w = ctx.orig.w + (ctx.orig.x - newX);
      x = newX;
    }

    // N/S afectan y/h
    if (ctx.edge.includes("s")) {
      const maxH = deskH - y;
      h = clamp(ctx.orig.h + dy, MIN_H, Math.max(MIN_H, maxH));
    }
    if (ctx.edge.includes("n")) {
      const newY = clampNorth(ctx.orig.y + dy);
      h = ctx.orig.h + (ctx.orig.y - newY);
      y = newY;
    }

    // Seguridad extra: que no se salga
    w = Math.min(w, deskW - x);
    h = Math.min(h, deskH - y);

    os.setBounds(win.id, { x, y, w, h });
  };

  const onResizeEnd = () => {
    resizeRef.current = null;
    window.removeEventListener("mousemove", onResizeMove);
  };

  // ========= Botones (UI clara y centrada) =========
  const ctrlBtn = isRetro
    ? [
      "inline-grid place-items-center",
      "w-[18px] h-[18px]",
      "cursor-pointer leading-none select-none",
      "bg-[#c0c0c0]",
      "border-2",
      "border-t-white border-l-white border-b-[#808080] border-r-[#808080]",
      "hover:bg-[#d7d7d7]",
      "active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white",
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
      style={style as React.CSSProperties}
      role="dialog"
      aria-label={win.title}
      onMouseDown={() => os.focus(win.id)}
    >
      {/* Title bar */}
      <header
        className={`${barClass} select-none`}
        onMouseDown={onMouseDownTitle}
        onDoubleClick={onDoubleTitle}
      >
        <div className="flex items-center gap-2">
          {!isRetro && (
            <div className="flex items-center gap-1 mr-1">
              <span className="title-dot red" />
              <span className="title-dot yellow" />
              <span className="title-dot green" />
            </div>
          )}
          <h3 className="window-title">{win.title}</h3>
        </div>

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

          {/* Max/Restore */}
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

          {/* Close */}
          <button
            aria-label="Close"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              os.close(win.id);
            }}
            className={isRetro ? ctrlBtn : `${ctrlBtn} hover:bg-red-500/15`}
          >
            <X className={ctrlIcon} />
          </button>
        </div>
      </header>

      {/* Contenido */}
      <div className={`window-body ${isRetro ? "" : "modern"}`}>{win.content}</div>

      {/* Handles de resize (8 lados) */}
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
            className="absolute -bottom-0 -right-0 w-3.5 h-3.5 cursor-se-resize"
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
