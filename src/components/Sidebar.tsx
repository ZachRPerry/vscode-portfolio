import ExplorerIcon from "../icons/ExplorerIcon";
import GitHubIcon from "../icons/GitHubIcon";
import LinkedInIcon from "../icons/LinkedInIcon";
import TerminalIcon from "../icons/TerminalIcon";
import TrophyIcon from "../icons/TrophyIcon";

export default function Sidebar({
  t,
  isExplorerActive = false,
  isAchievementsActive = false,
  onOpenTerminal,
  onOpenExplorer,
  onOpenAchievements,
}: {
  t: { sidebarBg: string; monaco?: string };
  isExplorerActive?: boolean;
  isAchievementsActive?: boolean;
  onOpenTerminal?: () => void;
  onOpenExplorer?: () => void;
  onOpenAchievements?: () => void;
}) {
  const inactiveIconColor = t.monaco === "vs" ? "text-[#1e1e1e]" : "text-gray-300";
  const activeBg = t.monaco === "vs" ? "bg-[#dcdcdc]" : "bg-[#3b3b3b]";
  const hoverBg = t.monaco === "vs" ? "hover:bg-[#e7e7e7]" : "hover:bg-[#2a2d2e]";
  const iconHover = hoverBg;
  const activeIconColor = t.monaco === "vs" ? "text-[#1e1e1e]" : "text-white";
  return (
    <aside className={`w-14 hidden md:flex flex-col items-center py-3 gap-4 ${t.sidebarBg}`}>
      <button
        type="button"
        onClick={onOpenExplorer}
        aria-label="Open Explorer"
        className={`w-full px-3 py-2 rounded-r-md flex justify-center relative overflow-visible ${
          isExplorerActive ? activeBg : hoverBg
        }`}
      >
        <ExplorerIcon
          className={`${isExplorerActive ? activeIconColor : inactiveIconColor} w-6 h-6`}
        />
        {isExplorerActive ? (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-[#007acc] rounded-r-sm z-10 pointer-events-none" />
        ) : null}
      </button>

      {/* Terminal opener */}
      <button
        type="button"
        onClick={onOpenTerminal}
        aria-label="Open Terminal"
        className={`w-full px-3 py-2 flex justify-center ${iconHover} rounded-r-md`}
      >
        <TerminalIcon className={`${inactiveIconColor} w-6 h-6`} />
      </button>

      {/* Achievements opener */}
      <button
        type="button"
        onClick={onOpenAchievements}
        aria-label="View Achievements"
        className={`w-full px-3 py-2 rounded-r-md flex justify-center relative overflow-visible ${
          isAchievementsActive ? activeBg : hoverBg
        }`}
      >
        <TrophyIcon
          className={`${isAchievementsActive ? activeIconColor : inactiveIconColor} w-6 h-6`}
        />
        {isAchievementsActive ? (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-[#007acc] rounded-r-sm z-10 pointer-events-none" />
        ) : null}
      </button>

      <div className="w-8 border-t border-gray-600" />

      <a
        href="https://github.com/zachrperry"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className={`w-full px-3 py-2 flex justify-center ${iconHover} rounded-r-md`}
      >
        <GitHubIcon className={`w-6 h-6 ${inactiveIconColor}`} />
      </a>

      <a
        href="https://linkedin.com/in/zachrperry"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className={`w-full px-3 py-2 flex justify-center ${iconHover} rounded-r-md`}
      >
        <LinkedInIcon className={`w-6 h-6 ${inactiveIconColor}`} />
      </a>
    </aside>
  );
}
