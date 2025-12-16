import React from "react";
import type { ThemeKey } from "../theme";

type ToastProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  theme: ThemeKey;
};

export default function Toast({ open, onClose, title = "Tip", message, theme }: ToastProps) {
  if (!open) return null;
  const isLight = theme === "light";
  const bg = isLight ? "bg-[#f3f3f3] text-[#1e1e1e]" : "bg-[#252526] text-[#d4d4d4]";
  const border = isLight ? "border border-[#e0e0e0]" : "border border-[#3a3d41]";
  return (
    <>
      {/* Dimming overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[90] animate-[overlayFadeIn_300ms_ease-out]"
        onClick={onClose}
      />

      <div className="fixed bottom-4 right-4 z-[100]">
        <div
          className={`relative w-80 rounded-md shadow-xl ${bg} ${border} ring-1 ring-black/5 overflow-hidden animate-[toastIn_160ms_ease-out]`}
          style={{
            boxShadow: "0 8px 24px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {/* left accent bar (VS Code info blue) */}
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[#007acc]" />

          <div className="pl-3 pr-2 py-2 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-semibold mb-0.5 leading-snug">{title}</div>
                <div className="text-[11.5px] leading-snug opacity-90">{message}</div>
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={onClose}
                className={`px-1 rounded hover:bg-${isLight ? "[#e9e9e9]" : "[#333333]"}`}
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* keyframes inline for portability */}
        <style>
          {`
          @keyframes toastIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes overlayFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
        </style>
      </div>
    </>
  );
}
