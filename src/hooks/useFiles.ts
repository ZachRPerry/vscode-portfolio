import { useEffect, useState } from "react";
import type { FileMap } from "../types";

export default function useFiles() {
  const [files, setFiles] = useState<FileMap>({});
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string>("");

  useEffect(() => {
    const modules = import.meta.glob("../files/*", { as: "raw" });
    const load = async () => {
      let entries = Object.entries(modules) as [string, () => Promise<string>][];
      // Sort entries by filename for consistent ordering
      entries = entries.sort((a, b) => {
        const nameA = a[0].split("/").pop() || "";
        const nameB = b[0].split("/").pop() || "";
        return nameA.localeCompare(nameB);
      });
      const results: Record<string, { language: string; value: string }> = {};

      await Promise.all(
        entries.map(async ([path, loader]) => {
          const content = await loader();
          const name = path.split("/").pop() || path;
          const ext = name.split(".").pop()?.toLowerCase();
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

          results[name] = { language, value: content };
        })
      );

      setFiles(results);
    };

    load();
  }, []);

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
  } as const;
}
