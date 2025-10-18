// components/os/windows/win98/Win98Window.tsx
/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as React from "react";
import { useRef } from "react";
import { Minus, Square, X } from "lucide-react";
import { useOS } from "@/context/OSProvider";
import type { OsWindow } from "@/lib/types";
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

const EDGE_GUTTER = 14;
const CORNER_GUTTER = 24;
const DRAG_RESTORE_THRESHOLD = 5;

function readPxVar(name: string, fallback = 0): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const n = parseInt(raw || "", 10);
  return Number.isFinite(n) ? n : fallback;
}

export function Win98Window({
  win,
  initialBounds,
}: {
  win: OsWindow;
  initialBounds: Bounds;
}) {
  const os = useOS();

  const b: Bounds = (win.bounds as Bounds) ?? initialBounds;

  const dragRef = useRef<{
    startX: number;
    startY: number;
    orig: Bounds;
    bottomReserved: number;
    wasMaxOnDown: boolean;
    restored: boolean;
  } | null>(null);

  const resizeRef = useRef<{
    startX: number;
    startY: number;
    orig: Bounds;
    edge: Edge;
    bottomReserved: number;
  } | null>(null);

  const isFullscreen = win.state === "maximized";
  const RADIUS = 0;

  const outerStyle: React.CSSProperties =
    isFullscreen
      ? {
          top: 0,
          left: 0,
          width: "100%",
          height: "calc(100% - var(--taskbar-h, 34px))",
          zIndex: win.zIndex,
          overflow: "visible",
        }
      : { top: b.y, left: b.x, width: b.w, height: b.h, zIndex: win.zIndex, overflow: "visible" };

  const classBase = cn("window retro", isFullscreen && "!rounded-none !shadow-none");
  const barClass = cn("window-titlebar");

  /* ================= DRAG ================= */
  const onMouseDownTitle = (e: React.MouseEvent) => {
    if (win.state === "minimized") return;
    os.focus(win.id);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      orig: { ...b },
      bottomReserved: readPxVar("--taskbar-h", 34),
      wasMaxOnDown: win.state === "maximized",
      restored: false,
    };

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

    if (ctx.wasMaxOnDown && !ctx.restored) {
      if (Math.abs(dx) > DRAG_RESTORE_THRESHOLD || Math.abs(dy) > DRAG_RESTORE_THRESHOLD) {
        const restoreW = clamp(ctx.orig.w, MIN_W, deskW);
        const restoreH = clamp(ctx.orig.h, MIN_H, Math.max(MIN_H, deskH - ctx.bottomReserved));

        const nx = clamp(e.clientX - restoreW / 2, 0, deskW - restoreW);
        let ny = Math.max(0, e.clientY - 12);
        ny = clamp(ny, 0, deskH - ctx.bottomReserved - restoreH);

        os.restore(win.id);
        os.setBounds(win.id, { x: nx, y: ny, w: restoreW, h: restoreH });

        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          orig: { x: nx, y: ny, w: restoreW, h: restoreH },
          bottomReserved: ctx.bottomReserved,
          wasMaxOnDown: true,
          restored: true,
        };
        return;
      }
      return;
    }

    const leftBound = 0;
    const topBound = 0;

    const maxX = Math.max(leftBound, deskW - ctx.orig.w);
    const maxY = Math.max(topBound, deskH - ctx.bottomReserved - ctx.orig.h);

    const nextX = clamp(ctx.orig.x + dx, leftBound, maxX);
    const nextY = clamp(ctx.orig.y + dy, topBound, maxY);

    os.setBounds(win.id, { x: nextX, y: nextY, w: ctx.orig.w, h: ctx.orig.h });
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

  /* ================= RESIZE ================= */
  const startResize = (edge: Edge) => (e: React.MouseEvent) => {
    if (win.state !== "normal") return;
    e.stopPropagation();
    os.focus(win.id);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      orig: { ...b },
      edge,
      bottomReserved: readPxVar("--taskbar-h", 34),
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
    const clampNorth = (ny: number) =>
      clamp(ny, 0, ctx.orig.y + ctx.orig.h - MIN_H);

    if (ctx.edge.includes("e")) {
      const maxW = deskW - x;
      w = clamp(ctx.orig.w + dx, MIN_W, Math.max(MIN_W, maxW));
    }
    if (ctx.edge.includes("w")) {
      const newX = clampWest(ctx.orig.x + dx);
      w = ctx.orig.w + (ctx.orig.x - newX);
      x = newX;
    }

    if (ctx.edge.includes("s")) {
      const maxH = deskH - ctx.bottomReserved - y;
      h = clamp(ctx.orig.h + dy, MIN_H, Math.max(MIN_H, maxH));
    }
    if (ctx.edge.includes("n")) {
      const newY = clampNorth(ctx.orig.y + dy);
      h = ctx.orig.h + (ctx.orig.y - newY);
      y = newY;
    }

    w = Math.min(w, deskW - x);
    h = Math.min(h, deskH - ctx.bottomReserved - y);

    os.setBounds(win.id, { x, y, w, h });
  };

  const onResizeEnd = () => {
    resizeRef.current = null;
    preventTextSelection(false);
    window.removeEventListener("mousemove", onResizeMove);
  };

  /* ================= RENDER ================= */
  const ctrlBtn = [
    "inline-grid place-items-center",
    "w-[18px] h-[18px]",
    "cursor-pointer leading-none select-none",
    "bg-[#c0c0c0]",
    "border-2",
    "border-t-white border-l-white border-b-[#808090] border-r-[#808090]",
    "hover:bg-[#d7d7d7]",
    "active:border-t-[#808090] active:border-l-[#808090] active:border-b-white active:border-r-white",
  ].join(" ");

  const ctrlIcon = "w-3 h-3 text-black";

  return (
    <section
      className={classBase}
      style={outerStyle}
      role="dialog"
      aria-label={win.title}
      onMouseDown={() => os.focus(win.id)}
    >
      <div
        className={cn(
          "window-frame",
          isFullscreen ? "" : "shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        )}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: isFullscreen ? 0 : RADIUS,
          overflow: "hidden",
          background: "#dedede",
          zIndex: 2,

          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <header
          className={cn(barClass, "select-none")}
          onMouseDown={onMouseDownTitle}
          onDoubleClick={onDoubleTitle}
          style={{ flex: "0 0 auto" }}
        >
          <div className="flex items-center gap-2">
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

            <button
              aria-label={win.state === "maximized" ? "Restore" : "Maximize"}
              title={win.state === "maximized" ? "Restore" : "Maximize"}
              onClick={(e) => {
                e.stopPropagation();
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
        </header>

        <div
          className={cn("window-body")}
          style={{
            position: "relative",
            flex: "1 1 auto",
            minHeight: 0,
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {win.content}
        </div>
      </div>

      {win.state === "normal" && (
        <>
          <div
            onMouseDown={startResize("n")}
            aria-hidden
            className="absolute cursor-n-resize"
            style={{ touchAction: "none", top: -EDGE_GUTTER, left: 0, right: 0, height: EDGE_GUTTER, opacity: 0, zIndex: 1 }}
          />
          <div
            onMouseDown={startResize("s")}
            aria-hidden
            className="absolute cursor-s-resize"
            style={{ touchAction: "none", bottom: -EDGE_GUTTER, left: 0, right: 0, height: EDGE_GUTTER, opacity: 0, zIndex: 1 }}
          />
          <div
            onMouseDown={startResize("e")}
            aria-hidden
            className="absolute cursor-e-resize"
            style={{ touchAction: "none", top: 0, bottom: 0, right: -EDGE_GUTTER, width: EDGE_GUTTER, opacity: 0, zIndex: 1 }}
          />
          <div
            onMouseDown={startResize("w")}
            aria-hidden
            className="absolute cursor-w-resize"
            style={{ touchAction: "none", top: 0, bottom: 0, left: -EDGE_GUTTER, width: EDGE_GUTTER, opacity: 0, zIndex: 1 }}
          />

          <div
            onMouseDown={startResize("ne")}
            aria-hidden
            className="absolute cursor-ne-resize"
            style={{ touchAction: "none", top: -CORNER_GUTTER, right: -CORNER_GUTTER, width: CORNER_GUTTER, height: CORNER_GUTTER, opacity: 0, zIndex: 1 }}
          />
          <div
            onMouseDown={startResize("nw")}
            aria-hidden
            className="absolute cursor-nw-resize"
            style={{ touchAction: "none", top: -CORNER_GUTTER, left: -CORNER_GUTTER, width: CORNER_GUTTER, height: CORNER_GUTTER, opacity: 0, zIndex: 1 }}
          />
          <div
            onMouseDown={startResize("se")}
            aria-hidden
            className="absolute cursor-se-resize"
            style={{ touchAction: "none", bottom: -CORNER_GUTTER, right: -CORNER_GUTTER, width: CORNER_GUTTER, height: CORNER_GUTTER, opacity: 0, zIndex: 1 }}
          />
          <div
            onMouseDown={startResize("sw")}
            aria-hidden
            className="absolute cursor-sw-resize"
            style={{ touchAction: "none", bottom: -CORNER_GUTTER, left: -CORNER_GUTTER, width: CORNER_GUTTER, height: CORNER_GUTTER, opacity: 0, zIndex: 1 }}
          />
        </>
      )}
    </section>
  );
}
