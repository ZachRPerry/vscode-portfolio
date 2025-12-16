import { useEffect, useState } from "react";

export default function useFiles() {
  const [files, setFiles] = useState<Record<string, { language: string; value: string }>>({});
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
          let language = "text";
          if (ext === "md" || ext === "markdown") language = "markdown";
          else if (ext === "json") language = "json";
          else if (ext === "ts") language = "typescript";
          else if (ext === "js") language = "javascript";

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
