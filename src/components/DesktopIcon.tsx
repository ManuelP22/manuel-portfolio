import { useRef, useState } from "react";
import type { ComponentType } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

type Tone = "purple" | "green" | "orange" | "pink" | "blue" | "cyan";

export function DesktopIcon({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: Icon,
  label,
  onOpen,
  tone = "blue",
  gradientClass, // opcional: puedes pasar "grad-purple" directamente
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

  // ====== selección y doble-click ======
  const [selected, setSelected] = useState(false);
  const clickTimer = useRef<number | null>(null);
  const lastClick = useRef<number>(0);

  // Mapa a tus clases grad-* (ya definidas en tu CSS)
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
    // Doble click “manual” para asegurar consistencia
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

  // ====== clases visuales ======
  const wrapperBase = "desktop-icon";
  const selectedRingModern =
    "ring-1 ring-white/60 ring-offset ring-offset-black/20";
  const selectedOutlineRetro = "outline outline-1 outline-black/40";

  const wrapperCls = [
    wrapperBase,
    selected ? (isRetro ? selectedOutlineRetro : selectedRingModern) : "",
  ].join(" ");

  // Contenedor del icono (pill moderna vs bevel retro)
  const iconWrap = isRetro
    ? [
        "grid place-items-center w-14 h-14 mb-1",
        "bg-[#cfcfcf]",
        "border-2",
        "border-t-white border-l-white border-b-[#808080] border-r-[#808080]",
      ].join(" ")
    : [
        "pill grid place-items-center w-16 h-16 mb-1",
        grad, // p.ej. "grad-purple"
        // si quieres el efecto “lift” del CSS: .desktop-icon:hover .pill { transform... }
      ].join(" ");

  const iconCls = isRetro ? "w-6 h-6 text-black" : "w-6 h-6 text-white";
  const labelCls = isRetro
    ? "text-[13px] text-black text-center"
    : "text-[13px] text-white text-center drop-shadow";

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
    >
      <div className={cn(iconWrap, !isRetro ? "rounded-xl" : "")}>
        <Icon className={iconCls} />
      </div>
      <span className={labelCls}>{label}</span>
    </button>
  );
}
