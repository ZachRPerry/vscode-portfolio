import { useCallback, useEffect, useState } from "react";
import { ACHIEVEMENTS, AchievementId, Achievement } from "../constants/achievements";

type AchievementProgress = {
  unlocked: Set<AchievementId>;
  progress: Record<string, number>;
  openedFiles: Set<string>;
  usedCommands: Set<string>;
  themeSwitches: number;
  commandCount: number;
};

const STORAGE_KEY = "achievements";

export default function useAchievements(onUnlock?: (achievementId: AchievementId) => void) {
  const [progress, setProgress] = useState<AchievementProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        unlocked: new Set(parsed.unlocked || []),
        progress: parsed.progress || {},
        openedFiles: new Set(parsed.openedFiles || []),
        usedCommands: new Set(parsed.usedCommands || []),
        themeSwitches: parsed.themeSwitches || 0,
        commandCount: parsed.commandCount || 0,
      };
    }
    return {
      unlocked: new Set<AchievementId>(),
      progress: {},
      openedFiles: new Set<string>(),
      usedCommands: new Set<string>(),
      themeSwitches: 0,
      commandCount: 0,
    };
  });

  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        unlocked: Array.from(progress.unlocked),
        progress: progress.progress,
        openedFiles: Array.from(progress.openedFiles),
        usedCommands: Array.from(progress.usedCommands),
        themeSwitches: progress.themeSwitches,
        commandCount: progress.commandCount,
      })
    );
  }, [progress]);

  const unlock = useCallback((achievementId: AchievementId) => {
    setProgress((prev) => {
      if (prev.unlocked.has(achievementId)) return prev;
      const newUnlocked = new Set(prev.unlocked);
      newUnlocked.add(achievementId);
      setRecentUnlock(ACHIEVEMENTS[achievementId]);
      // Call onUnlock callback for confetti or other effects
      if (onUnlock) {
        onUnlock(achievementId);
      }
      return { ...prev, unlocked: newUnlocked };
    });
  }, [onUnlock]);

  const trackFileOpen = useCallback(
    (filename: string) => {
      setProgress((prev) => {
        const newFiles = new Set(prev.openedFiles);
        newFiles.add(filename);
        const newProgress = { ...prev, openedFiles: newFiles };

        // Check file explorer achievement
        if (newFiles.size >= ACHIEVEMENTS["file-explorer"].requirement) {
          unlock("file-explorer");
        }

        return newProgress;
      });
    },
    [unlock]
  );

  const trackTerminalCommand = useCallback(
    (command: string) => {
      setProgress((prev) => {
        const newCount = prev.commandCount + 1;
        const newProgress = {
          ...prev,
          commandCount: newCount,
        };

        // Check terminal warrior achievement
        if (newCount >= ACHIEVEMENTS["terminal-warrior"].requirement) {
          unlock("terminal-warrior");
        }

        return newProgress;
      });
    },
    [unlock]
  );

  const trackPaletteCommand = useCallback(
    (commandId: string) => {
      setProgress((prev) => {
        const newCommands = new Set(prev.usedCommands);
        newCommands.add(commandId.trim().toLowerCase());
        const newProgress = {
          ...prev,
          usedCommands: newCommands,
        };

        // Check command master achievement
        if (newCommands.size >= ACHIEVEMENTS["command-master"].requirement) {
          unlock("command-master");
        }

        return newProgress;
      });
    },
    [unlock]
  );

  const trackThemeSwitch = useCallback(() => {
    setProgress((prev) => {
      const newCount = prev.themeSwitches + 1;
      const newProgress = { ...prev, themeSwitches: newCount };

      // Check theme switcher achievement
      if (newCount >= ACHIEVEMENTS["theme-switcher"].requirement) {
        unlock("theme-switcher");
      }

      return newProgress;
    });
  }, [unlock]);

  const trackHire = useCallback(() => {
    unlock("hired");
  }, [unlock]);

  const trackKonamiCode = useCallback(() => {
    unlock("konami-code");
  }, [unlock]);

  const clearRecentUnlock = useCallback(() => {
    setRecentUnlock(null);
  }, []);

  const clearAllAchievements = useCallback(() => {
    setProgress({
      unlocked: new Set<AchievementId>(),
      progress: {},
      openedFiles: new Set<string>(),
      usedCommands: new Set<string>(),
      themeSwitches: 0,
      commandCount: 0,
    });
  }, []);

  const unlockAllAchievements = useCallback(() => {
    const allIds = Object.keys(ACHIEVEMENTS) as AchievementId[];
    setProgress((prev) => ({
      ...prev,
      unlocked: new Set(allIds),
    }));
  }, []);

  return {
    progress,
    recentUnlock,
    clearRecentUnlock,
    trackFileOpen,
    trackTerminalCommand,
    trackPaletteCommand,
    trackThemeSwitch,
    trackHire,
    trackKonamiCode,
    clearAllAchievements,
    unlockAllAchievements,
  };
}

export type Achievements = ReturnType<typeof useAchievements>;
