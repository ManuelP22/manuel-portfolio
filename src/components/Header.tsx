import { useState } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-accent/30 bg-secondary/80 backdrop-blur text-accent">
      <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo (lleva a Home) */}
        <Link to="/#home" className="font-extrabold tracking-wider">
          <span className="px-2 py-1 rounded bg-accent text-base">TU</span> Portafolio
        </Link>

        {/* Botón burger SIEMPRE visible */}
        <button
          className="p-2 rounded hover:bg-accent/10 focus:outline-none focus:ring focus:ring-accent/40"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label="Abrir menú"
        >
          <div className="relative w-6 h-6">
            <span className={`absolute left-0 top-1 block h-0.5 w-6 bg-accent transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2.5 block h-0.5 w-6 bg-accent transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 top-4 block h-0.5 w-6 bg-accent transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Drawer */}
      <MobileMenu open={open} setOpen={setOpen} />
    </header>
  );
}
