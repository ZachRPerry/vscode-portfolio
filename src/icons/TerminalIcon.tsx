import React from "react";

export default function TerminalIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable={false}
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        ry="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 9l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
