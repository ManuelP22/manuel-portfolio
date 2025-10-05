import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Globe, Clock as ClockIcon } from "lucide-react";

/** Props del Clock */
export interface ClockProps {
  /** Estilo retro (Win98). Si false, estilo macOS. */
  isRetro?: boolean;
  /** Mostrar botón para alternar idioma (ES/EN) */
  showLanguageToggle?: boolean;
}

/* ================== Utils ================== */
function useOnClickOutside(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb, ref]);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
}

/* ================== i18n mínima embebida ================== */
const I18N = {
  es: {
    today: "Hoy",
    months: [
      "enero","febrero","marzo","abril","mayo","junio",
      "julio","agosto","septiembre","octubre","noviembre","diciembre",
    ],
    daysShort: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
  },
  en: {
    today: "Today",
    months: [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ],
    daysShort: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  },
} as const;

/* ================== Componente ================== */
export function Clock({ isRetro = false, showLanguageToggle = false }: ClockProps) {
  const [lang, setLang] = useState<"es" | "en">("es");
  const locale = lang === "es" ? "es-ES" : "en-US";

  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [blinkColon, setBlinkColon] = useState(true);

  // Refs (montados siempre para evitar hooks condicionales)
  const retroPopoverRef = useRef<HTMLDivElement | null>(null);
  const modernPopoverRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(retroPopoverRef, () => setShowCalendar(false));
  useOnClickOutside(modernPopoverRef, () => setShowCalendar(false));

  // Actualizar reloj cada segundo
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Parpadeo ":" en retro
  useEffect(() => {
    if (!isRetro) return;
    const id = setInterval(() => setBlinkColon((s) => !s), 500);
    return () => clearInterval(id);
  }, [isRetro]);

  const formatTime = (date: Date) => {
    if (isRetro) {
      const timeStr = date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      return blinkColon ? timeStr : timeStr.replace(/:/g, " ");
    }
    // macOS style
    return date.toLocaleString(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });

  const monthName = (m: number) => I18N[lang].months[m];
  const dayShorts = I18N[lang].daysShort;

  const navigateMonth = (dir: "prev" | "next") => {
    const d = new Date(calendarDate);
    d.setMonth(d.getMonth() + (dir === "prev" ? -1 : 1));
    setCalendarDate(d);
  };

  const y = calendarDate.getFullYear();
  const m = calendarDate.getMonth();
  const today = new Date();

  /* ======== Vista Retro (Win98) ======== */
  if (isRetro) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          {showLanguageToggle && (
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="w-7 h-7 bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center transition-all hover:border-gray-500"
              style={{
                boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080",
                background: "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)",
              }}
              title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
            >
              <Globe className="w-3 h-3 text-black drop-shadow-sm" />
            </button>
          )}

          {/* Reloj retro */}
          <button
            onClick={() => setShowCalendar((s) => !s)}
            className="relative bg-black border-2 border-gray-400 px-3 py-2 hover:border-gray-500 transition-all"
            style={{
              boxShadow: "inset -2px -2px 4px 0 #606060, inset 2px 2px 4px 0 #ffffff",
              background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
            }}
            aria-haspopup="dialog"
            aria-expanded={showCalendar}
          >
            <div className="absolute inset-0 bg-green-900/20 rounded-sm" />
            <div className="relative z-10 flex flex-col items-center">
              <span
                className="font-mono text-green-400 drop-shadow-lg tracking-wider"
                style={{
                  fontSize: "11px",
                  textShadow: "0 0 8px #00ff00, 0 0 12px #00ff00",
                  fontFamily: "Courier New, monospace",
                }}
              >
                {formatTime(currentTime)}
              </span>
              <span
                className="font-mono text-green-300 text-[9px] mt-0.5 tracking-wide"
                style={{ textShadow: "0 0 4px #00aa00", fontFamily: "Courier New, monospace" }}
              >
                {formatDate(currentTime)}
              </span>
            </div>

            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-400" />
            <div className="absolute top-0 right-0 w-1 h-1 bg-red-400" />
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-blue-400" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-green-400" />
          </button>
        </div>

        {showCalendar && (
          <div
            ref={retroPopoverRef}
            className="absolute bottom-full right-0 mb-2 bg-gray-200 border-2 border-gray-400 p-4 z-50 min-w-[300px] max-w-[92vw]"
            style={{
              boxShadow:
                "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080, 4px 4px 8px rgba(0,0,0,0.3)",
              background: "linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)",
            }}
            role="dialog"
            aria-label="Calendar"
          >
            {/* Title bar */}
            <div className="bg-blue-700 text-white px-2 py-1 -mx-4 -mt-4 mb-3 flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span className="font-bold text-sm">Calendario</span>
              <div className="ml-auto flex gap-1">
                <div className="w-3 h-3 bg-gray-400 border border-gray-600" />
                <div className="w-3 h-3 bg-yellow-400 border border-gray-600" />
                <div className="w-3 h-3 bg-red-400 border border-gray-600" />
              </div>
            </div>

            {/* Header navegación */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigateMonth("prev")}
                className="w-7 h-7 bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center transition-all"
                style={{ boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080" }}
              >
                <ChevronLeft className="w-3 h-3 text-black" />
              </button>

              <div
                className="bg-white border border-gray-400 px-3 py-1 font-bold text-black text-sm"
                style={{ boxShadow: "inset -1px -1px 0 0 #dfdfdf, inset 1px 1px 0 0 #808080" }}
              >
                {monthName(m)} {y}
              </div>

              <button
                onClick={() => navigateMonth("next")}
                className="w-7 h-7 bg-gray-200 border border-gray-400 hover:bg-gray-100 flex items-center justify-center transition-all"
                style={{ boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080" }}
              >
                <ChevronRight className="w-3 h-3 text-black" />
              </button>
            </div>

            {/* Cabeceras de días */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayShorts.map((day) => (
                <div
                  key={day}
                  className="w-8 h-6 flex items-center justify-center text-xs font-bold text-black bg-gray-300 border border-gray-400"
                  style={{ boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grilla de días (retro: sin rounded) */}
            <div className="grid grid-cols-7 gap-1">
              {/* celdas vacías iniciales */}
              {Array.from({ length: firstDayOfMonth(y, m) }).map((_, i) => (
                <div key={`empty-${i}`} className="w-8 h-8" />
              ))}
              {/* días del mes */}
              {Array.from({ length: daysInMonth(y, m) }).map((_, i) => {
                const d = i + 1;
                const isToday =
                  today.getDate() === d &&
                  today.getMonth() === m &&
                  today.getFullYear() === y;
                return (
                  <div
                    key={d}
                    className={[
                      "w-8 h-8 flex items-center justify-center text-xs cursor-pointer transition-all",
                      isToday
                        ? "bg-blue-600 text-white border border-blue-800"
                        : "hover:bg-white text-black hover:border hover:border-gray-400 bg-gray-100 border border-transparent",
                    ].join(" ")}
                    style={{
                      boxShadow: isToday
                        ? "inset -1px -1px 0 0 #4040ff, inset 1px 1px 0 0 #8080ff"
                        : "inset 1px 1px 0 0 #ffffff, inset -1px -1px 0 0 #808080",
                    }}
                  >
                    {d}
                  </div>
                );
              })}
            </div>

            {/* Barra de estado */}
            <div
              className="mt-3 pt-2 border-t border-gray-400 text-xs text-black bg-gray-300 -mx-4 px-4 py-1"
              style={{ boxShadow: "inset 0 1px 0 0 #dfdfdf" }}
            >
              {I18N[lang].today}:{" "}
              {currentTime.toLocaleDateString(locale, {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ======== Vista Moderna (macOS) ======== */
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {showLanguageToggle && (
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="hover:bg-white/10 px-1.5 py-1 rounded-md transition-all duration-200 text-white/90 hover:text-white"
            title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            <Globe className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setShowCalendar((s) => !s)}
          className="hover:bg-white/10 px-2 py-1 rounded-md transition-all duration-200 text-white/90 hover:text-white"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
          aria-haspopup="dialog"
          aria-expanded={showCalendar}
        >
          <span className="text-sm font-medium tracking-tight">
            {formatTime(currentTime)}
          </span>
        </button>
      </div>

      {showCalendar && (
        <div
          ref={modernPopoverRef}
          className="absolute top-full right-0 mt-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-0 z-50 overflow-hidden shadow-2xl w-[320px] max-w-[92vw]"
          style={{
            backdropFilter: "blur(40px) saturate(180%)",
            background: "rgba(28, 28, 30, 0.85)",
          }}
          role="dialog"
          aria-label="Calendar"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <button
                className="w-7 h-7 hover:bg-white/10 rounded-full flex items-center justify-center transition-all duration-200"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </button>

              <div
                className="text-white font-medium text-base capitalize"
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                {monthName(m)} {y}
              </div>

              <button
                className="w-7 h-7 hover:bg-white/10 rounded-full flex items-center justify-center transition-all duration-200"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-3">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {dayShorts.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-xs text-white/50 font-medium select-none"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid days (moderno: SIEMPRE rounded-full para evitar “cuadrado”) */}
            <div className="grid grid-cols-7 gap-0">
              {/* vacíos iniciales */}
              {Array.from({ length: firstDayOfMonth(y, m) }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9" />
              ))}
              {/* días */}
              {Array.from({ length: daysInMonth(y, m) }).map((_, i) => {
                const d = i + 1;
                const isToday =
                  today.getDate() === d &&
                  today.getMonth() === m &&
                  today.getFullYear() === y;
                return (
                  <div
                    key={d}
                    className={[
                      "w-9 h-9 flex items-center justify-center text-sm cursor-default select-none transition",
                      "rounded-full", // <- siempre redondo
                      isToday
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/90 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5 bg-white/5">
            <div
              className="text-sm text-white/70 text-center"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              }}
            >
              {I18N[lang].today}:{" "}
              {currentTime.toLocaleDateString(locale, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
