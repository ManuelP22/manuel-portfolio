import { useOS } from "@/context/OSProvider";
import { Window } from "./Window";

const DEFAULT_BOUNDS = { x: 80, y: 80, w: 560, h: 380 };

export function WindowsLayer() {
  const os = useOS();

  return (
    <div className="" aria-live="polite">
      {os.windows
        .filter((w) => w.state !== "minimized")
        .map((w, i) => {
          const b = w.bounds ?? {
            x: DEFAULT_BOUNDS.x + i * 24,
            y: DEFAULT_BOUNDS.y + i * 24,
            w: DEFAULT_BOUNDS.w,
            h: DEFAULT_BOUNDS.h,
          };
          return <Window key={w.id} win={w} initialBounds={b} />;
        })}
    </div>
  );
}
