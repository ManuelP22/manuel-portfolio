import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const SECTIONS = [
  { id: "home", label: "Inicio" },
  { id: "about", label: "Sobre mí" },
  { id: "projects", label: "Proyectos" },
  { id: "contact", label: "Contacto" },
];

const RADIUS = 92; // radio del aro

export default function MobileMenu({ open, setOpen }: MobileMenuProps) {
  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Cerrar menú"
            className="fixed inset-0 z-[990] bg-black/20"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="fixed z-[1000] right-3 top-14 sm:right-4 sm:top-16">
            {/* Disco principal */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative"
            >
              <div
                className="relative rounded-full border border-accent/30 shadow-xl bg-base text-secondary"
                style={{ width: 260, height: 260 }}
                role="dialog"
                aria-label="Menú"
              >
                {/* aro guía */}
                <div className="absolute inset-8 rounded-full border border-secondary/15 pointer-events-none" />

                {/* Centro */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                rounded-full h-10 w-10 bg-secondary/10 border border-secondary/20
                                grid place-items-center text-xs select-none">
                  Menu
                </div>

                {/* Items en aro */}
                {[
                  ...SECTIONS,
                  { id: "resume", label: "Resume", external: false as const },
                ].map((s, index, arr) => {
                  const TOTAL = arr.length;
                  const angleDeg = (index / TOTAL) * 360 - 90; // arranca arriba
                  const angle = (angleDeg * Math.PI) / 180;
                  const x = Math.cos(angle) * RADIUS;
                  const y = Math.sin(angle) * RADIUS;

                  const commonClasses =
                    "h-10 w-10 sm:h-11 sm:w-11 rounded-full grid place-items-center " +
                    "bg-white/80 text-secondary shadow border border-secondary/20 " +
                    "backdrop-blur font-semibold text-sm hover:scale-105 transition-transform";

                  const content =
                    s.id === "resume" ? (
                      <NavLink
                        to="/resume"
                        className={({ isActive }) =>
                          `${commonClasses} ${isActive ? "bg-accent text-base" : ""}`
                        }
                        onClick={() => setOpen(false)}
                      >
                        CV
                      </NavLink>
                    ) : (
                      <Link
                        to={`/#${s.id}`}
                        className={commonClasses}
                        onClick={() => setOpen(false)}
                        title={s.label}
                      >
                        {s.label[0]}
                      </Link>
                    );

                  return (
                    <div
                      key={s.id}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 20,
                          delay: 0.04 * index,
                        }}
                      >
                        {content}
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Botón cerrar */}
              <motion.button
                onClick={() => setOpen(false)}
                className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-accent text-base
                           grid place-items-center shadow-md border border-accent/40"
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.12 }}
                aria-label="Cerrar"
                title="Cerrar"
              >
                ×
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
