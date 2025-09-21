export type Bounds = { x: number; y: number; w: number; h: number };

// 8 direcciones compatibles con CSS cursors
export type Edge =
  | "n" | "s" | "e" | "w"
  | "ne" | "nw" | "se" | "sw";

export const MIN_W = 360;
export const MIN_H = 240;

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Devuelve el tamaño del contenedor "escritorio" (fallback al viewport).
 * Si quieres otro contenedor, pasa un selector diferente.
 */
export function getDesktopSize(selector = ".os-windows") {
  const el = document.querySelector(selector) as HTMLElement | null;
  const width = el?.clientWidth ?? window.innerWidth;
  const height = el?.clientHeight ?? window.innerHeight;
  return { width, height };
}

/**
 * Calcula nuevos bounds para drag (confinado al desktop)
 */
export function nextBoundsFromDrag(
  orig: Bounds,
  dx: number,
  dy: number,
  deskW: number,
  deskH: number
): Bounds {
  const maxX = Math.max(0, deskW - orig.w);
  const maxY = Math.max(0, deskH - orig.h);

  return {
    x: clamp(orig.x + dx, 0, maxX),
    y: clamp(orig.y + dy, 0, maxY),
    w: orig.w,
    h: orig.h,
  };
}

/**
 * Calcula nuevos bounds para resize (8 direcciones), confinado al desktop
 */
export function nextBoundsFromResize(
  orig: Bounds,
  edge: Edge,
  dx: number,
  dy: number,
  deskW: number,
  deskH: number
): Bounds {
  let { x, y, w, h } = orig;

  const clampWest = (nx: number) => clamp(nx, 0, orig.x + orig.w - MIN_W);
  const clampNorth = (ny: number) => clamp(ny, 0, orig.y + orig.h - MIN_H);

  // E / W (x & w)
  if (edge.includes("e")) {
    const maxW = deskW - x;
    w = clamp(orig.w + dx, MIN_W, Math.max(MIN_W, maxW));
  }
  if (edge.includes("w")) {
    const newX = clampWest(orig.x + dx);
    w = orig.w + (orig.x - newX);
    x = newX;
  }

  // N / S (y & h)
  if (edge.includes("s")) {
    const maxH = deskH - y;
    h = clamp(orig.h + dy, MIN_H, Math.max(MIN_H, maxH));
  }
  if (edge.includes("n")) {
    const newY = clampNorth(orig.y + dy);
    h = orig.h + (orig.y - newY);
    y = newY;
  }

  // Seguridad extra: que no se salga del desktop
  w = Math.min(w, deskW - x);
  h = Math.min(h, deskH - y);

  return { x, y, w, h };
}
