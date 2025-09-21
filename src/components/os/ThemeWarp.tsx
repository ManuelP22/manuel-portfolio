import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlitchText } from "../GlitchText";

export type ThemeWarpDirection = "toRetro" | "toModern";

export type ThemeWarpHandle = {
  start: (
    direction: ThemeWarpDirection,
    opts?: {
      durationMs?: number;      // duración de la animación
      holdMs?: number;          // TIEMPO EXTRA tras la animación, con overlay visible
      onComplete?: () => void;  // se ejecuta al final de (durationMs + holdMs)
    }
  ) => void;
};

type InternalState = {
  direction: ThemeWarpDirection;
  durationMs: number;
  holdMs: number;
  onComplete?: () => void;
};

const DEFAULT_MS = {
  toRetro: 2200,
  toModern: 1800,
} as const;

const DEFAULT_HOLD = 1000; // 1 segundo de espera extra tras la animación

export const ThemeWarp = forwardRef<ThemeWarpHandle, { zIndex?: number }>(
  ({ zIndex = 9999 }, ref) => {
    const [active, setActive] = useState(false);
    const [st, setSt] = useState<InternalState | null>(null);
    const timerEnd = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      start: (direction, opts) => {
        const durationMs = opts?.durationMs ?? DEFAULT_MS[direction];
        const holdMs = opts?.holdMs ?? DEFAULT_HOLD;

        // limpia timer previo
        if (timerEnd.current) {
          window.clearTimeout(timerEnd.current);
          timerEnd.current = null;
        }

        setSt({ direction, durationMs, holdMs, onComplete: opts?.onComplete });
        setActive(true);

        // ejecuta onComplete y oculta overlay tras animación + hold
        timerEnd.current = window.setTimeout(() => {
          opts?.onComplete?.();
          setActive(false);
          timerEnd.current = null;
        }, durationMs + holdMs);
      },
    }));

    useEffect(() => {
      return () => {
        if (timerEnd.current) window.clearTimeout(timerEnd.current);
      };
    }, []);

    const isRetro = st?.direction === "toRetro";

    return (
      <AnimatePresence>
        {active && st && (
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex }} aria-hidden>
            {/* ======== OVERLAY RETRO (genérico, sin marcas) ======== */}
            <AnimatePresence>
              {isRetro && (
                <motion.div
                  key="retro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black"
                >
                  {/* Vignette CRT */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.4) 100%)",
                    }}
                  />
                  {/* Scanlines */}
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 0.3, scaleY: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.4, delay: 0.3 },
                      scaleY: { duration: 0.8, delay: 0.3, ease: "easeOut" },
                    }}
                    className="absolute inset-0 origin-center"
                    style={{
                      background: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 3px,
                        rgba(0, 255, 0, 0.05) 3px,
                        rgba(0, 255, 0, 0.05) 6px
                      )`,
                    }}
                  />
                  {/* Terminal retro (textos genéricos) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    className="absolute top-1/4 left-8 right-8 text-green-400 font-mono"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                        className="overflow-hidden whitespace-nowrap text-sm"
                      >
                        Legacy OS [Build 4.10]
                      </motion.div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                        className="overflow-hidden whitespace-nowrap text-sm"
                      >
                        (C) 1981–1998. All rights reserved.
                      </motion.div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
                        className="overflow-hidden whitespace-nowrap text-sm"
                      >
                        Initializing{" "}<GlitchText text="classic desktop" />{" "}environment...
                      </motion.div>
                      {/* Barra progreso retro */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1.8 }}
                        className="mt-4"
                      >
                        <div className="text-xs mb-1">Loading: [████████████████████] 100%</div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "280px" }}
                          transition={{ duration: 0.6, delay: 1.9, ease: "easeOut" }}
                          className="h-2 border border-green-600"
                          style={{
                            background:
                              "repeating-linear-gradient(90deg, #00ff00 0, #00ff00 2px, #008800 2px, #008800 4px)",
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ======== OVERLAY MODERNO ======== */}
            <AnimatePresence>
              {!isRetro && (
                <motion.div
                  key="modern"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
                >
                  {/* Grid futurista */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: "40px 40px",
                      backgroundPosition: "center center",
                    }}
                  />
                  {/* Partículas */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          x:
                            Math.random() *
                            (typeof window !== "undefined" ? window.innerWidth : 1000),
                          y:
                            Math.random() *
                            (typeof window !== "undefined" ? window.innerHeight : 1000),
                          scale: 0,
                        }}
                        animate={{ opacity: 0.6, scale: 1, y: [null, -20, 20, 0] }}
                        transition={{
                          duration: 2,
                          delay: Math.random() * 0.8 + 0.3,
                          ease: "easeOut",
                          y: {
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                          },
                        }}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full"
                        style={{ boxShadow: "0 0 4px rgba(59, 130, 246, 0.6)" }}
                      />
                    ))}
                  </div>
                  {/* Terminal moderna */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-lg px-8"
                  >
                    <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-blue-400/20 p-6 shadow-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span className="text-slate-300 text-xs ml-2 font-mono">quantum-terminal</span>
                      </div>
                      <div className="space-y-2 text-sm font-mono">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                          className="overflow-hidden whitespace-nowrap text-blue-400"
                        >
                          $ quantum-os --initialize
                        </motion.div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                          className="overflow-hidden whitespace-nowrap text-slate-300"
                        >
                          Activating{" "}<GlitchText text="neural"/>{" "}interface...
                        </motion.div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.9, delay: 1.2, ease: "easeOut" }}
                          className="overflow-hidden whitespace-nowrap text-slate-300"
                        >
                          Connecting to <GlitchText text={"quantum"} /> desktop environment...
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 1.5 }}
                          className="mt-4"
                        >
                          <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Loading components</span>
                            <span>100%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                              style={{ boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                            />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

ThemeWarp.displayName = "ThemeWarp";
