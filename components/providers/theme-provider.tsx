"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { THEME_STORAGE_KEY } from "@/lib/constants";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Inlined in <head> so the correct theme is applied before first paint.
 * Without it the page flashes light before hydration.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored ? JSON.parse(stored) : 'system';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`;

/**
 * Theme state is read from two external stores — `localStorage` for the
 * preference and `matchMedia` for the OS setting — so nothing needs to be
 * copied into state after mount. The only effect writes to the DOM, which is
 * exactly what effects are for.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setStoredTheme] = useLocalStorage<Theme>(
    THEME_STORAGE_KEY,
    "system",
  );
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (next: Theme) => setStoredTheme(next),
    [setStoredTheme],
  );

  const toggleTheme = useCallback(
    () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    [resolvedTheme, setTheme],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return context;
}
