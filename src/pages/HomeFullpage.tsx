// HomeFullpage.tsx
import { useRef } from "react";
import Section from "../components/Section";
import Dots from "../components/Dots";

const SECTIONS = [
    { id: "home", label: "Inicio" },
    { id: "about", label: "Sobre mí" },
    { id: "projects", label: "Proyectos" },
    { id: "contact", label: "Contacto" },
];

export default function HomeFullpage() {
    const ref = useRef<HTMLDivElement | null>(null);

    return (
        <div className="relative h-full bg-base text-accent">
            {/* ÚNICO scroller */}

            {/* fullpage-scroll oculta el scroll a la derecha de los dots */}
            <div
                ref={ref}
                className="fullpage-scroll h-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
            >
                <Section id="home" title="Inicio" />
                <Section id="about" title="Sobre mí" />
                <Section id="projects" title="Proyectos" />
                <Section id="contact" title="Contacto" />
            </div>

            <Dots sections={SECTIONS} scrollContainerRef={ref} />
        </div>
    );
}
