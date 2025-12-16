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
    terminalBg: "bg-[#012456]",
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
  hc: {
    monaco: "hc-black",
    appBg: "bg-black text-white",
    menuBg: "bg-black text-white",
    sidebarBg: "bg-black",
    explorerBg: "bg-black",
    tabsBg: "bg-black",
    tabActive: "bg-yellow-400 text-black",
    tabInactive: "bg-black text-white",
    terminalBg: "bg-black",
  },
} as const;

export type ThemeKey = keyof typeof themes;
