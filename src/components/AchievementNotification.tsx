import React, { useEffect } from "react";
import type { Achievement } from "../constants/achievements";

type AchievementNotificationProps = {
  achievement: Achievement | null;
  onClose: () => void;
};

export default function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] animate-[slideInRight_300ms_ease-out]">
      <div className="bg-gradient-to-r from-[#007acc] to-[#0098ff] text-white rounded-lg shadow-2xl border border-[#005a9e] overflow-hidden min-w-[320px]">
        <div className="px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="text-4xl flex-shrink-0">{achievement.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide opacity-90 mb-1">
                Achievement Unlocked!
              </div>
              <div className="text-lg font-bold mb-1">{achievement.title}</div>
              <div className="text-sm opacity-90">{achievement.description}</div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded px-1.5 py-0.5 text-lg leading-none flex-shrink-0"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
        <div className="h-1 bg-white/20">
          <div className="h-full bg-white animate-[shrink_5000ms_linear]" />
        </div>
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
    </div>
  );
}
