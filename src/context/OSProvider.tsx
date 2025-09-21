import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    type ReactNode,
} from "react";

import type {
    OSApi,
    OsWindow,
    WindowConfig,
    WindowState,
} from "../lib/types";

// Contador global para zIndex (creciente)
let zCounter = 10;
// Umbral para “rebasear” zIndex y evitar overflow en dev/HMR
const Z_REBASE_THRESHOLD = 1_000_000;

const OSContext = createContext<OSApi | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
    const [windows, setWindows] = useState<OsWindow[]>([]);
    /**
     * Guarda los bounds "normales" previos cuando una ventana entra en maximizado.
     * Así, al restaurar, puede volver a su tamaño/posición anteriores.
     */
    const prevNormalBounds = useRef<Map<string, OsWindow["bounds"]>>(new Map());

    /** Rebasea zIndex si el contador se disparó, preservando el orden relativo */
    const recycleZIfNeeded = useCallback(() => {
        if (zCounter <= Z_REBASE_THRESHOLD) return;

        setWindows((ws) => {
            const sorted = [...ws].sort((a, b) => a.zIndex - b.zIndex);
            const base = 10;
            const rebased = sorted.map((w, i) => ({ ...w, zIndex: base + i }));
            zCounter = base + rebased.length;
            // Volvemos al orden original de `ws` con nuevos zIndex ya aplicados
            const map = new Map(rebased.map((w) => [w.id, w.zIndex]));
            return ws.map((w) => ({ ...w, zIndex: map.get(w.id) ?? w.zIndex }));
        });
    }, []);

    /** Trae una ventana al frente y marca foco exclusivo */
    const bringToFront = useCallback((id: string) => {
        recycleZIfNeeded();
        setWindows((ws) => {
            const nextZ = ++zCounter;
            return ws.map((w) =>
                w.id === id
                    ? { ...w, isFocused: true, zIndex: nextZ }
                    : { ...w, isFocused: false }
            );
        });
    }, [recycleZIfNeeded]);

    /** Enfoca una ventana existente (sin cambiar su estado) */
    const focus = useCallback((id: string) => {
        bringToFront(id);
    }, [bringToFront]);

    /** Enfoca y si estaba minimizada la restaura (helper “amigable”) */
    const focusOrRestore = useCallback((id: string) => {
        recycleZIfNeeded();
        setWindows((ws) =>
            ws.map((w) => {
                if (w.id !== id) return { ...w, isFocused: false };
                const nextState: WindowState = w.state === "minimized" ? "normal" : w.state;
                return { ...w, state: nextState, isFocused: true, zIndex: ++zCounter };
            })
        );
    }, [recycleZIfNeeded]);

    /** Abre una ventana; si ya existe, la enfoca y la restaura a "normal" */
    const open = useCallback((cfg: WindowConfig) => {
        recycleZIfNeeded();
        setWindows((ws) => {
            const existing = ws.find((w) => w.id === cfg.id);
            if (existing) {
                // Si ya existe: focus y si estaba minimizada, restaurar
                const wasMinimized = existing.state === "minimized";
                const updated = ws.map((w) =>
                    w.id === cfg.id
                        ? { ...w, state: wasMinimized ? ("normal" as WindowState) : w.state }
                        : { ...w, isFocused: false }
                );
                // Focus al frente sin mezclar en la misma pasada
                setTimeout(() => bringToFront(cfg.id));
                return updated;
            }
            // Nueva ventana
            const newWindow: OsWindow = {
                id: cfg.id,
                title: cfg.title,
                icon: cfg.icon,
                content: cfg.content,
                bounds: cfg.bounds,
                state: "normal" as WindowState,
                isFocused: true,
                zIndex: ++zCounter,
            };
            // Desenfocar las demás
            return [...ws.map((w) => ({ ...w, isFocused: false })), newWindow];
        });
    }, [bringToFront, recycleZIfNeeded]);

    /** Cierra una ventana; si era la enfocada, enfoca la siguiente (priorizando no minimizadas) */
    const close = useCallback((id: string) => {
        setWindows((ws) => {
            const closing = ws.find((w) => w.id === id);
            const remaining = ws.filter((w) => w.id !== id);

            // Limpia bounds previos almacenados
            prevNormalBounds.current.delete(id);

            if (!closing?.isFocused) return remaining;

            if (remaining.length > 0) {
                // intenta una visible (no minimizada)
                const visible = [...remaining]
                    .filter((w) => w.state !== "minimized")
                    .sort((a, b) => b.zIndex - a.zIndex)[0];

                const next = visible ?? [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];

                return remaining.map((w) =>
                    w.id === next.id ? { ...w, isFocused: true } : { ...w, isFocused: false }
                );
            }
            return remaining;
        });
    }, []);

    /** Minimiza una ventana (permanece en taskbar, pierde foco) */
    const minimize = useCallback((id: string) => {
        setWindows((ws) =>
            ws.map((w) =>
                w.id === id
                    ? { ...w, state: "minimized" as WindowState, isFocused: false }
                    : w
            )
        );
    }, []);

    /** Maximiza una ventana; guarda bounds previos si estaban definidos */
    const maximize = useCallback((id: string) => {
        setWindows((ws) => {
            return ws.map((w) => {
                if (w.id !== id) return w;
                // Guarda bounds previos si no estaba ya maximizada
                if (w.state !== "maximized") {
                    prevNormalBounds.current.set(id, w.bounds);
                }
                return { ...w, state: "maximized" as WindowState };
            });
        });
        // Llévala al frente
        bringToFront(id);
    }, [bringToFront]);

    /** Restaura a estado "normal"; intenta devolver bounds previos si había */
    const restore = useCallback((id: string) => {
        setWindows((ws) =>
            ws.map((w) =>
                w.id === id
                    ? {
                        ...w,
                        state: "normal" as WindowState,
                        bounds:
                            prevNormalBounds.current.get(id) !== undefined
                                ? prevNormalBounds.current.get(id)
                                : w.bounds,
                    }
                    : w
            )
        );
        // Trae al frente
        bringToFront(id);
    }, [bringToFront]);

    /**
     * Toggle:
     * - Si no existe → abre
     * - Si existe minimizada → restore
     * - Si existe normal/maximizada → focus (traer al frente)
     */
    const toggle = useCallback((cfg: WindowConfig) => {
        recycleZIfNeeded();
        setWindows((ws) => {
            const existing = ws.find((w) => w.id === cfg.id);
            if (!existing) {
                // Abrir nueva
                const newWindow: OsWindow = {
                    id: cfg.id,
                    title: cfg.title,
                    icon: cfg.icon,
                    content: cfg.content,
                    bounds: cfg.bounds,
                    state: "normal",
                    isFocused: true,
                    zIndex: ++zCounter,
                };
                return [...ws.map((w) => ({ ...w, isFocused: false })), newWindow];
            }
            // Ya existe
            if (existing.state === "minimized") {
                // Restaurar y enfocar
                const next = ws.map((w) =>
                    w.id === existing.id ? { ...w, state: "normal" as WindowState } : { ...w, isFocused: false }
                );
                setTimeout(() => bringToFront(existing.id));
                return next;
            }
            // Solo enfocar
            setTimeout(() => bringToFront(existing.id));
            return ws.map((w) => (w.id === existing.id ? w : { ...w, isFocused: false }));
        });
    }, [bringToFront, recycleZIfNeeded]);

    /** Actualiza bounds (para drag/resize) */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const same = (a: any, b: any) =>
        a && b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

    const setBounds = useCallback((id: string, bounds: OsWindow["bounds"]) => {
        setWindows((ws) =>
            ws.map((w) => {
                if (w.id !== id) return w;
                if (same(w.bounds, bounds)) return w; // nada que hacer
                return { ...w, bounds };
            })
        );
    }, []);

    /** Helpers de consulta */
    const isOpen = useCallback((id: string) => windows.some((w) => w.id === id), [windows]);
    const getWindow = useCallback((id: string) => windows.find((w) => w.id === id), [windows]);

    const value: OSApi = {
        windows,
        open,
        close,
        focus,
        minimize,
        maximize,
        restore,
        toggle,
        // mejoras expuestas
        setBounds,
        isOpen,
        getWindow,
        focusOrRestore,
    };

    return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOS() {
    const ctx = useContext(OSContext);
    if (!ctx) throw new Error("useOS must be used within OSProvider");
    return ctx;
}
