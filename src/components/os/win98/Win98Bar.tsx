import React, { useEffect, useMemo, useState } from "react";
import { useOS } from "@/context/OSProvider";
import { cn } from "@/lib/utils";
import { StartMenu } from "@/components/os/StartMenu";
import { menuOptions } from "@/components/os/utils";
import { Clock } from "@/components/os/Clock";

const TASKBAR_HEIGHT_RETRO = 40;

export function Win98Bar() {
  const os = useOS();
  const [startOpen, setStartOpen] = useState(false);

  // Variables CSS de safe-areas para el modo retro
  useEffect(() => {
    document.documentElement.style.setProperty("--taskbar-h", `${TASKBAR_HEIGHT_RETRO}px`);
    document.documentElement.style.setProperty("--menubar-h", `0px`);
  }, []);

  const anyWindow = useMemo(() => os.windows.length > 0, [os.windows]);

  return (
    <>
      <div
        role="menubar"
        aria-label="Taskbar"
        className={cn(
          "fixed bottom-0 left-0 right-0 h-10 z-[9999] flex items-center gap-2 px-2",
          "bg-[#c0c0c0] border-t-2 border-white",
          "shadow-[inset_0_2px_0_#fff,inset_0_-2px_0_#808080]"
        )}
      >
        <button
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 font-bold text-black",
            "bg-[#c0c0c0]",
            "border-[2px] border-t-white border-l-white border-b-[#808080] border-r-[#808080]",
            "active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
          )}
          onClick={() => setStartOpen((s) => !s)}
          aria-expanded={startOpen}
          aria-controls="start-menu"
          title="Start"
        >
          <span
            className="w-5 h-5 grid place-items-center bg-red-600 text-white text-[11px] font-bold"
            style={{ boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080" }}
          >
            ⊞
          </span>
          Start
        </button>

        <div className="flex-1 flex items-center gap-1 px-2 overflow-x-auto">
          {anyWindow &&
            os.windows.map((w) => (
              <button
                key={w.id}
                className={cn(
                  "inline-flex items-center gap-2 px-2 py-1 text-sm text-black",
                  "bg-[#c0c0c0]",
                  "border-[2px] border-t-white border-l-white border-b-[#808080] border-r-[#808080]",
                  "hover:bg-[#d7d7d7]",
                  w.isFocused &&
                    w.state !== "minimized" &&
                    "bg-[#e3e3e3] border-t-[#808080] border-l-[#808080] border-b-white border-r-white"
                )}
                onClick={() => {
                  const win = os.getWindow?.(w.id) ?? w;
                  if (!win) return;
                  os.toggle({
                    id: win.id,
                    title: win.title,
                    content: win.content,
                    bounds: win.bounds,
                    icon: win.icon,
                  });
                }}
                aria-pressed={w.isFocused && w.state !== "minimized"}
                title={w.title}
              >
                <span
                  className="w-4 h-4 grid place-items-center bg-gray-200 border border-gray-400 mr-1"
                  style={{ boxShadow: "inset 1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 #808080" }}
                >
                  <span className="w-3 h-3 grid place-items-center text-black">
                    {w.icon ?? w.title?.charAt(0).toUpperCase()}
                  </span>
                </span>
                <span className="truncate max-w-[200px]">{w.title}</span>
              </button>
            ))}
        </div>

        <div className="px-2">
          <Clock isRetro showLanguageToggle={false} />
        </div>
      </div>

      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} items={menuOptions} />
    </>
  );
}
