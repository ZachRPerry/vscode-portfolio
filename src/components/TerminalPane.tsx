import React, { useRef, useEffect } from "react";
import useTerminal from "../hooks/useTerminal";

export default function TerminalPane({ t, theme }: { t: { terminalBg: string }; theme?: string }) {
  const { lines, input, setInput, handleKeyDown, handleCommand } = useTerminal(theme);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
  const scrollBg = isLight ? "bg-[#f9f9f9]" : "bg-[#0b0b0b]";
  const promptColor = isLight ? "text-green-700" : "text-green-400";
  const inputTextColor = isLight ? "text-[#1e1e1e]" : "text-gray-100";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className={`h-40 font-mono text-sm flex flex-col ${rootBg}`}>
      <div
        className={`flex items-center justify-between px-3 py-1 text-xs border-b ${headerBorder}`}
      >
        <div className="flex items-center gap-2">
          <div className={chipClass}>TERMINAL</div>
          <div className={chipClassSecondary}>1: powershell</div>
        </div>
        <div className={`text-xs ${headerTextMuted}`}>vscode</div>
      </div>

      <div ref={scrollRef} className={`flex-1 overflow-auto px-3 py-2 space-y-1 ${scrollBg}`}>
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
                {line.content}
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
