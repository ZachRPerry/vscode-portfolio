import { useMemo } from "react";
import type { Command } from "../types";
import type { ThemeKey } from "../theme";

export default function useCommands(
  openFile: (f: string) => void,
  setTheme: (t: ThemeKey) => void,
  openTerminal?: () => void,
  onHire?: () => void
): Command[] {
  return useMemo<Command[]>(
    () => [
      {
        id: "open-contact",
        title: "Open contact.json",
        action: () => openFile("contact.json"),
        keywords: ["file", "contact"],
      },
      {
        id: "open-projects",
        title: "Open projects.md",
        action: () => openFile("projects.md"),
        keywords: ["file", "projects"],
      },
      {
        id: "open-experience",
        title: "Open experience.md",
        action: () => openFile("experience.md"),
        keywords: ["file", "experience"],
      },
      {
        id: "theme-dark",
        title: "Theme: Dark",
        action: () => setTheme("dark"),
        keywords: ["theme"],
      },
      {
        id: "theme-light",
        title: "Theme: Light",
        action: () => setTheme("light"),
        keywords: ["theme"],
      },
      // Removed HC theme command; only light/dark supported
      ...(openTerminal
        ? [
            {
              id: "terminal-open",
              title: "Terminal: Open",
              action: () => openTerminal(),
              keywords: ["terminal", "panel", "open"],
            } as Command,
          ]
        : []),
      ...(onHire
        ? [
            {
              id: "hire-me",
              title: "🎉 Hire Me!",
              subtitle: "Let's work together",
              action: () => onHire(),
              keywords: ["hire", "contact", "job", "work"],
            } as Command,
          ]
        : []),
    ],
    [openFile, setTheme, openTerminal, onHire]
  );
}
