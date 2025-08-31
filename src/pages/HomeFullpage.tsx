// HomeFullpage.tsx
import { useRef } from "react";
import Section from "../components/Section";
import Dots from "../components/Dots";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";

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
                <Section id="home" >
                    <Hero />
                </Section>
                <Section id="about">
                    <About />
                </Section>
                <Section id="projects">
                    <Projects />
                </Section>
                <Section id="contact">
                    <Contact />
                </Section>
            </div>

            <Dots sections={SECTIONS} scrollContainerRef={ref} />
        </div>
    );
}
