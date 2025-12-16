import React from "react";
import CodeIcon from "../icons/CodeIcon";

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
    <div className={`h-8 flex items-center overflow-x-auto ${t.tabsBg}`}>
      {openTabs.map((tab) => (
        <div
          key={tab}
          onClick={() => setActiveFile(tab)}
          className={`flex items-center px-3 h-full text-sm cursor-pointer border-r border-[#1e1e1e] ${
            tab === activeFile ? t.tabActive : t.tabInactive
          }`}
        >
          <CodeIcon className="w-4 h-4 mr-2" />
          {tab}
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
