/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as React from "react";
import { useRef } from "react";
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
import { MacTrafficLights } from "../MacDots";

const EDGE_GUTTER = 14;
const CORNER_GUTTER = 24;
const DRAG_RESTORE_THRESHOLD = 5;

function readPxVar(name: string, fallback = 0): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const n = parseInt(raw || "", 10);
  return Number.isFinite(n) ? n : fallback;
}

export function MacWindow({
  win,
  initialBounds,
}: {
  win: OsWindow;
  initialBounds: Bounds;
}) {
  const os = useOS();

  const titlebarRef = useRef<HTMLDivElement>(null);

  const b: Bounds = (win.bounds as Bounds) ?? initialBounds;

  const dragRef = useRef<{
    startX: number;
    startY: number;
    orig: Bounds;
    menubarTop: number;
    wasMaxOnDown: boolean;
    restored: boolean;
  } | null>(null);

  const resizeRef = useRef<{
    startX: number;
    startY: number;
    orig: Bounds;
    edge: Edge;
    menubarTop: number;
  } | null>(null);

  const isFullscreen = win.state === "maximized";
  const RADIUS = 12;

  const outerStyle: React.CSSProperties =
    isFullscreen
      ? {
          top: "var(--menubar-h, 0px)",
          left: 0,
          width: "100%",
          height: "calc(100% - var(--menubar-h, 0px))",
          zIndex: win.zIndex,
          overflow: "visible",
          borderRadius: 0,
          boxShadow: "none",
        }
      : { top: b.y, left: b.x, width: b.w, height: b.h, zIndex: win.zIndex, overflow: "visible" };

  const classBase = cn("window modern", isFullscreen && "!rounded-none !shadow-none");
  const barClass = cn("window-titlebar modern");

  /* ================= DRAG ================= */
  const onMouseDownTitle = (e: React.MouseEvent) => {
    if (win.state === "minimized") return;
    os.focus(win.id);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      orig: { ...b },
      menubarTop: readPxVar("--menubar-h", 28),
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
        const restoreH = clamp(ctx.orig.h, MIN_H, Math.max(MIN_H, deskH - ctx.menubarTop));

        const nx = clamp(e.clientX - restoreW / 2, 0, deskW - restoreW);
        let ny = Math.max(ctx.menubarTop, e.clientY - 12);
        ny = clamp(ny, ctx.menubarTop, deskH - restoreH);

        os.restore(win.id);
        os.setBounds(win.id, { x: nx, y: ny, w: restoreW, h: restoreH });

        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          orig: { x: nx, y: ny, w: restoreW, h: restoreH },
          menubarTop: ctx.menubarTop,
          wasMaxOnDown: true,
          restored: true,
        };
        return;
      }
      return;
    }

    const topBound = ctx.menubarTop;
    const leftBound = 0;

    const maxX = Math.max(leftBound, deskW - ctx.orig.w);
    const maxY = Math.max(topBound, deskH - ctx.orig.h);

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
      menubarTop: readPxVar("--menubar-h", 28),
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
      clamp(ny, ctx.menubarTop, ctx.orig.y + ctx.orig.h - MIN_H);

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
      const maxH = deskH - y;
      h = clamp(ctx.orig.h + dy, MIN_H, Math.max(MIN_H, maxH));
    }
    if (ctx.edge.includes("n")) {
      const newY = clampNorth(ctx.orig.y + dy);
      h = ctx.orig.h + (ctx.orig.y - newY);
      y = newY;
    }

    w = Math.min(w, deskW - x);
    h = Math.min(h, deskH - y);

    os.setBounds(win.id, { x, y, w, h });
  };

  const onResizeEnd = () => {
    resizeRef.current = null;
    preventTextSelection(false);
    window.removeEventListener("mousemove", onResizeMove);
  };

  /* ================= RENDER ================= */
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
          !isFullscreen && "shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        )}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: isFullscreen ? 0 : RADIUS,
          overflow: "hidden",
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 2,

          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <header
          ref={titlebarRef}
          className={cn(barClass, "select-none")}
          onMouseDown={onMouseDownTitle}
          onDoubleClick={onDoubleTitle}
          style={{ flex: "0 0 auto" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center mr-1 [-webkit-app-region:no-drag]"
              style={{ position: "relative", zIndex: 3, gap: 0, paddingLeft: 6 }}
            >
              <MacTrafficLights
                className="mr-1 [-webkit-app-region:no-drag]"
                titleHoverAreaRef={titlebarRef}
                onClose={(e) => {
                  e.stopPropagation();
                  os.close(win.id);
                }}
                onMinimize={(e) => {
                  e.stopPropagation();
                  os.minimize(win.id);
                }}
                onZoom={(e) => {
                  e.stopPropagation();
                  win.state === "maximized" ? os.restore(win.id) : os.maximize(win.id);
                }}
              />
            </div>

            <h3 className="window-title">{win.title}</h3>
          </div>
        </header>

        <div
          className={cn("window-body modern", isFullscreen && "!rounded-none")}
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
