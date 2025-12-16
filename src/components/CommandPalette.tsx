import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Command } from "../types";

export default function CommandPalette({
  open,
  onClose,
  commands,
  t,
  anchorRect,
  onCommandExecute,
}: {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  t: { monaco?: string } & Record<string, string>;
  anchorRect?: DOMRect;
  onCommandExecute?: (commandId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [animOpen, setAnimOpen] = useState(false);

  const isLight = t.monaco === "vs";
  const panelBg = isLight ? "bg-white text-[#1e1e1e]" : "bg-[#252526] text-[#d4d4d4]";
  const itemHover = isLight ? "hover:bg-[#f3f4f6]" : "hover:bg-[#2a2d2e]";
  const itemActive = isLight ? "bg-[#e5e7eb]" : "bg-[#3a3d41]";
  const borderCol = isLight ? "border-gray-200" : "border-[#3a3d41]";
  const panelAnim = `transition-all duration-150 ease-out transform ${
    animOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
  }`;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => {
      const inTitle = c.title.toLowerCase().includes(q);
      const inSubtitle = c.subtitle?.toLowerCase().includes(q);
      const inKeywords = c.keywords?.some((k) => k.toLowerCase().includes(q));
      return inTitle || inSubtitle || inKeywords;
    });
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setAnimOpen(false);
      const id = requestAnimationFrame(() => setAnimOpen(true));
      return () => cancelAnimationFrame(id);
    } else {
      setAnimOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[index];
        if (cmd) {
          cmd.action();
          onCommandExecute?.(cmd.id);
          onClose();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, index, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {anchorRect ? (
        <div
          className="fixed"
          style={{
            left: anchorRect.left,
            top: anchorRect.bottom + 6,
            width: anchorRect.width,
          }}
        >
          <div
            className={`relative rounded-md shadow-lg border ${borderCol} ${panelBg} ${panelAnim}`}
          >
            {/* caret arrow */}
            <div
              className="absolute w-3 h-3 rotate-45"
              style={{
                top: -6,
                left: Math.max(
                  8,
                  Math.min(anchorRect.width - 16, Math.round(anchorRect.width / 2 - 6))
                ),
                background: isLight ? "#ffffff" : "#252526",
                borderLeft: isLight ? "1px solid #e5e7eb" : "1px solid #3a3d41",
                borderTop: isLight ? "1px solid #e5e7eb" : "1px solid #3a3d41",
              }}
            />
            <div className={`border-b ${borderCol} px-3 py-2`}>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command... (Ctrl+Shift+P)"
                className={`w-full bg-transparent outline-none placeholder:opacity-60`}
              />
            </div>
            <ul className="max-h-80 overflow-auto py-2">
              {filtered.length === 0 && <li className="px-3 py-2 opacity-60">No results</li>}
              {filtered.map((c, i) => (
                <li
                  key={c.id}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => {
                    c.action();
                    onCommandExecute?.(c.id);
                    onClose();
                  }}
                  className={`px-3 py-2 cursor-pointer ${
                    i === index ? itemActive : ""
                  } ${itemHover}`}
                >
                  <div className="text-sm">{c.title}</div>
                  {c.subtitle ? <div className="text-xs opacity-70">{c.subtitle}</div> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="absolute left-1/2 top-24 -translate-x-1/2 w-full max-w-xl px-4">
          <div className={`rounded-md shadow-lg border ${borderCol} ${panelBg} ${panelAnim}`}>
            <div className={`border-b ${borderCol} px-3 py-2`}>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command... (Ctrl+Shift+P)"
                className={`w-full bg-transparent outline-none placeholder:opacity-60`}
              />
            </div>
            <ul className="max-h-80 overflow-auto py-2">
              {filtered.length === 0 && <li className="px-3 py-2 opacity-60">No results</li>}
              {filtered.map((c, i) => (
                <li
                  key={c.id}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => {
                    c.action();
                    onCommandExecute?.(c.id);
                    onClose();
                  }}
                  className={`px-3 py-2 cursor-pointer ${
                    i === index ? itemActive : ""
                  } ${itemHover}`}
                >
                  <div className="text-sm">{c.title}</div>
                  {c.subtitle ? <div className="text-xs opacity-70">{c.subtitle}</div> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
