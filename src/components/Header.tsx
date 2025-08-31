import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MPerezLogo, MMark } from "../assets/svgComponents";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [open, setOpen] = useState(false);           
  const [scrolled, setScrolled] = useState(false);    
  const [homeInView, setHomeInView] = useState(true); 
  const location = useLocation();

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(".fullpage-scroll");
    if (!scroller) return;

    const onScroll = () => {
      setScrolled(scroller.scrollTop > 4);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Observer para #home (usa el mismo scroller como root)
    const homeEl = document.getElementById("home");
    let observer: IntersectionObserver | null = null;
    if (homeEl) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setHomeInView(entry.isIntersecting && entry.intersectionRatio > 0.35);
        },
        {
          root: scroller,
          threshold: [0.2, 0.35, 0.6],
        }
      );
      observer.observe(homeEl);
    }

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (observer && homeEl) observer.unobserve(homeEl);
    };
  }, [location.pathname]); // reevalúa al cambiar de ruta (ej. /resume)

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 bg-transparent",
        // Base: transparente. Al scrollear: micro fondo + blur + hairline
        scrolled
          ? "backdrop-blur-md"
          : "backdrop-blur-0",
      ].join(" ")}
    >
      <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo (lleva a Home) */}
        <Link to="/#home" className="flex items-center gap-2 text-secondary">
          {homeInView ? (
            // Logo grande cuando #home visible
            <MPerezLogo className="h-7 md:h-8" />
          ) : (
            // Monograma animado cuando estás fuera del Hero
            <div className="flex items-center gap-2 font-semibold">
              <MMark className="h-10 w-10" />
            </div>
          )}
        </Link>

        <button
          className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 hover:bg-accent/10"
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
      
       <MobileMenu open={open} setOpen={setOpen} />
    </header>
  );
}
