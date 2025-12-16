import { useEffect, useState } from "react";
import type { FileMap } from "../types";
import useGitHubRepo from "./useGitHubRepo";

export default function useFiles() {
  const [files, setFiles] = useState<FileMap>({});
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string>("");
  const [githubEnabled, setGithubEnabled] = useState(false);
  const [terminalCommandRef, setTerminalCommandRef] = useState<((cmd: string, skipEcho?: boolean) => void) | null>(null);
  const { files: githubFiles, error: githubError } = useGitHubRepo("zachrperry", "vscode-portfolio", githubEnabled);

  // Send GitHub error to terminal when it occurs
  useEffect(() => {
    if (githubError && terminalCommandRef) {
      terminalCommandRef(`echo "❌ GitHub API Error: ${githubError}"`, true);
    }
  }, [githubError, terminalCommandRef]);

  useEffect(() => {
    const modules = import.meta.glob("../files/**/*", { as: "raw" });
    const load = async () => {
      let entries = Object.entries(modules) as [string, () => Promise<string>][];
      const results: Record<string, { language: string; value: string }> = {};

      await Promise.all(
        entries.map(async ([path, loader]) => {
          const content = await loader();
          // Extract the relative path from ../files/
          const relativePath = path.replace(/^.*\/files\//, "");
          const ext = relativePath.split(".").pop()?.toLowerCase();
          let language: string;
          switch (ext) {
            case "md":
            case "markdown":
              language = "markdown";
              break;
            case "json":
              language = "json";
              break;
            case "ts":
              language = "typescript";
              break;
            case "js":
              language = "javascript";
              break;
            default:
              language = "text";
          }

          results[relativePath] = { language, value: content };
        })
      );

      // Add a placeholder for the GitHub folder
      results["GitHub/.placeholder"] = { language: "text", value: "Loading..." };

      setFiles(results);
    };

    load();
  }, []);

  // Merge GitHub files when they're loaded
  useEffect(() => {
    if (Object.keys(githubFiles).length > 0) {
      setFiles((prev) => {
        // Remove placeholder and add GitHub files
        const { "GitHub/.placeholder": _, ...rest } = prev;
        return { ...rest, ...githubFiles };
      });
    }
  }, [githubFiles]);

  const openFile = (file: string) => {
    if (!openTabs.includes(file)) setOpenTabs((prev) => [...prev, file]);
    setActiveFile(file);
  };

  const closeTab = (file: string) => {
    const filtered = openTabs.filter((f) => f !== file);
    setOpenTabs(filtered);
    if (file === activeFile && filtered.length > 0) {
      setActiveFile(filtered[filtered.length - 1]);
    } else if (file === activeFile) {
      setActiveFile("");
    }
  };

  return {
    files,
    openTabs,
    activeFile,
    openFile,
    closeTab,
    setOpenTabs,
    setActiveFile,
    enableGitHub: () => setGithubEnabled(true),
    setTerminalCommandRef,
  } as const;
}
