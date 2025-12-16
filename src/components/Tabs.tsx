import { getFileIcon } from "../utils/fileIcons";

export default function Tabs({
  openTabs,
  activeFile,
  setActiveFile,
  closeTab,
  t,
}: {
  openTabs: string[];
  activeFile: string;
  setActiveFile: (s: string) => void;
  closeTab: (s: string) => void;
  t: { tabsBg: string; tabActive: string; tabInactive: string };
}) {
  return (
    <div className={`h-8 flex items-center overflow-x-auto scrollbar-thin ${t.tabsBg}`}>
      {openTabs.map((tab) => (
        <div
          key={tab}
          onClick={() => setActiveFile(tab)}
          className={`flex items-center px-2 md:px-3 h-full text-xs md:text-sm cursor-pointer border-r border-[#1e1e1e] flex-shrink-0 ${
            tab === activeFile ? t.tabActive : t.tabInactive
          }`}
        >
          {getFileIcon(tab)}
          {tab.split("/").pop()}
          <span
            className="ml-2 text-xs hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab);
            }}
          >
            ×
          </span>
        </div>
      ))}
    </div>
  );
}
