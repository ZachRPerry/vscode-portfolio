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
    if (!cmd) return; // Guard against null/undefined
    const trimmed = cmd.trim().toLowerCase();
    setLines((prev) => {
      // Add command and blank line
      const next: TerminalLine[] = skipEcho
        ? [...prev, { type: "output", content: "" }]
        : [...prev, { type: "command", content: cmd }, { type: "output", content: "" }];

      if (trimmed === "clear" || trimmed === "cls") {
        return [{ type: "output", content: "Last login: just now" }];
      }

      // For all other commands, schedule output after 1 second
      setTimeout(() => {
        setLines((prevLines) => {
          let outputLines: TerminalLine[] = [];

          if (trimmed === "help") {
            outputLines = [
              {
                type: "output",
                content: "Available commands: npm, npm run dev, npm run build, hire, help, clear",
              },
            ];
          } else if (trimmed === "npm") {
            outputLines = [
              { type: "output", content: "added 123 packages, and audited 123 packages in 2s" },
            ];
          } else if (trimmed === "npm run dev") {
            outputLines = [
              { type: "output", content: "VITE v5.0.0 ready in 245 ms" },
              { type: "output", content: "  ➜  Local:   http://localhost:5173/" },
            ];
          } else if (trimmed === "npm run build") {
            outputLines = [
              { type: "output", content: "vite v5.0.0 building for production..." },
              { type: "output", content: "✓ 1234 modules transformed." },
            ];
          } else if (trimmed === "hire") {
            // Trigger callback to show confetti
            if (onHire) {
              onHire();
            }
            outputLines = [
              { type: "output", content: HIRE_SUCCESS_MSG },
              { type: "output", content: HIRE_CONTACT_MSG },
            ];
          } else if (trimmed === "clearachievements") {
            if (onClearAchievements) {
              onClearAchievements();
            }
            outputLines = [{ type: "output", content: "All achievements cleared." }];
          } else if (trimmed === "allachievements") {
            if (onUnlockAll) {
              onUnlockAll();
            }
            outputLines = [{ type: "output", content: "All achievements unlocked!" }];
          } else if (trimmed !== "") {
            outputLines = [
              {
                type: "output",
                content: `Command not found: ${cmd}. Type 'help' for available commands.`,
              },
            ];
          }

          // Remove the blank line and add the actual output
          const removedBlankLine = prevLines.slice(0, -1);
          return [...removedBlankLine, ...outputLines];
        });
      }, 1000);

      return next;
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
