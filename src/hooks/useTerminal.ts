import { useCallback, useEffect, useRef, useState } from "react";
import type { TerminalLine } from "../types";
import { SUCCESS_MSG, WARNING_MSG, WHY_MSG, HIRE_SUCCESS_MSG, HIRE_CONTACT_MSG } from "../constants/terminal";

export default function useTerminal(
  theme?: string,
  onHire?: () => void,
  onCommand?: (cmd: string) => void,
  onClearAchievements?: () => void,
  onUnlockAll?: () => void
) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Last login: just now" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const prevThemeRef = useRef<string | undefined>(theme);

  // Initial light warning (guarded)
  useEffect(() => {
    if (theme === "light") {
      setLines((prev) => {
        if (prev.some((l) => l.type === "output" && l.content === WARNING_MSG)) {
          return prev;
        }
        return [...prev, { type: "output", content: WARNING_MSG }];
      });
    }
  }, [theme]);

  // Transition messages (guarded)
  useEffect(() => {
    const prev = prevThemeRef.current;
    if (prev && prev !== theme) {
      if (prev === "dark" && theme === "light") {
        setLines((prevLines) => {
          const hasWarning = prevLines.some(
            (l) => l.type === "output" && l.content === WARNING_MSG
          );
          return hasWarning
            ? [...prevLines, { type: "output", content: WHY_MSG }]
            : [
                ...prevLines,
                { type: "output", content: WHY_MSG },
                { type: "output", content: WARNING_MSG },
              ];
        });
      }
      if (prev === "light" && theme === "dark") {
        setLines((prevLines) => {
          if (
            prevLines.some(
              (l) => l.type === "output" && l.content === SUCCESS_MSG
            )
          ) {
            return prevLines;
          }
          return [...prevLines, { type: "output", content: SUCCESS_MSG }];
        });
      }
    }
    prevThemeRef.current = theme;
  }, [theme]);

  const handleCommand = useCallback((cmd: string, skipEcho = false) => {
    const trimmed = cmd.trim().toLowerCase();
    setLines((prev) => {
      const next: TerminalLine[] = skipEcho ? [...prev] : [...prev, { type: "command", content: cmd }];
      if (trimmed === "clear" || trimmed === "cls") {
        return [{ type: "output", content: "Last login: just now" }];
      }
      if (trimmed === "help") {
        return [
          ...next,
          {
            type: "output",
            content: "Available commands: npm, npm run dev, npm run build, hire, help, clear",
          },
        ];
      }
      if (trimmed === "npm") {
        return [
          ...next,
          { type: "output", content: "added 123 packages, and audited 123 packages in 2s" },
        ];
      }
      if (trimmed === "npm run dev") {
        return [
          ...next,
          { type: "output", content: "VITE v5.0.0 ready in 245 ms" },
          { type: "output", content: "  ➜  Local:   http://localhost:5173/" },
        ];
      }
      if (trimmed === "npm run build") {
        return [
          ...next,
          { type: "output", content: "vite v5.0.0 building for production..." },
          { type: "output", content: "✓ 1234 modules transformed." },
        ];
      }
      if (trimmed === "hire") {
        // Trigger callback to show confetti
        if (onHire) {
          setTimeout(() => onHire(), 0);
        }
        return [
          ...next,
          { type: "output", content: HIRE_SUCCESS_MSG },
          { type: "output", content: HIRE_CONTACT_MSG },
        ];
      }
      if (trimmed === "clearachievements") {
        if (onClearAchievements) {
          onClearAchievements();
        }
        return [
          ...next,
          { type: "output", content: "All achievements cleared." },
        ];
      }
      if (trimmed === "allachievements") {
        if (onUnlockAll) {
          onUnlockAll();
        }
        return [
          ...next,
          { type: "output", content: "All achievements unlocked!" },
        ];
      }
      if (trimmed === "") {
        return next;
      }
      return [
        ...next,
        {
          type: "output",
          content: `Command not found: ${cmd}. Type 'help' for available commands.`,
        },
      ];
    });
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput("");
    if (onCommand && cmd.trim()) {
      onCommand(cmd.trim());
    }
  }, [onHire, onCommand, onClearAchievements, onUnlockAll]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((idx) => {
        const nextIdx = Math.min(idx + 1, history.length - 1);
        if (nextIdx >= 0) {
          setInput(history[history.length - 1 - nextIdx]);
        }
        return nextIdx;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((idx) => {
        const nextIdx = idx - 1;
        if (nextIdx >= 0) {
          setInput(history[history.length - 1 - nextIdx]);
          return nextIdx;
        }
        setInput("");
        return -1;
      });
    }
  };

  return {
    lines,
    input,
    setInput,
    handleKeyDown,
    handleCommand,
  } as const;
}
