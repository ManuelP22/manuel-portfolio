import * as React from "react";
import type { App } from "@/lib/app";
import { cn } from "@/lib/utils";

export function AppGlyph({ item, size = 48 }: { item: App; size?: number }) {
  const Icon = item.icon;
  if (item.iconImage) {
    return (
      <span className="grid place-items-center rounded-md overflow-hidden" style={{ width: size, height: size }}>
        <img
          src={item.iconImage}
          alt={item.title}
          width={size}
          height={size}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </span>
    );
  }
  if (Icon) {
    return (
      <span className={cn("grid place-items-center rounded-md bg-gradient-to-br", item.gradient ?? "from-blue-500 to-indigo-700")} style={{ width: size, height: size }}>
        <Icon className="w-6 h-6 text-white" />
      </span>
    );
  }
  return (
    <span className="grid place-items-center rounded-md bg-white/10" style={{ width: size, height: size }}>
      <span className="text-white/90 text-sm font-semibold">{item.title?.charAt(0)?.toUpperCase() ?? "?"}</span>
    </span>
  );
}

export function DesktopIcon({ item, onOpen }: { item: App; onOpen: (i: App) => void }) {
  return (
    <button className="flex flex-col items-center gap-2 px-2 py-2 rounded hover:bg-white/10" onClick={() => onOpen(item)}>
      <AppGlyph item={item} size={48} />
      <span className="text-xs text-white/90">{item.title}</span>
    </button>
  );
}
