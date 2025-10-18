import * as React from "react";
import {
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

type DockItemProps = {
  id: string;
  label?: string;
  icon: React.ReactNode;
  gradient?: string;
  running?: boolean;
  onClick: () => void;
  mouseX: number | null;
  baseWidth: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  showTooltip?: boolean;
  showBadge?: boolean;
  badgeText?: string;
};

function isImgElement(node: React.ReactNode): node is React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>> {
  return React.isValidElement(node) && node.type === "img";
}

// Interpolación como en Svelte
function interpolate(inputRange: number[], outputRange: number[]) {
  return (value: number) => {
    if (value <= inputRange[0]) return outputRange[0];
    if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];
    
    for (let i = 0; i < inputRange.length - 1; i++) {
      if (value >= inputRange[i] && value <= inputRange[i + 1]) {
        const t = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
        return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
      }
    }
    return outputRange[0];
  };
}

export function DockItem({
  id,
  label,
  icon,
  gradient = "from-slate-400 to-slate-600",
  running = true,
  onClick,
  mouseX,
  baseWidth,
  hoveredId,
  setHoveredId,
  showTooltip = true,
  showBadge = false,
  badgeText = "1",
}: DockItemProps) {
  const imgRef = React.useRef<HTMLImageElement | HTMLSpanElement>(null);
  
  const distanceLimit = baseWidth * 6;
  
  const distanceInput = React.useMemo(() => [
    -distanceLimit,
    -distanceLimit / 1.25,
    -distanceLimit / 2,
    0,
    distanceLimit / 2,
    distanceLimit / 1.25,
    distanceLimit,
  ], [distanceLimit]);
  
  const widthOutput = React.useMemo(() => [
    baseWidth,
    baseWidth * 1.1,
    baseWidth * 1.414,
    baseWidth * 2,
    baseWidth * 1.414,
    baseWidth * 1.1,
    baseWidth,
  ], [baseWidth]);
  
  const getWidthFromDistance = React.useMemo(
    () => interpolate(distanceInput, widthOutput),
    [distanceInput, widthOutput]
  );
  
  // Springs rápidos y suaves
  const widthPx = useSpring(baseWidth, { 
    stiffness: 400, 
    damping: 40,
    mass: 0.5
  });
  
  const bounceY = useSpring(0, { 
    stiffness: 500, 
    damping: 30, 
    mass: 0.5 
  });

  // Transformaciones
  const widthRem = useTransform(widthPx, (w) => `${w / 16}rem`);
  const badgeScale = useTransform(widthPx, (w) => w / baseWidth);

  // Animación con requestAnimationFrame
  React.useEffect(() => {
    let rafId: number;
    
    function animate() {
      const el = imgRef.current;
      if (!el || mouseX === null) {
        widthPx.set(baseWidth);
        return;
      }
      
      const rect = el.getBoundingClientRect();
      const imgCenterX = rect.left + rect.width / 2;
      const distanceDelta = mouseX - imgCenterX;
      const newWidth = getWidthFromDistance(distanceDelta);
      
      widthPx.set(newWidth);
    }
    
    if (mouseX !== null) {
      rafId = requestAnimationFrame(animate);
    } else {
      widthPx.set(baseWidth);
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, getWidthFromDistance, widthPx, baseWidth]);

  const handleClick = async () => {
    onClick();
    await bounceY.set(-40);
    bounceY.set(0);
  };

  const isImage = isImgElement(icon);

  return (
    <button
      onClick={handleClick}
      aria-label={`Launch ${label} app`}
      className="relative flex flex-col items-center justify-end rounded-lg"
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Tooltip */}
      {showTooltip && hoveredId === id && label && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          style={{ y: bounceY }}
          className={cn(
            "pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2",
            "bg-gray-900/70 backdrop-blur-sm text-white",
            "px-3 py-1.5 rounded-md shadow-xl",
            "text-[0.85rem] font-normal tracking-wide whitespace-nowrap",
            "border border-white/20"
          )}
        >
          {label}
        </motion.p>
      )}

      {/* Icon Container */}
      <motion.span
        style={{ y: bounceY }}
        className="flex items-center justify-center"
      >
        {isImage ? (
          <motion.img
            ref={imgRef as React.RefObject<HTMLImageElement>}
            src={icon.props.src}
            alt={icon.props.alt || `${label} app`}
            draggable={false}
            style={{ 
              width: widthRem,
              willChange: "width"
            }}
            className="select-none"
          />
        ) : (
          <motion.span
            ref={imgRef as React.RefObject<HTMLSpanElement>}
            className={cn(
              "grid place-items-center rounded-xl",
              "bg-gradient-to-br",
              gradient
            )}
            style={{
              width: widthRem,
              height: widthRem,
              willChange: "width"
            }}
          >
            {icon}
          </motion.span>
        )}
      </motion.span>

      {/* Running Dot */}
      <div 
        className="h-1 w-1 mt-1 rounded-full bg-gray-800 dark:bg-white/90 transition-opacity duration-200"
        style={{ opacity: running ? 1 : 0 }}
      />

      {/* Badge */}
      {showBadge && (
        <motion.div
          style={{ scale: badgeScale }}
          className="absolute top-0.5 -right-0.5 w-6 h-6 rounded-full bg-red-500/90 text-white text-sm leading-6 text-center shadow-lg"
        >
          {badgeText}
        </motion.div>
      )}
    </button>
  );
}