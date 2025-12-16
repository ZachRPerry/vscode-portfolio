import { useState, useCallback } from "react";
import { ThemeKey, themes } from "../theme";

const getInitialTheme = (): ThemeKey => {
  const saved = localStorage.getItem("theme") as ThemeKey | null;
  if (saved && (saved === "dark" || saved === "light")) {
    return saved;
  }
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
};

export default function useTheme() {
  const [theme, setThemeState] = useState<ThemeKey>(getInitialTheme());
  const t = themes[theme];

  const setTheme = useCallback(
    (newTheme: ThemeKey, showThemeTip: boolean, setShowThemeTip: (show: boolean) => void, onTrack?: () => void) => {
      setThemeState(newTheme);
      localStorage.setItem("theme", newTheme);
      onTrack?.();
      if (showThemeTip) {
        setShowThemeTip(false);
      }
    },
    []
  );

  return { theme, t, setTheme };
}
