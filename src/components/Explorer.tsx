import React, { useState } from "react";
import type { FileMap } from "../types";
import { getFileIcon } from "../utils/fileIcons";

interface FileNode {
  type: "file" | "folder";
  name: string;
  path: string;
  children?: FileNode[];
}

function buildFileTree(files: FileMap): FileNode[] {
  const root: FileNode[] = [];
  const folderMap = new Map<string, FileNode>();

  // Sort files, but put GitHub folder at the end
  const fileNames = Object.keys(files).sort((a, b) => {
    const aIsGitHub = a.startsWith("GitHub/");
    const bIsGitHub = b.startsWith("GitHub/");

    if (aIsGitHub && !bIsGitHub) return 1; // GitHub goes after
    if (!aIsGitHub && bIsGitHub) return -1; // Non-GitHub goes before
    return a.localeCompare(b); // Otherwise alphabetical
  });

  for (const filePath of fileNames) {
    const parts = filePath.split("/");
    let currentLevel = root;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLastPart = i === parts.length - 1;

      if (isLastPart) {
        // It's a file
        currentLevel.push({
          type: "file",
          name: part,
          path: filePath,
        });
      } else {
        // It's a folder
        let folder = folderMap.get(currentPath);
        if (!folder) {
          folder = {
            type: "folder",
            name: part,
            path: currentPath,
            children: [],
          };
          folderMap.set(currentPath, folder);
          currentLevel.push(folder);
        }
        currentLevel = folder.children!;
      }
    }
  }

  return root;
}

function FileTreeNode({
  node,
  openFile,
  activeFile,
  itemActive,
  itemHover,
  isLight,
  level = 0,
  onGitHubExpand,
}: {
  node: FileNode;
  openFile: (f: string) => void;
  activeFile: string;
  itemActive: string;
  itemHover: string;
  isLight: boolean;
  level?: number;
  onGitHubExpand?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    if (!isExpanded && node.name === "GitHub" && onGitHubExpand) {
      onGitHubExpand();
    }
    setIsExpanded(!isExpanded);
  };

  if (node.type === "file") {
    return (
      <div
        onClick={() => openFile(node.path)}
        className={`cursor-pointer px-2 py-1 rounded flex items-center ${
          activeFile === node.path ? itemActive : itemHover
        }`}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
      >
        {getFileIcon(node.name)}
        <span className="truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={handleToggle}
        className={`cursor-pointer px-2 py-1 rounded flex items-center ${itemHover}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <svg
          className={`w-4 h-4 mr-1 flex-shrink-0 transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
          />
        </svg>
        <span className="truncate">{node.name}</span>
      </div>
      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              openFile={openFile}
              activeFile={activeFile}
              itemActive={itemActive}
              itemHover={itemHover}
              isLight={isLight}
              level={level + 1}
              onGitHubExpand={onGitHubExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Explorer({
  files,
  openFile,
  activeFile,
  t,
  onGitHubExpand,
  showOnMobile,
}: {
  files: FileMap;
  openFile: (file: string) => void;
  activeFile: string;
  t: { explorerBg: string; monaco?: string };
  onGitHubExpand?: () => void;
  showOnMobile?: boolean;
}) {
  const isLight = t.monaco === "vs";
  const itemActive = isLight ? "bg-[#e2e2e2]" : "bg-[#373737]";
  const itemHover = isLight ? "hover:bg-[#f0f0f0]" : "hover:bg-[#2a2d2e]";
  const fileTree = buildFileTree(files);

  return (
    <aside
      className={`w-56 p-3 text-sm ${t.explorerBg} ${showOnMobile ? "block" : "hidden"} md:block`}
    >
      <h3 className="text-xs mb-2">EXPLORER</h3>
      {fileTree.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          openFile={openFile}
          activeFile={activeFile}
          itemActive={itemActive}
          itemHover={itemHover}
          isLight={isLight}
          onGitHubExpand={onGitHubExpand}
        />
      ))}
    </aside>
  );
}
