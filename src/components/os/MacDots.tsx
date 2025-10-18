import { motion } from "framer-motion";
import { Minus, X, Maximize2 } from "lucide-react";
import * as React from "react";

/** Iconos y borde/gradientes al estilo macOS */
const DOTS = {
  red: {
    bg: "#FF5F57",
    stroke: "#E33E41",
    icon: <X size={8} strokeWidth={3} className="text-black/70" />,
  },
  yellow: {
    bg: "#FFBD2E",
    stroke: "#E1A116",
    icon: <Minus size={8} strokeWidth={3} className="text-black/70" />,
  },
  green: {
    bg: "#28C840",
    stroke: "#1AAB2B",
    // El de mac actual suele ser "full screen" / flechas opuestas; usamos un equivalente:
    icon: <Maximize2 size={8} strokeWidth={2.5} className="text-black/70" />,
  },
} as const;

type DotColor = keyof typeof DOTS;

type MacDotProps = {
  color: DotColor;
  ariaLabel: string;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  ml?: number;
  /** si está en un grupo, los iconos siguen el hover del contenedor */
  sharedHover?: boolean;
  /** controla desde afuera si hay hover activo en el grupo */
  isHoveredExternal?: boolean;
};

/**
 * Dot individual: muestra el icono SOLO en hover (o cuando isHoveredExternal=true).
 * Incluye micro-animación de scale en el círculo y fade/scale del icono.
 */
function MacDot({
  color,
  ariaLabel,
  title,
  onClick,
  ml = 0,
  sharedHover = false,
  isHoveredExternal = false,
}: MacDotProps) {
  const c = DOTS[color];
  const showIcon = sharedHover ? isHoveredExternal : undefined;

  return (
    <button
      aria-label={ariaLabel}
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className="[-webkit-app-region:no-drag] group relative"
      style={{
        width: 22,
        height: 22,
        padding: 4, // círculo visual de 12px centrado
        borderRadius: 9999,
        background: "transparent",
        display: "grid",
        placeItems: "center",
        lineHeight: 0,
        cursor: "pointer",
        marginLeft: ml,
      }}
    >
      {/* Círculo base */}
      <motion.span
        initial={false}
        animate={{ scale: 1 }}
        whileHover={sharedHover ? undefined : { scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{
          width: 16,
          height: 16,
          borderRadius: 9999,
          background: c.bg,
          border: `1px solid ${c.stroke}`,
          // leve brillo interno
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.35)",
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Icono: aparece en hover con fade + scale */}
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            sharedHover
              ? { opacity: showIcon ? 1 : 0, scale: showIcon ? 1 : 0.6 }
              : { opacity: 0, scale: 0.6 }
          }
          whileHover={sharedHover ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="pointer-events-none"
          // también mostrar icono al enfocar con teclado
          style={{ outline: "none" }}
        >
          {c.icon}
        </motion.span>
      </motion.span>
    </button>
  );
}

/**
 * Grupo de 3 botones con hover compartido (como en macOS: al pasar el mouse por el header,
 * aparecen los iconos de los tres). Colócalo en tu barra de título.
 */
export function MacTrafficLights({
  onClose,
  onMinimize,
  onZoom,
  className,
  titleHoverAreaRef,
}: {
  onClose: (e: React.MouseEvent) => void;
  onMinimize: (e: React.MouseEvent) => void;
  onZoom: (e: React.MouseEvent) => void;
  className?: string;
  /** opcional: referencia a un área mayor (ej. toda la titlebar) para compartir hover */
  titleHoverAreaRef?: React.RefObject<HTMLElement>;
}) {
  const [hover, setHover] = React.useState(false);

  // Si nos pasan un área externa (titlebar), hacemos hover compartido real.
  React.useEffect(() => {
    const el = titleHoverAreaRef?.current;
    if (!el) return;
    const onEnter = () => setHover(true);
    const onLeave = () => setHover(false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [titleHoverAreaRef]);

  return (
    <motion.div
      className={className}
      onMouseEnter={() => !titleHoverAreaRef && setHover(true)}
      onMouseLeave={() => !titleHoverAreaRef && setHover(false)}
      style={{ display: "flex", gap: 0, alignItems: "center" }}
    >
      <MacDot
        color="red"
        ariaLabel="Cerrar"
        title="Cerrar"
        onClick={onClose}
        sharedHover
        isHoveredExternal={hover}
      />
      <MacDot
        color="yellow"
        ariaLabel="Minimizar"
        title="Minimizar"
        onClick={onMinimize}
        sharedHover
        isHoveredExternal={hover}
      />
      <MacDot
        color="green"
        ariaLabel="Zoom"
        title="Zoom"
        onClick={onZoom}
        sharedHover
        isHoveredExternal={hover}
      />
    </motion.div>
  );
}
