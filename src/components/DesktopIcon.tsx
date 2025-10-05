import { useRef, useState, type ComponentType } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export type Tone = "purple" | "green" | "orange" | "pink" | "blue" | "cyan";

export function DesktopIcon({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: Icon,
  label,
  onOpen,
  tone = "blue",
  gradientClass,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: ComponentType<any>;
  label: string;
  onOpen: () => void;
  tone?: Tone;
  gradientClass?: string;
}) {
  const { theme } = useTheme();
  const isRetro = theme === "retro";

  const [selected, setSelected] = useState(false);
  const clickTimer = useRef<number | null>(null);
  const lastClick = useRef<number>(0);

  const mapToneToGrad: Record<Tone, string> = {
    purple: "grad-purple",
    green: "grad-green",
    orange: "grad-orange",
    pink: "grad-pink",
    blue: "grad-blue",
    cyan: "grad-cyan",
  };
  const grad = gradientClass ?? mapToneToGrad[tone];

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClick.current < 300) {
      if (clickTimer.current) {
        window.clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      onOpen();
      setSelected(false);
    } else {
      setSelected(true);
      clickTimer.current = window.setTimeout(() => {
        clickTimer.current = null;
      }, 320);
    }
    lastClick.current = now;
  };

  const handleDouble = () => {
    if (clickTimer.current) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    onOpen();
    setSelected(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
      setSelected(false);
    }
  };

  // ===== Clases =====
  const baseBtn =
    "group flex flex-col items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-white/70";

  const selectedModern = "ring-2 ring-white/70 ring-offset-2 ring-offset-black/30";
  const selectedRetro = "outline outline-1 outline-black/40";

  const wrapperCls = cn(
    baseBtn,
    isRetro ? "px-1 py-1" : "px-1.5 py-1.5",
    selected ? (isRetro ? selectedRetro : selectedModern) : ""
  );

  // Icon container
  const retroIconWrap = cn(
    "grid place-items-center w-14 h-14 mb-1",
    "bg-[#cfcfcf]",
    "border-2",
    "border-t-white border-l-white border-b-[#808080] border-r-[#808080]"
  );

  const modernIconWrap = cn(
    "relative grid place-items-center w-16 h-16 mb-1 rounded-2xl overflow-hidden",
    "transition-all duration-200 ease-out will-change-transform",
    grad,
    "shadow-lg group-hover:shadow-xl",
    "group-hover:-translate-y-0.5 group-hover:scale-[1.05] active:translate-y-0 active:scale-100"
  );

  const iconCls = isRetro ? "w-6 h-6 text-black" : "w-6 h-6 text-white drop-shadow";

  // Label
  const retroLabel = "text-[13px] text-black text-center";
  const modernLabel = cn(
    "text-[13px] text-white text-center",
    "transition-colors",
    // pill de label en hover/selección
    "px-1 py-0.5 rounded-md",
    (selected ? "bg-white/15" : "bg-transparent"),
    "group-hover:bg-white/10"
  );

  return (
    <button
      type="button"
      className={wrapperCls}
      onClick={handleClick}
      onDoubleClick={handleDouble}
      onKeyDown={handleKey}
      onBlur={() => setSelected(false)}
      aria-label={label}
      title={label}
      tabIndex={0}
    >
      {/* Icon container */}
      <div
        className={isRetro ? retroIconWrap : modernIconWrap}
        style={
          isRetro
            ? {
                boxShadow:
                  "inset 1px 1px 0 0 #ffffff, inset -1px -1px 0 0 #808080",
              }
            : undefined
        }
      >
        {/* brillo suave arriba en moderno */}
        {!isRetro && (
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        )}
        <Icon className={iconCls} />
      </div>

      {/* Label */}
      <span className={isRetro ? retroLabel : modernLabel}>{label}</span>
    </button>
  );
}
