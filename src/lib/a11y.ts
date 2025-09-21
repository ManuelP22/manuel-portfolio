/** Focus trap simple para diálogos.
 *  Llama a esta función dentro de onKeyDown del contenedor del modal/launcher.
 */
export function trapTabKey(
  e: React.KeyboardEvent,
  root: HTMLElement | null
): void {
  if (e.key !== "Tab" || !root) return;

  const focusables = root.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"));
  if (list.length === 0) return;

  const first = list[0];
  const last = list[list.length - 1];
  const current = document.activeElement as HTMLElement | null;

  if (!e.shiftKey) {
    // Tab hacia delante: si estás en el último, vuelve al primero
    if (current === last) {
      e.preventDefault();
      first.focus();
    }
  } else {
    // Shift+Tab hacia atrás: si estás en el primero, ve al último
    if (current === first) {
      e.preventDefault();
      last.focus();
    }
  }
}
