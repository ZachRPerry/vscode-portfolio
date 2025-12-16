export default function LightbulbIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable={false}
    >
      <path d="M9 18h6M9.5 21h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 3a7 7 0 0 0-4.95 11.95c.7.7 1.24 1.5 1.53 2.37.12.37.47.68.86.68h5.12c.39 0 .74-.31.86-.68.3-.87.83-1.67 1.53-2.37A7 7 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
