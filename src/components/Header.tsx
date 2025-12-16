import type { ThemeKey } from "../theme";
import LightbulbIcon from "../icons/LightbulbIcon";
import MenuIcon from "../icons/MenuIcon";

export default function Header({
  theme,
  setTheme,
  t,
  showThemeTip,
  onOpenPalette,
  onLogoClick,
  onMenuClick,
}: {
  theme: ThemeKey;
  setTheme: (s: ThemeKey) => void;
  t: { menuBg: string };
  onOpenPalette: (anchor: DOMRect) => void;
  onLogoClick: () => void;
  onMenuClick?: () => void;
  showThemeTip?: boolean;
}) {
  const isLight = theme === "light";
  const boxBg = isLight ? "bg-white text-[#1e1e1e]" : "bg-[#2a2d2e] text-[#cccccc]";
  const boxBorder = isLight ? "border border-gray-300" : "border border-[#3a3d41]";
  const boxHover = isLight ? "hover:bg-[#f3f4f6]" : "hover:bg-[#333333]";
  return (
    <header className={`h-8 flex items-center px-2 md:px-3 text-xs ${t.menuBg}`}>
      {/* Left: hamburger menu (mobile only) + menu + logo */}
      <div className="flex items-center gap-0">
        <button
          onClick={onMenuClick}
          className="md:hidden mr-2 p-1 hover:opacity-80"
          aria-label="Open menu"
        >
          <MenuIcon className={`w-5 h-5 ${isLight ? "text-[#1e1e1e]" : "text-gray-300"}`} />
        </button>
        <button
          onClick={onLogoClick}
          title="Go to home"
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src="/zLogoVS.png" alt="zach VS logo" className="w-5 h-5 mr-2 md:mr-3 select-none" />
        </button>
        <span className="hidden md:inline mr-4">File</span>
        <span className="hidden md:inline mr-4">Edit</span>
        <span className="hidden lg:inline mr-4">Selection</span>
        <span className="hidden lg:inline mr-4">View</span>
        <span className="hidden lg:inline mr-4">Go</span>
        <span className="hidden lg:inline mr-4">Run</span>
        <span className="hidden lg:inline">Help</span>
      </div>

      {/* Center: command box */}
      <div className="flex-1 flex justify-center px-2">
        <button
          onClick={(e) =>
            onOpenPalette((e.currentTarget as HTMLButtonElement).getBoundingClientRect())
          }
          className={`w-full md:w-[520px] flex items-center justify-between gap-2 md:gap-6 px-2 md:px-3 h-6 rounded ${boxBg} ${boxBorder} ${boxHover}`}
          title="Open Command Palette (Ctrl+Shift+P)"
        >
          <span className="opacity-80">Search for commands…</span>
          <span className="opacity-60 hidden sm:inline">Ctrl+Shift+P</span>
        </button>
      </div>

      {/* Right: theme toggle (lightbulb) */}
      <div className="flex items-center">
        <div className={`relative ${showThemeTip ? "z-[95]" : ""}`}>
          <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            title={isLight ? "Switch to Dark" : "Switch to Light"}
            aria-label="Toggle theme"
            className={`p-0 rounded-md border ${
              isLight
                ? "bg-[#fffbe6] hover:bg-[#fff3b0] border-[#f2d24b]"
                : "bg-[#3a3a3a] hover:bg-[#4a4a4a] border-[#555555]"
            } transition-colors`}
          >
            <span className="inline-flex items-center justify-center w-6 h-6">
              <LightbulbIcon
                className={`${isLight ? "text-yellow-600" : "text-yellow-300"} w-5 h-5`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
