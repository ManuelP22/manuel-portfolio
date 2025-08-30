import type { Dispatch, SetStateAction } from "react";
import { Link, NavLink } from "react-router-dom";

interface MobileMenuProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const SECTIONS = [
  { id: "home", label: "Inicio" },
  { id: "about", label: "Sobre mí" },
  { id: "projects", label: "Proyectos" },
  { id: "contact", label: "Contacto" },
];

export default function MobileMenu({ open, setOpen }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="border-t border-accent/30 bg-secondary/95 text-accent">
      <ul className="px-4 py-2 space-y-1">
        {SECTIONS.map(s => (
          <li key={s.id}>
            <Link
              to={`/#${s.id}`}
              className="block px-3 py-2 rounded text-sm hover:bg-accent/10"
              onClick={() => setOpen(false)}
            >
              {s.label}
            </Link>
          </li>
        ))}
        <li className="pt-2 mt-2 border-t border-accent/20">
          <NavLink
            to="/resume"
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm transition ${isActive ? "bg-accent text-base" : "hover:bg-accent/10"}`
            }
            onClick={() => setOpen(false)}
          >
            Resume
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
