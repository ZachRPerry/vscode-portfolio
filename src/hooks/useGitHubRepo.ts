import { useState, useEffect } from "react";

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

export default function useGitHubRepo(owner: string, repo: string, enabled: boolean = false) {
  const [files, setFiles] = useState<Record<string, { language: string; value: string }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || hasLoaded) return;

    const fetchRepoFiles = async () => {
      setLoading(true);
      try {
        console.log(`Fetching GitHub repo: ${owner}/${repo}`);
        
        // Fetch the default branch first
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!repoResponse.ok) {
          throw new Error("Failed to fetch repository info");
        }
        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch;
        console.log("Default branch:", defaultBranch);

        // Fetch the complete tree recursively
        const treeResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
        );
        
        if (!treeResponse.ok) {
          throw new Error("Failed to fetch repository tree");
        }

        const treeData = await treeResponse.json();
        console.log("GitHub tree response:", treeData);
        
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

        console.log(`Found ${files.length} files to fetch`);

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
              console.warn(`Failed to fetch ${file.path}:`, err);
            }
          })
        );

        console.log("Fetched GitHub files:", Object.keys(fileContents));
        setFiles(fileContents);
        setHasLoaded(true);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("❌ GitHub API Error:", errorMessage);
        console.error("Failed to fetch repository:", `${owner}/${repo}`);
        console.error("Full error:", err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchRepoFiles();
  }, [owner, repo, enabled, hasLoaded]);

  return { files, loading, error };
}
