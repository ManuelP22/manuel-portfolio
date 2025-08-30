import { useEffect, useState } from "react";

type SectionLink = { id: string; label: string };

export default function Dots({
  sections,
  scrollContainerRef,
}: {
  sections: SectionLink[];
  // ✅ Aceptar null porque el ref es null durante el montaje
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const root = scrollContainerRef.current ?? null;

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive((vis[0].target as HTMLElement).id);
      },
      { root, threshold: [0.3, 0.6, 0.9] }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [sections, scrollContainerRef]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Indicador de secciones"
      className="pointer-events-none fixed right-4 top-1/2 -translate-y-1/2 z-50"
    >
      <ul className="space-y-3">
        {sections.map((s) => (
          <li key={s.id} className="flex justify-end">
            <button
              onClick={() => scrollTo(s.id)}
              className={`pointer-events-auto w-3 h-3 rounded-full border border-accent/40 transition
                ${active === s.id ? "bg-accent scale-110" : "bg-transparent hover:bg-accent/20"}`}
              title={s.label}
              aria-label={s.label}
              aria-current={active === s.id ? "true" : undefined}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
