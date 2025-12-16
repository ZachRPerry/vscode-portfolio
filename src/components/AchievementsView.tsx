import React from "react";
import { ACHIEVEMENTS, AchievementId } from "../constants/achievements";

type AchievementsViewProps = {
  unlocked: Set<AchievementId>;
  progress: {
    openedFiles: Set<string>;
    usedCommands: Set<string>;
    themeSwitches: number;
    commandCount: number;
  };
};

export default function AchievementsView({ unlocked, progress }: AchievementsViewProps) {
  const getProgress = (id: AchievementId): { current: number; total: number } => {
    const achievement = ACHIEVEMENTS[id];
    switch (id) {
      case "file-explorer":
        return { current: progress.openedFiles.size, total: achievement.requirement };
      case "command-master":
        return { current: progress.usedCommands.size, total: achievement.requirement };
      case "hired":
        return { current: unlocked.has(id) ? 1 : 0, total: 1 };
      case "theme-switcher":
        return { current: progress.themeSwitches, total: achievement.requirement };
      case "konami-code":
        return { current: unlocked.has(id) ? 1 : 0, total: 1 };
      case "terminal-warrior":
        return { current: progress.commandCount, total: achievement.requirement };
      default:
        return { current: 0, total: 1 };
    }
  };

  const achievementIds = Object.keys(ACHIEVEMENTS) as AchievementId[];
  const unlockedCount = achievementIds.filter((id) => unlocked.has(id)).length;
  const totalCount = achievementIds.length;

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">🏆 Achievements</h1>
          <p className="text-sm opacity-70">
            {unlockedCount} of {totalCount} unlocked
          </p>
          <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#007acc] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {achievementIds.map((id) => {
            const achievement = ACHIEVEMENTS[id];
            const isUnlocked = unlocked.has(id);
            const { current, total } = getProgress(id);
            const progressPercent = Math.min((current / total) * 100, 100);

            return (
              <div
                key={id}
                className={`border rounded-lg p-4 transition-all ${
                  isUnlocked
                    ? "border-[#007acc] bg-[#007acc]/5"
                    : "border-gray-300 dark:border-gray-700 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base">{achievement.title}</h3>
                      {isUnlocked && (
                        <span className="text-xs bg-[#007acc] text-white px-2 py-0.5 rounded">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-80 mb-2">
                      {isUnlocked ? achievement.description : "???"}
                    </p>
                    {!isUnlocked && (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="opacity-70">Progress</span>
                          <span className="font-medium">
                            {current} / {total}
                          </span>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gray-400 dark:bg-gray-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
