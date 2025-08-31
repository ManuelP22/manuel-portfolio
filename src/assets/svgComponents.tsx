import { motion } from "framer-motion";

/* =================== New SVG utilities =================== */
/** Concentric rings — moderno, funciona como “radar” sutil */
export function SvgConcentricRings({
  className = "",
  animated = true,
}: { className?: string; animated?: boolean }) {
  const sweep = 260; // longitud del dash visible
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      {/* Anillos base con ligera respiración/rotación */}
      <motion.g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        animate={
          animated
            ? { rotate: [0, 8, -4, 0] }
            : undefined
        }
        transition={animated ? { duration: 18, repeat: Infinity, ease: "easeInOut" } : undefined}
        style={{ transformOrigin: "60px 60px" }}
      >
        {[12, 24, 36, 48].map((r) => (
          <motion.circle
            key={r}
            cx="60"
            cy="60"
            r={r}
            opacity={0.9 - r / 60}
            animate={animated ? { opacity: [0.35, 0.65, 0.35] } : undefined}
            transition={animated ? { duration: 4 + r / 12, repeat: Infinity, ease: "easeInOut" } : undefined}
          />
        ))}
      </motion.g>

      {/* Sweep (radar) — un dash que da la vuelta */}
      <motion.circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray={`${sweep} 999`}
        strokeLinecap="round"
        opacity={0.35}
        animate={animated ? { rotate: 360 } : undefined}
        transition={animated ? { duration: 12, repeat: Infinity, ease: "linear" } : undefined}
        style={{ transformOrigin: "60px 60px" }}
      />

      {/* núcleo con pulso */}
      <motion.circle
        cx="60"
        cy="60"
        r="2.6"
        fill="currentColor"
        animate={animated ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] } : undefined}
        transition={animated ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
    </svg>
  );
}
/** Sine wave — tech vibe, ideal como subrayado dinámico */
export function SvgSineWave({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 400 64" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
            <path d="
        M 0 32
        C 50 0, 100 64, 150 32
        S 250 0, 300 32
        S 350 64, 400 32" />
        </svg>
    );
}

/** Plus grid — más liviano que un dot grid, look de sistema de diseño */
export function SvgPlusGrid({ className = "" }: { className?: string }) {
    const items = Array.from({ length: 25 });
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
            {items.map((_, i) => {
                const x = (i % 5) * 20 + 10;
                const y = Math.floor(i / 5) * 20 + 10;
                return (
                    <g key={i} transform={`translate(${x} ${y})`} stroke="currentColor" strokeWidth="2">
                        <line x1="-3" y1="0" x2="3" y2="0" />
                        <line x1="0" y1="-3" x2="0" y2="3" />
                    </g>
                );
            })}
        </svg>
    );
}

/** Isometric cubes — geométrico, recuerda a devtools/3D grid */
export function SvgIsometricCubes({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* cubo central */}
            <g transform="translate(60 60)">
                <polygon points="0,-18 16,-9 0,0 -16,-9" />
                <polygon points="0,0 16,-9 16,9 0,18" opacity="0.7" />
                <polygon points="0,0 -16,-9 -16,9 0,18" opacity="0.5" />
            </g>
            {/* cubos satélite */}
            <g opacity="0.5">
                <g transform="translate(30 40) scale(0.7)">
                    <polygon points="0,-18 16,-9 0,0 -16,-9" />
                    <polygon points="0,0 16,-9 16,9 0,18" />
                    <polygon points="0,0 -16,-9 -16,9 0,18" />
                </g>
                <g transform="translate(90 80) scale(0.6)">
                    <polygon points="0,-18 16,-9 0,0 -16,-9" />
                    <polygon points="0,0 16,-9 16,9 0,18" />
                    <polygon points="0,0 -16,-9 -16,9 0,18" />
                </g>
            </g>
        </svg>
    );
}


/** Logo “MPerez” — geométrico (usa text-secondary / text-accent). */
export function MPerezLogo({
    className = "",
    variant = "full", // "full" | "compact"
}: {
    className?: string;
    variant?: "full" | "compact";
}) {
    if (variant === "compact") {
        return (
            <svg
                viewBox="0 0 84 40"
                className={className}
                role="img"
                aria-label="MP mark"
                fill="currentColor"
            >
                {/* M */}
                <g transform="translate(0,0)">
                    <path d="M6 32V8H14L20 18L26 8H34V32H26V19.5L20 28L14 19.5V32H6Z" />
                </g>
                {/* separador sutil */}
                <rect x="38" y="10" width="2" height="20" opacity="0.35" />
                {/* P */}
                <g transform="translate(44,0)">
                    <path d="M0 32V8H18C25 8 30 12.5 30 19C30 25.5 25 30 18 30H8V32H0Z" />
                    <path d="M18 16H8V22H18C20.8 22 22.5 20.7 22.5 19C22.5 17.3 20.8 16 18 16Z" />
                </g>
            </svg>
        );
    }

    // FULL: MPEREZ
    return (
        <svg
            viewBox="0 0 260 40"
            className={className}
            role="img"
            aria-label="MPerez logo"
            fill="currentColor"
        >
            {/* M */}
            <g transform="translate(0,0)">
                <path d="M6 32V8H14L20 18L26 8H34V32H26V19.5L20 28L14 19.5V32H6Z" />
            </g>

            {/* separador */}
            <rect x="40" y="10" width="2" height="20" opacity="0.35" />

            {/* P (ponle un wrapper con .text-accent si quieres duotone) */}
            <g transform="translate(48,0)">
                <path d="M0 32V8H18C25 8 30 12.5 30 19C30 25.5 25 30 18 30H8V32H0Z" />
                <path d="M18 16H8V22H18C20.8 22 22.5 20.7 22.5 19C22.5 17.3 20.8 16 18 16Z" />
            </g>

            {/* E */}
            <g transform="translate(84,0)">
                <rect x="0" y="8" width="22" height="6" />
                <rect x="0" y="17" width="16" height="6" />
                <rect x="0" y="26" width="22" height="6" />
            </g>

            {/* R */}
            <g transform="translate(114,0)">
                {/* tronco + panza (como P) */}
                <path d="M0 32V8H18C25 8 30 12.5 30 19C30 24 26.4 28.1 20.5 29.2L30 32V32H20L9 28V32H0Z" />
                <path d="M18 16H8V22H18C20.8 22 22.5 20.7 22.5 19C22.5 17.3 20.8 16 18 16Z" />
                {/* pierna diagonal */}
                <path d="M12 24L30 32H20L8 26V24H12Z" />
            </g>

            {/* E (segunda) */}
            <g transform="translate(150,0)">
                <rect x="0" y="8" width="22" height="6" />
                <rect x="0" y="17" width="16" height="6" />
                <rect x="0" y="26" width="22" height="6" />
            </g>

            {/* Z */}
            <g transform="translate(176,0)">
                <rect x="0" y="8" width="28" height="6" />
                <rect x="0" y="26" width="28" height="6" />
                <polygon points="0,30 0,26 22,14 28,14 28,18" />
            </g>

            {/* ajuste de espaciado final (opcional: una barra fina como cierre) */}
            <rect x="208" y="10" width="2" height="20" opacity="0.15" />
        </svg>
    );
}

/** Monograma “M” animado — se dibuja el trazo (para cuando #home no está visible). */

export function MMark({ className = "" }: { className?: string }) {
    return (
        <motion.svg
            viewBox="0 0 64 64"
            className={className}
            role="img"
            aria-label="M"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0.8 }, visible: { opacity: 1 } }}
        >
            <motion.path
                d="M8 52V12H20L32 28L44 12H56V52"
                strokeDasharray="160"
                strokeDashoffset="160"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
            />
            <motion.circle
                cx="32"
                cy="28"
                r="2.8"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 1.06, 1] }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.6 }}
            />
        </motion.svg>
    );
}

export function SvgNeonGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* líneas verticales y horizontales */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`g-${i}`} filter="url(#neonGlow)" opacity={0.7}>
          <line
            x1={i * 50 + 50}
            y1="0"
            x2={i * 50 + 50}
            y2="400"
            stroke="url(#neonGradient)"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1={i * 50 + 50}
            x2="400"
            y2={i * 50 + 50}
            stroke="url(#neonGradient)"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* puntos en intersecciones */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = (i % 4) * 100 + 100;
        const y = Math.floor(i / 4) * 100 + 100;
        return (
          <circle
            key={`c-${i}`}
            cx={x}
            cy={y}
            r="3"
            fill="currentColor"
            filter="url(#neonGlow)"
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

export function SvgQuantumParticles({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="quantumGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {Array.from({ length: 8 }, (_, i) => {
        const a1 = (i * 45 * Math.PI) / 180;
        const a2 = ((i + 1) * 45 * Math.PI) / 180;
        const r1 = 80 + Math.sin(i) * 30;
        const r2 = 80 + Math.sin(i + 1) * 30;
        const x1 = 150 + Math.cos(a1) * r1;
        const y1 = 150 + Math.sin(a1) * r1;
        const x2 = 150 + Math.cos(a2) * r2;
        const y2 = 150 + Math.sin(a2) * r2;

        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.35"
              strokeDasharray="2,2"
            />
            <circle
              cx={x1}
              cy={y1}
              r={4 + Math.sin(i) * 2}
              fill="url(#particleGradient)"
              filter="url(#quantumGlow)"
            />
          </g>
        );
      })}

      {/* núcleo central */}
      <circle
        cx="150"
        cy="150"
        r="8"
        fill="currentColor"
        filter="url(#quantumGlow)"
        opacity="0.9"
      />
    </svg>
  );
}

export function SvgMorphBlob({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
        <filter id="blobShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Nota: <animate> funciona en SVG dentro de React/TSX */}
      <path
        d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z"
        fill="url(#blobGradient)"
        filter="url(#blobShadow)"
      >
        <animate
          attributeName="d"
          values="
            M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z;
            M100,25 C135,25 175,65 175,100 C175,135 135,175 100,175 C65,175 25,135 25,100 C25,65 65,25 100,25 Z;
            M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

