export const themes = {
  dark: {
    monaco: "vs-dark",
    appBg: "bg-[#1e1e1e] text-[#d4d4d4]",
    menuBg: "bg-[#3c3c3c] text-[#cccccc]",
    sidebarBg: "bg-[#333]",
    explorerBg: "bg-[#252526]",
    tabsBg: "bg-[#252526]",
    tabActive: "bg-[#1e1e1e] text-white",
    tabInactive: "bg-[#2d2d2d] text-[#cccccc]",
    terminalBg: "bg-[#1e1e1e]",
  },
  light: {
    monaco: "vs",
    appBg: "bg-[#ffffff] text-[#1e1e1e]",
    menuBg: "bg-[#f3f3f3] text-[#1e1e1e]",
    sidebarBg: "bg-[#e5e5e5]",
    explorerBg: "bg-[#f3f3f3]",
    tabsBg: "bg-[#eaeaea]",
    tabActive: "bg-white text-black",
    tabInactive: "bg-[#dddddd] text-black",
    terminalBg: "bg-[#f3f3f3]",
  },
} as const;

export type ThemeKey = keyof typeof themes;
