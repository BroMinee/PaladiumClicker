"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const IconCheckBadge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.6 2.39-1.5 3.055M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9c0 .194 0 .385-.022.572M21 12a9 9 0 0 0-9-9M3.055 15A9 9 0 0 1 3 12m0 0a9 9 0 0 1 9-9" />
  </svg>
);

/**
 * component TODO anyway
 */
export function AchievementSection() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Succès Débloqués
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {playerInfo.achievements.map((ach) => (
          <AchievementCard
            key={ach.name}
            name={ach.name}
          />
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ name }: { name: string }) {
  const unlocked = true;
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-3 rounded-lg aspect-square
        ${
    unlocked
      ? "bg-yellow-600/30 border border-yellow-500"
      : "bg-gray-700 border border-gray-600 grayscale opacity-60"
    }
      `}
      title={name}
    >
      {unlocked ? (
        <IconCheckBadge/>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      )}
      <span className="text-xs mt-2 truncate w-full">
        {name}
      </span>
    </div>
  );
}