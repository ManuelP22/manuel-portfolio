// components/os/mac/dock/MacDock.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { Grid3X3 } from "lucide-react";
import { useOS } from "@/context/OSProvider";
import { menuOptions } from "@/components/os/utils";
import { StartMenu } from "@/components/os/StartMenu"; // <-- asegúrate de este import
import { cn } from "@/lib/utils";
import { DockItem } from "./DockItem";

const ICON_BASE = 57.6;
const HIDDEN_DOCK_THRESHOLD = 30;

type MenuItem = {
  id?: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconImage?: string;
  gradient?: string;
  content?: React.ReactNode;
  bounds?: { x: number; y: number; w: number; h: number };
  dockBreaksBefore?: boolean;
};

export function MacDock() {
  const os = useOS();

  // 👇 estado del launcher
  const [startOpen, setStartOpen] = React.useState(false);

  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [mouseY, setMouseY] = React.useState(0);
  const [bodyHeight, setBodyHeight] = React.useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const [dockMouseX, setDockMouseX] = React.useState<number | null>(null);
  const dockContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--taskbar-h", "0px");
    document.documentElement.style.setProperty("--menubar-h", "28px");
  }, []);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => setMouseY(e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  React.useEffect(() => {
    const onResize = () => setBodyHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const dockApps = React.useMemo(() => {
    return (menuOptions as MenuItem[]).map((o) => ({
      id: (o.id ?? o.title).toLowerCase(),
      title: o.title,
      Icon: o.icon,
      iconImage: o.iconImage,
      gradient: o.gradient ?? "from-slate-400 to-slate-600",
      content: o.content,
      bounds: o.bounds,
      dockBreaksBefore: o.dockBreaksBefore,
    }));
  }, []);

  const anyFullscreen = React.useMemo(
    () => os.windows.some((w) => w.state === "maximized"),
    [os.windows]
  );

  const isDockHidden = React.useMemo(() => {
    if (dockMouseX !== null) return false;
    if (!anyFullscreen) return false;
    return Math.abs(mouseY - bodyHeight) > HIDDEN_DOCK_THRESHOLD;
  }, [dockMouseX, anyFullscreen, mouseY, bodyHeight]);

  React.useEffect(() => {
    const dockHeight = dockContainerRef.current?.clientHeight ?? 0;
    if (Math.abs(mouseY - bodyHeight) > dockHeight) {
      setDockMouseX(null);
    }
  }, [mouseY, bodyHeight]);

  const getWindowFor = (id: string) =>
    os.getWindow?.(id) ?? os.windows.find((w) => w.id === id);

  const isRunning = (id: string) => {
    const w = getWindowFor(id);
    return !!w && w.state !== "minimized";
  };

  const onAppClick = (appId: string) => {
    const w = getWindowFor(appId);
    if (w) {
      if (w.state === "minimized") os.restore(appId);
      os.focus(appId);
      return;
    }
    const def = dockApps.find((a) => a.id === appId);
    if (!def) return;

    const iconNode = def.Icon ? <def.Icon className="w-4 h-4" /> : undefined;

    os.toggle({
      id: def.id,
      title: def.title,
      content: def.content ?? null,
      bounds: def.bounds,
      icon: iconNode,
    });
  };

  return (
    <>
      <section
        ref={dockContainerRef}
        className={cn(
          "fixed left-0 bottom-0 w-full h-[5.2rem] p-1.5 pb-3",
          "flex justify-center items-end",
          !isDockHidden && "pointer-events-none"
        )}
        style={{ zIndex: 80 }}
      >
        <motion.div
          className={cn(
            "relative px-1.5 py-1.5 h-full rounded-[1.2rem]",
            "flex items-end gap-1.5",
            "bg-white/10 dark:bg-gray-800/40",
            "shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.2),0_0_0_0.5px_rgba(0,0,0,0.5),2px_5px_19px_7px_rgba(0,0,0,0.25)]",
            "before:content-[''] before:absolute before:inset-0 before:rounded-[1.2rem]",
            "before:backdrop-blur-xl before:-z-10",
            !isDockHidden ? "pointer-events-auto" : "pointer-events-none"
          )}
          initial={false}
          animate={{ y: isDockHidden ? "200%" : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.5 }}
          onMouseMove={(e) => setDockMouseX(e.clientX)}
          onMouseLeave={() => {
            setDockMouseX(null);
            setHoveredId(null);
          }}
        >
          {/* Launcher: ahora sí abre el menú */}
          <DockItem
            id="::launcher"
            label="Launcher"
            icon={<Grid3X3 className="w-5 h-5 text-white" />}
            gradient="from-blue-500/35 to-indigo-500/35"
            running={false}
            onClick={() => setStartOpen(true)}   // <-- aquí abrimos
            mouseX={dockMouseX}
            baseWidth={ICON_BASE}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            showTooltip
          />

          {dockApps.map((app) => {
            const iconNode = app.iconImage ? (
              <img src={app.iconImage} alt={app.title} />
            ) : app.Icon ? (
              <app.Icon className="w-5 h-5 text-white" />
            ) : (
              <span className="text-white/90 text-sm font-semibold">
                {app.title.charAt(0).toUpperCase()}
              </span>
            );

            return (
              <React.Fragment key={app.id}>
                {app.dockBreaksBefore && (
                  <div
                    className="h-full w-[1px] bg-white/20 dark:bg-gray-600/30 mx-1"
                    aria-hidden="true"
                  />
                )}
                <DockItem
                  id={app.id}
                  label={app.title}
                  icon={iconNode}
                  gradient={app.gradient}
                  running={isRunning(app.id)}
                  onClick={() => onAppClick(app.id)}
                  mouseX={dockMouseX}
                  baseWidth={ICON_BASE}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  showTooltip
                />
              </React.Fragment>
            );
          })}
        </motion.div>
      </section>

      {/* Montamos el StartMenu que resuelve a MacLauncher */}
      <StartMenu
        open={startOpen}
        onClose={() => setStartOpen(false)}
        centered
        width={760}
        height={560}
        items={menuOptions}
      />
    </>
  );
}
