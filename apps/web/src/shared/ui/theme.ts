export type Theme = "light" | "dark";

// Keep returning visitors on the same palette, even if an older version saved
// a dark/system preference or the device switches its appearance.
export function initializeTheme() {
  document.documentElement.dataset.theme = "light";
  document.documentElement.style.colorScheme = "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#142b52");
}

export const useTheme = (): Theme => "light";
