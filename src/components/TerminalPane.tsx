import React, { useRef, useEffect } from "react";
import useTerminal from "../hooks/useTerminal";

export default function TerminalPane({
  t,
  theme,
  onClose,
  onHire,
  commandRef,
  onOpenFile,
  onCommand,
  onClearAchievements,
  onUnlockAll,
}: {
  t: { terminalBg: string };
  theme?: string;
  onClose?: () => void;
  onHire?: () => void;
  commandRef?: React.MutableRefObject<((cmd: string, skipEcho?: boolean) => void) | null>;
  onOpenFile?: (file: string) => void;
  onCommand?: (cmd: string) => void;
  onClearAchievements?: () => void;
  onUnlockAll?: () => void;
}) {
  const { lines, input, setInput, handleKeyDown, handleCommand } = useTerminal(
    theme,
    onHire,
    onCommand,
    onClearAchievements,
    onUnlockAll
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Expose handleCommand via ref (using layout effect to set synchronously)
  useEffect(() => {
    if (commandRef) {
      commandRef.current = handleCommand;
    }
  }, [handleCommand, commandRef]);

  // Parse content with [[filename]] markers into clickable links
  const renderContent = (content: string) => {
    const parts = content.split(/\[\[(.+?)\]\]/);
    return parts.map((part, idx) => {
      // Odd indices are the captured groups (filenames)
      if (idx % 2 === 1 && onOpenFile) {
        return (
          <button
            key={idx}
            onClick={() => onOpenFile(part)}
            className={`underline hover:opacity-80 cursor-pointer ${
              isLight ? "text-blue-700" : "text-blue-400"
            }`}
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  const isLight = theme === "light";
  const rootBg = isLight ? "bg-[#f3f3f3] text-[#1e1e1e]" : "bg-[#0b0b0b] text-gray-200";
  const headerBorder = isLight ? "border-gray-300" : "border-[#222]";
  const headerTextMuted = isLight ? "text-gray-600" : "text-gray-400";
  const chipClass = isLight
    ? "px-2 py-0.5 bg-[#e5e7eb] rounded text-xs font-medium text-[#1f2937]"
    : "px-2 py-0.5 bg-[#1f2937] rounded text-xs font-medium";
  const chipClassSecondary = isLight
    ? "px-2 py-0.5 bg-[#e5e7eb] rounded text-xs text-[#1f2937]"
    : "px-2 py-0.5 bg-[#1f2937] rounded text-xs";
  const promptColor = isLight ? "text-green-700" : "text-green-400";
  const inputTextColor = isLight ? "text-[#1e1e1e]" : "text-gray-100";
  const separatorBorder = isLight ? "border-t border-gray-300" : "border-t border-[#3a3d41]";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      className={`h-[200px] flex-shrink-0 font-mono text-sm flex flex-col ${t.terminalBg} ${separatorBorder} ${
        isLight ? "text-[#1e1e1e]" : "text-gray-200"
      }`}
    >
      <div
        className={`flex items-center justify-between px-3 py-1 text-xs border-b ${headerBorder}`}
      >
        <div className="flex items-center gap-2">
          <div className={chipClass}>TERMINAL</div>
          <div className={chipClassSecondary}>1: powershell</div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-xs ${headerTextMuted}`}>vscode</div>
          {onClose && (
            <button
              type="button"
              title="Close Terminal"
              aria-label="Close Terminal"
              onClick={onClose}
              className={`${isLight ? "hover:bg-[#e5e7eb]" : "hover:bg-[#2a2d2e]"} rounded px-2 py-0.5`}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto px-3 py-2 space-y-1">
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === "command" && (
              <div>
                <span className={`${promptColor}`}>PS C:\\Users\\zach&gt;</span>
                <span className={`ml-2 ${isLight ? "text-[#1e1e1e]" : "text-gray-100"}`}>
                  {line.content}
                </span>
              </div>
            )}
            {line.type === "output" && (
              <div
                className={
                  line.content.toLowerCase().startsWith("warning")
                    ? isLight
                      ? "text-amber-700"
                      : "text-amber-400"
                    : line.content.startsWith("✓") ||
                        line.content.toLowerCase().startsWith("success")
                      ? isLight
                        ? "text-green-700"
                        : "text-green-400"
                      : isLight
                        ? "text-gray-700"
                        : "text-gray-500"
                }
              >
                {renderContent(line.content)}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <span className={`${promptColor}`}>PS C:\\Users\\zach&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`ml-2 bg-transparent ${inputTextColor} outline-none flex-1`}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
