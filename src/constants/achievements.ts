export type AchievementId =
  | "file-explorer"
  | "command-master"
  | "hired"
  | "theme-switcher"
  | "konami-code"
  | "terminal-warrior";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  requirement: number;
};

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  "file-explorer": {
    id: "file-explorer",
    title: "File Explorer",
    description: "Opened all available files",
    icon: "📁",
    requirement: 4, // contact.json, experience.md, projects.md, README.md
  },
  "command-master": {
    id: "command-master",
    title: "Command Master",
    description: "Used 10 different command palette commands",
    icon: "⚡",
    requirement: 10,
  },
  "hired": {
    id: "hired",
    title: "You're Hired!",
    description: "Triggered the hire command",
    icon: "🎉",
    requirement: 1,
  },
  "theme-switcher": {
    id: "theme-switcher",
    title: "Theme Switcher",
    description: "Switched between light and dark theme 5 times",
    icon: "💡",
    requirement: 5,
  },
  "konami-code": {
    id: "konami-code",
    title: "Secret Unlocked",
    description: "Discovered the Konami Code",
    icon: "🎮",
    requirement: 1,
  },
  "terminal-warrior": {
    id: "terminal-warrior",
    title: "Terminal Warrior",
    description: "Executed 25 terminal commands",
    icon: "⌨️",
    requirement: 25,
  },
};
