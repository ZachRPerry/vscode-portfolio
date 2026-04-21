import { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Landing from "./Landing";

export default function EditorPane({
  file,
  monacoTheme,
  onOpenContact,
  onOpenFile,
}: {
  file?: { language: string; value: string };
  monacoTheme: string;
  onOpenContact?: () => void;
  onOpenFile?: (filename: string) => void;
}) {
  const [mdPreview, setMdPreview] = useState(true);

  if (!file) {
    return <Landing onOpenContact={onOpenContact} onOpenFile={onOpenFile} />;
  }

  const isMarkdown = file.language === "markdown";
  const isLight = monacoTheme === "vs";

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {isMarkdown && (
        <button
          type="button"
          onClick={() => setMdPreview((p) => !p)}
          className={`absolute top-2 right-4 z-10 px-2 py-1 text-xs rounded border ${
            isLight
              ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              : "bg-[#1e1e1e] text-gray-200 border-gray-600 hover:bg-[#2a2d2e]"
          }`}
          title={mdPreview ? "View source" : "View preview"}
        >
          {mdPreview ? "Source" : "Preview"}
        </button>
      )}

      {isMarkdown && mdPreview ? (
        <div
          className={`flex-1 overflow-auto px-8 py-10 ${
            isLight ? "bg-white text-gray-900" : "bg-[#1e1e1e] text-gray-100"
          }`}
        >
          <article
            className={`prose max-w-3xl mx-auto ${
              isLight ? "prose-slate" : "prose-invert"
            } prose-headings:font-semibold prose-a:text-[#007acc] prose-a:no-underline hover:prose-a:underline prose-code:bg-black/20 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{file.value}</ReactMarkdown>
          </article>
        </div>
      ) : (
        <Editor
          height="100%"
          width="100%"
          theme={monacoTheme}
          language={file.language}
          value={file.value}
          options={{
            readOnly: true,
            minimap: {
              enabled: true,
              side: "right",
              showSlider: "mouseover",
              renderCharacters: true,
              maxColumn: 120,
              scale: 1,
            },
            lineNumbers: "on",
            fontSize: 14,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      )}
    </div>
  );
}
