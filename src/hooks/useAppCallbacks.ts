import { useCallback, useRef } from "react";
import type { Achievements } from "./useAchievements";

export default function useAppCallbacks(achievements: Achievements) {
  const terminalCommandRef = useRef<((cmd: string, skipEcho?: boolean) => void) | null>(null);

  const openTerminal = useCallback(() => {
    // Set terminal open state in parent
  }, []);

  const handleShowConfetti = useCallback(() => {
    achievements.trackHire();
  }, [achievements]);

  const handleHire = useCallback(
    (showConfetti: () => void) => {
      showConfetti();
      if (terminalCommandRef.current) {
        terminalCommandRef.current("hire", true);
      }
    },
    []
  );

  return {
    terminalCommandRef,
    openTerminal,
    handleShowConfetti,
    handleHire,
  };
}
