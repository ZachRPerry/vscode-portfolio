import React from "react";
import Editor from "@monaco-editor/react";
import Landing from "./Landing";

export default function EditorPane({
  file,
  monacoTheme,
  onOpenContact,
}: {
  file?: { language: string; value: string };
  monacoTheme: string;
  onOpenContact?: () => void;
}) {
  if (!file) {
    return <Landing onOpenContact={onOpenContact} />;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
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
    </div>
  );
}
