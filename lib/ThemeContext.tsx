"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const sys = (): Theme => (mq.matches ? "light" : "dark");

    // On mount: use system preference (ignore any stale localStorage value)
    const initial = sys();
    setTheme(initial);
    applyTheme(initial);
    // Clear any old saved override so system preference stays in control
    localStorage.removeItem("amva_theme");

    // Keep in sync when system preference changes
    const onChange = () => {
      const next = sys();
      setTheme(next);
      applyTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
