import { useEffect } from "react";
import type { Achievements } from "./useAchievements";

export default function useAppEffects(
  achievements: Achievements,
  theme: string,
  showThemeTip: boolean,
  setShowThemeTip: (show: boolean) => void,
  setPaletteOpen: (open: boolean) => void
) {
  // Konami code detection (↑ ↑ ↓ ↓ ← → ← → B A)
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let konamiIndex = 0;

    const onKey = (e: KeyboardEvent) => {
      const key =
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
          ? e.key
          : e.key.toLowerCase();

      if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          achievements.trackKonamiCode();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [achievements]);

  // Global hotkeys for command palette (Ctrl+Shift+P or F1)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey && e.shiftKey && key === "p") || key === "f1") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);

  // On every page load, show the tip if starting in light mode
  useEffect(() => {
    if (theme === "light") {
      setShowThemeTip(true);
    }
  }, [theme, setShowThemeTip]);
}
