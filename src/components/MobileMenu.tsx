import ExplorerIcon from "../icons/ExplorerIcon";
import GitHubIcon from "../icons/GitHubIcon";
import LinkedInIcon from "../icons/LinkedInIcon";
import TerminalIcon from "../icons/TerminalIcon";
import TrophyIcon from "../icons/TrophyIcon";

export default function MobileMenu({
  isOpen,
  onClose,
  t,
  isExplorerActive,
  isAchievementsActive,
  onOpenExplorer,
  onOpenTerminal,
  onOpenAchievements,
}: {
  isOpen: boolean;
  onClose: () => void;
  t: { sidebarBg: string; monaco?: string };
  isExplorerActive?: boolean;
  isAchievementsActive?: boolean;
  onOpenExplorer?: () => void;
  onOpenTerminal?: () => void;
  onOpenAchievements?: () => void;
}) {
  if (!isOpen) return null;

  const isLight = t.monaco === "vs";
  const inactiveIconColor = isLight ? "text-[#1e1e1e]" : "text-gray-300";
  const activeBg = isLight ? "bg-[#dcdcdc]" : "bg-[#3b3b3b]";
  const hoverBg = isLight ? "hover:bg-[#e7e7e7]" : "hover:bg-[#2a2d2e]";
  const activeIconColor = isLight ? "text-[#1e1e1e]" : "text-white";
  const menuBg = isLight ? "bg-[#f3f3f3]" : "bg-[#252526]";

  const handleItemClick = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />

      {/* Menu */}
      <div
        className={`fixed left-0 top-8 bottom-0 w-64 ${menuBg} z-50 md:hidden ${t.sidebarBg} flex flex-col p-4 gap-2`}
      >
        <button
          type="button"
          onClick={() => handleItemClick(onOpenExplorer)}
          className={`flex items-center gap-3 px-4 py-3 rounded ${
            isExplorerActive ? activeBg : hoverBg
          }`}
        >
          <ExplorerIcon
            className={`${isExplorerActive ? activeIconColor : inactiveIconColor} w-6 h-6`}
          />
          <span className={isExplorerActive ? activeIconColor : inactiveIconColor}>Explorer</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick(onOpenTerminal)}
          className={`flex items-center gap-3 px-4 py-3 rounded ${hoverBg}`}
        >
          <TerminalIcon className={`${inactiveIconColor} w-6 h-6`} />
          <span className={inactiveIconColor}>Terminal</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick(onOpenAchievements)}
          className={`flex items-center gap-3 px-4 py-3 rounded ${
            isAchievementsActive ? activeBg : hoverBg
          }`}
        >
          <TrophyIcon
            className={`${isAchievementsActive ? activeIconColor : inactiveIconColor} w-6 h-6`}
          />
          <span className={isAchievementsActive ? activeIconColor : inactiveIconColor}>
            Achievements
          </span>
        </button>

        <div className="border-t border-gray-600 my-2" />

        <a
          href="https://github.com/zachrperry"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-4 py-3 rounded ${hoverBg}`}
          onClick={onClose}
        >
          <GitHubIcon className={`w-6 h-6 ${inactiveIconColor}`} />
          <span className={inactiveIconColor}>GitHub</span>
        </a>

        <a
          href="https://linkedin.com/in/zachrperry"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-4 py-3 rounded ${hoverBg}`}
          onClick={onClose}
        >
          <LinkedInIcon className={`w-6 h-6 ${inactiveIconColor}`} />
          <span className={inactiveIconColor}>LinkedIn</span>
        </a>
      </div>
    </>
  );
}
