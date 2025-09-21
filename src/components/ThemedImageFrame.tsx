import { memo } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useTheme } from "@/providers/ThemeProvider";

type ThemedImageFrameProps = {
  src: string;
  alt: string;
  topTag?: string;
  bottomTag?: string;
  imageHeightClass?: string; // p.ej. "h-96"
  retroTitle?: string;       // título de ventana en modo retro
};

function RetroCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-gray-200 font-sans text-sm"
      style={{
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "#ffffff #808080 #808080 #ffffff",
        boxShadow: "inset 0 0 0 1px #c0c0c0",
      }}
    >
      {children}
    </div>
  );
}

export const ThemedImageFrame = memo(function ThemedImageFrame({
  src,
  alt,
  topTag = "BACKEND",
  bottomTag = "FRONTEND",
  imageHeightClass = "h-96",
  retroTitle,
}: ThemedImageFrameProps) {
  const { theme } = useTheme();
  const isModern = theme === "modern";
  const title = retroTitle ?? alt;

  if (isModern) {
    // ======================= MODERN =======================
    return (
      <div className="relative">
        {/* Glow detrás */}
        <div className="absolute inset-0 scale-110 rounded-2xl blur-3xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20" />

        {/* Marco */}
        <div className="relative rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-4 backdrop-blur-sm">
          {/* Semáforo */}
          <div className="absolute left-4 top-4 flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>

          {/* Imagen */}
          <div className={`mt-8 overflow-hidden rounded-xl bg-slate-800 ${imageHeightClass} w-full`}>
            <ImageWithFallback src={src} alt={alt} className="h-full w-full object-cover" />
          </div>

          {/* HUD inferior */}
          <div className="mt-4 flex items-center justify-between font-mono text-xs text-slate-400">
            <span>DEVELOPER.exe</span>
            <span>STATUS: ACTIVE</span>
          </div>
        </div>

        {/* Tarjetas flotantes */}
        <div className="absolute -right-4 -top-4 rounded-lg border border-violet-400/30 bg-slate-900/90 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
            <span className="font-mono text-xs text-violet-400">{topTag}</span>
          </div>
        </div>
        <div className="absolute -bottom-4 -left-4 rounded-lg border border-cyan-400/30 bg-slate-900/90 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="font-mono text-xs text-cyan-400">{bottomTag}</span>
          </div>
        </div>
      </div>
    );
  }

  // ======================= RETRO (Win98) =======================
  return (
    <div className="relative">
      <RetroCard>
        {/* Barra de título */}
        <div
          className="flex items-center justify-between px-2 py-1 font-bold text-xs text-white"
          style={{ background: "linear-gradient(90deg,#2459C8,#2B7BDB)" }}
        >
          <span className="truncate">{title}</span>
          <div className="flex gap-1">
            <button className="w-5 h-5 bg-gray-200 border border-gray-600 text-black text-xs leading-none grid place-items-center">_</button>
            <button className="w-5 h-5 bg-gray-200 border border-gray-600 text-black text-xs leading-none grid place-items-center">□</button>
            <button className="w-5 h-5 bg-gray-200 border border-gray-600 text-black text-xs leading-none grid place-items-center">×</button>
          </div>
        </div>

        {/* Imagen (bisel) */}
        <div
          className={`m-4 bg-gray-300 overflow-hidden w-auto ${imageHeightClass}`}
          style={{
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
          }}
        >
          <ImageWithFallback src={src} alt={alt} className="h-full w-full object-cover" />
        </div>

        {/* HUD inferior */}
        <div className="mx-4 mb-3 mt-2 flex items-center justify-between text-xs text-black">
          <span>DEVELOPER.exe</span>
          <span>STATUS: ACTIVE</span>
        </div>
      </RetroCard>

      {/* Tarjetas flotantes retro */}
      <div
        className="absolute -right-4 -top-4 px-3 py-2 font-sans text-xs text-black bg-gray-200"
        style={{ border: "2px solid", borderColor: "#ffffff #808080 #808080 #ffffff" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-purple-700" />
          <span>{topTag}</span>
        </div>
      </div>
      <div
        className="absolute -bottom-4 -left-4 px-3 py-2 font-sans text-xs text-black bg-gray-200"
        style={{ border: "2px solid", borderColor: "#ffffff #808080 #808080 #ffffff" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-cyan-700" />
          <span>{bottomTag}</span>
        </div>
      </div>
    </div>
  );
});
