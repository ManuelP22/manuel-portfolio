import * as React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import type { OsWindow } from "@/lib/types";
import type { Bounds } from "@/lib/windows-utils";
import { MacWindow } from "./mac/MacWindow";
import { Win98Window } from "./win98/Win98Window";

export function Window({
  win,
  initialBounds,
}: {
  win: OsWindow;
  initialBounds: Bounds;
}) {
  const { isRetro } = useTheme();
  return isRetro ? (
    <Win98Window win={win} initialBounds={initialBounds} />
  ) : (
    <MacWindow win={win} initialBounds={initialBounds} />
  );
}
