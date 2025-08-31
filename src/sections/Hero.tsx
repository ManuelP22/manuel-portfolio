// src/sections/Hero.tsx
import { motion, useScroll, useTransform, useReducedMotion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, Code, Zap } from "lucide-react";
import { SvgConcentricRings, SvgSineWave, SvgPlusGrid, SvgIsometricCubes, SvgNeonGrid, SvgQuantumParticles, SvgMorphBlob } from "../assets/svgComponents";
// Reemplaza esta imagen por la tuya
import perfil from "../assets/perfil.jpeg";

type HeroProps = {
  name?: string;
  title?: string;
  subtitle?: string;
  bullets?: string[];
};

export default function HeroPersonal({
  name = "Manuel Perez",
  title = "Fullstack Developer",
  subtitle = "I craft robust, fast and maintainable products end-to-end — from modern frontends to scalable APIs.",
  bullets = [
    "TypeScript • React • Tailwind • Framer Motion",
    "C# • .NET • SQL Server • Dapper",
  ],
}: HeroProps) {
  const ref = useRef<HTMLElement | null>(null);
  const imgWrapRef = useRef<HTMLDivElement | null>(null);

  // Scroll-parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const prefersReduced = useReducedMotion();

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const subY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);

  // “repel” y micro-parallax de la foto
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const mvScale = useMotionValue(1);
  const x = useSpring(mvX, { stiffness: 180, damping: 18 });
  const y = useSpring(mvY, { stiffness: 180, damping: 18 });
  const scale = useSpring(mvScale, { stiffness: 180, damping: 18 });

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Detectar dispositivos táctiles para desactivar interacciones pesadas
  const isCoarsePointer = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches,
    []
  );

  useEffect(() => {
    if (prefersReduced || isCoarsePointer) return;
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced, isCoarsePointer]);

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (prefersReduced || isCoarsePointer || !imgWrapRef.current) return;
    const containerRect = e.currentTarget.getBoundingClientRect();
    const imgRect = imgWrapRef.current.getBoundingClientRect();

    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    const centerX = imgRect.left - containerRect.left + imgRect.width / 2;
    const centerY = imgRect.top - containerRect.top + imgRect.height / 2;

    const dx = centerX - mouseX;
    const dy = centerY - mouseY;

    const dist = Math.hypot(dx, dy);
    const maxShift = 44;
    const radius = 560;
    const influence = Math.max(0, 1 - dist / radius);

    mvX.set(Math.max(-maxShift, Math.min(maxShift, dx * 0.22 * influence)));
    mvY.set(Math.max(-maxShift, Math.min(maxShift, dy * 0.22 * influence)));
    mvScale.set(1 + 0.028 * influence);
  };
  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    mvX.set(0); mvY.set(0); mvScale.set(1);
  };

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative overflow-hidden bg-base text-secondary min-h-screen pt-24 pb-16 md:pt-32 md:pb-24"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradientes cruzados */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-base to-accent/10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/10 to-secondary/10" />

        {/* Halos radiales (usando currentColor vía text-*) */}
        <div className="absolute top-1/4 right-1/5 w-[28rem] h-[28rem] rounded-full blur-3xl text-secondary/30"
          style={{ background: "radial-gradient(circle, currentColor 0%, transparent 65%)" }} />
        <div className="absolute bottom-1/4 left-[12%] w-[22rem] h-[22rem] rounded-full blur-2xl text-accent/30"
          style={{ background: "radial-gradient(circle, currentColor 0%, transparent 65%)" }} />

        {/* Barra vertical central (marca) */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-secondary/70 via-accent/70 to-transparent" />

        {/* Patrones sutiles (dots + grid) */}
        <div className="absolute inset-0 text-secondary/10 [background:radial-gradient(circle_at_25%_25%,currentColor_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute inset-0 text-accent/10 [background:linear-gradient(45deg,currentColor_1px,transparent_1px),linear-gradient(-45deg,currentColor_1px,transparent_1px)] [background-size:42px_42px]" />

        {/* ================= VECTORES (reubicados, animación lenta) ================= */}
        <motion.div
          className="absolute top-10 right-[18%] h-36 w-36 text-secondary/60 drop-shadow-[0_0_18px_rgba(0,0,0,0.06)]"
          animate={prefersReduced ? undefined : { rotate: [0, 8, -4, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={prefersReduced ? undefined : { transform: `translate(${mouse.x * 18}px, ${mouse.y * 18}px)` }}
        >
          <SvgConcentricRings />
        </motion.div>

        <motion.div
          className="absolute bottom-28 right-[14%] h-10 w-64 text-accent/70 drop-shadow-[0_0_10px_rgba(0,0,0,0.08)]"
          animate={prefersReduced ? undefined : { x: [0, 10, 0, -8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <SvgSineWave />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-[8%] -translate-y-1/2 h-28 w-28 text-accent/60"
          animate={prefersReduced ? undefined : { y: [0, -10, 0, 8, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        >
          <SvgPlusGrid />
        </motion.div>

        <motion.div
          className="absolute bottom-28 left-[14%] h-32 w-32 text-secondary/50"
          animate={prefersReduced ? undefined : { rotate: [0, -8, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <SvgIsometricCubes />
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-[26%] h-64 w-64 text-accent/60"
          animate={prefersReduced ? undefined : { rotate: 360, scale: [0.92, 1.1, 0.92] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={prefersReduced ? undefined : { transform: `translate(${mouse.x * -24}px, ${mouse.y * -24}px)` }}
        >
          <SvgNeonGrid />
        </motion.div>

        <motion.div
          className="absolute top-[58%] left-[22%] h-44 w-44 text-secondary/60"
          animate={prefersReduced ? undefined : { rotate: [-180, -360], scale: [1, 1.12, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        >
          <SvgQuantumParticles />
        </motion.div>

        <motion.div
          className="absolute bottom-[14%] right-[30%] h-32 w-32 text-accent/60"
          animate={prefersReduced ? undefined : { scale: [1, 1.25, 1], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <SvgMorphBlob />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Badge/Branding */}
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 backdrop-blur"
        >
          <span className="text-xs tracking-widest uppercase text-secondary/90">{name}</span>
          <span className="inline-block h-1.5 w-10 rounded-full bg-gradient-to-r from-secondary to-accent" />
          <span className="text-xs font-medium text-accent">AVAILABLE</span>
        </motion.div>

        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Texto */}
          <div>
            <motion.h1
              style={prefersReduced ? undefined : { y: titleY, opacity: fade }}
              className="text-4xl md:text-6xl leading-[1.03] relative font-extrabold"
            >
              {/* bloque 1 */}
              <span className="block text-secondary">
                {title.split(" ").slice(0, -1).join(" ")}{" "}
              </span>
              {/* bloque 2 (resalta última palabra con accent) */}
              <span className="block text-accent">
                {title.split(" ").slice(-1)}
                <span className="text-secondary">.</span>
              </span>

              {/* halo sutil detrás del título */}
              <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-secondary/10 via-transparent to-accent/10 blur-xl" />
            </motion.h1>

            <motion.p
              style={prefersReduced ? undefined : { y: subY, opacity: fade }}
              className="mt-5 max-w-2xl text-secondary/90 leading-relaxed text-lg"
            >
              {subtitle}
            </motion.p>

            {/* Skills/Chips */}
            <ul className="mt-7 grid gap-4 text-sm md:max-w-xl">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-secondary/20 bg-secondary/10 backdrop-blur-sm hover:border-accent/50 transition-colors"
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-secondary" />
                  <span className="flex-1 text-secondary/90">{b}</span>
                  <span className="opacity-70">
                    {i === 0 ? <Code size={16} className="text-secondary" /> : <Zap size={16} className="text-accent" />}
                  </span>
                </motion.li>
              ))}
            </ul>


          </div>

          {/* Foto / marco y repel */}
          <motion.div
            ref={imgWrapRef}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative mx-auto w-[78%] max-w-m"
            style={prefersReduced ? undefined : { x, y, scale }}
          >
            {/* marco exterior */}
            <div className="absolute -inset-5 rounded-2xl border border-secondary/30 backdrop-blur-sm" />
            {/* glow base */}
            <div className="absolute -bottom-8 left-6 h-20 w-3/4 rounded-full bg-secondary/30 blur-3xl" />
            <img
              src={perfil}
              alt={`${name} portrait`}
              className="relative z-[1] rounded-xl object-cover md:aspect-[4/5] ring-1 ring-secondary/20 shadow-2xl"
            />
            {/* acentos verticales */}
            <div className="absolute -right-5 top-1/3 h-10 w-px bg-secondary/80" />
            <div className="absolute -left-4 bottom-1/4 h-8 w-px bg-accent/80" />
          </motion.div>
        </div>

        {/* Indicador de “explore more” (texto) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute -bottom-48 md:-bottom-32 lg:-bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer"
        >
          <label htmlFor="explore-more" className="text-xs cursor-pointer uppercase tracking-[0.25em] text-accent/90">Explore more</label>
          <div className="w-px bg-gradient-to-b from-accent to-transparent" />
          {/* CTA: scroll a siguiente sección */}
          <motion.div
            initial={{ y: 18, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={scrollToNext}
              id="explore-more"
              className="group relative p-4 rounded-full border border-accent/40 text-accent/90"
              animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Scroll to next section"
            >
              <ArrowDown size={18} />
              {/* anillos */}
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full border border-accent/40"
                animate={prefersReduced ? undefined : { scale: [1, 1.55], opacity: [0.6, 0] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full border border-secondary/40"
                animate={prefersReduced ? undefined : { scale: [1, 1.8], opacity: [0.4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
