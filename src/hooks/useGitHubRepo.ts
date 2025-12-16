import { useState, useEffect } from "react";

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

export default function useGitHubRepo(
  owner: string,
  repo: string,
  enabled: boolean = false,
  terminalCommandRef: ((cmd: string, skipEcho?: boolean) => void) | null = null,
  onOpenTerminal?: () => void
) {
  const [files, setFiles] = useState<Record<string, { language: string; value: string }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Don't fetch if not enabled, already loaded, or had an error
    if (!enabled || hasLoaded || error) return;

    const fetchRepoFiles = async () => {
      setLoading(true);
      try {
        // Fetch the default branch first
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!repoResponse.ok) {
          throw new Error("Failed to fetch repository info");
        }
        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch;

        // Fetch the complete tree recursively
        const treeResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
        );
        
        if (!treeResponse.ok) {
          throw new Error("Failed to fetch repository tree");
        }

        const treeData = await treeResponse.json();
        
        const fileTree: GitHubTreeItem[] = treeData.tree;

        // Filter for files only (exclude directories and unwanted files)
        const files = fileTree.filter(
          (item: GitHubTreeItem) =>
            item.type === "blob" &&
            !item.path.includes("node_modules/") &&
            !item.path.includes("dist/") &&
            !item.path.includes(".git/") &&
            !item.path.startsWith(".") &&
            (item.size || 0) < 100000 // Skip files larger than 100KB
        );

        const fileContents: Record<string, { language: string; value: string }> = {};

        // Fetch content for each file (limit to first 30 to avoid rate limits)
        const filesToFetch = files.slice(0, 30);
        
        await Promise.all(
          filesToFetch.map(async (file: GitHubTreeItem) => {
            try {
              const fileResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`
              );
              
              if (fileResponse.ok) {
                const fileData = await fileResponse.json();
                const content = atob(fileData.content.replace(/\n/g, '')); // Decode base64
                
                const ext = file.path.split(".").pop()?.toLowerCase();
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
                  case "tsx":
                    language = "typescript";
                    break;
                  case "js":
                  case "jsx":
                  case "cjs":
                    language = "javascript";
                    break;
                  case "html":
                    language = "html";
                    break;
                  case "css":
                    language = "css";
                    break;
                  default:
                    language = "text";
                }

                fileContents[`GitHub/${file.path}`] = { language, value: content };
              }
            } catch (err) {
              // Silently skip files that fail to fetch
            }
          })
        );

        setFiles(fileContents);
        setHasLoaded(true);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchRepoFiles();
  }, [owner, repo, enabled, hasLoaded]);

  return { files, loading, error };
}
