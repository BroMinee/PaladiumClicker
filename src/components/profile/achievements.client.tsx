"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Achievement } from "@/types";
import { CategoryEnum, getCategoryInfo, groupAndSortAchievements, isCompleted, orderBy, romanToInt, safeJoinPaths } from "@/lib/misc";
import { constants } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/shared/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/shared/hover";

import { FaCheck, FaLock } from "react-icons/fa";
import { ReactNode, useMemo } from "react";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { useItemsStore } from "@/stores/use-items-store";

/**
 * Display all the achievement vertically, sorted by completion and order by category.
 */
export function AchievementSection() {
  const { data: playerInfo } = usePlayerInfoStore();

  const groupedAchievements = useMemo(() => {
    if (!playerInfo) {
      return {} as Record<CategoryEnum, Achievement[]>;
    }
    return groupAndSortAchievements(playerInfo.achievements);
  }, [playerInfo]);

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div>
        <div className="font-bold">
          <h3 className="text-xl font-semibold mb-4">Succès Débloqués</h3>
          <DisplayProgressionAchievement deno={playerInfo.achievements.length} num={playerInfo.achievements.filter(a => isCompleted(a)).length} height="h-3" />
        </div>
        {Object.values(CategoryEnum).map((category) => {
          const achievements = groupedAchievements[category];
          if (!achievements || achievements.length === 0) {
            return null;
          }

          return (
            <div key={category} className="mb-8">
              <h4 className="text-lg mb-3 mt-4 border-b border-secondary pb-1">
                {getCategoryInfo(category).displayText}
                <DisplayProgressionAchievement deno={achievements.length} num={achievements.filter(a => isCompleted(a)).length} height="h-3" />
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {achievements.map((ach, index) => (
                  <DetailAchievement key={ach.name + index} achievement={ach} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

const AchievementInfo = ({ title, img, value, children }: { title: string, img: string, value: string, children: ReactNode }) => {
  return (
    <div className="flex items-center space-x-3 p-2 w-full">
      <div className="flex-shrink-0 w-10 h-10">
        <UnOptimizedImage src={img} alt={title} width={0} height={0} className="w-full h-full object-contain pixelated" />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <p className="text-xs truncate">{value}</p>
        {children}
      </div>
    </div>
  );
};

const DisplayProgressionAchievement = ({ num, deno, className, height = "h-1" }: { num: number, deno: number, className?: string, height?: string }) => {
  const value = deno === 0 ? 100 : num * 100 / deno;
  const progressPercent = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("mt-1 w-full", className)}>
      <div className={cn("bg-gray-600 rounded-full w-full", height)}>
        <div
          className={cn("rounded-full transition-all duration-500", height)}
          style={{ width: `${progressPercent}%`, backgroundColor: progressPercent === 100 ? "#F59E0B" : "#6B7280" }}
        />
      </div>
      <div className="flex justify-between items-center w-full text-xs text-card-foreground mt-1">
        <p>{(num * 100 / deno).toFixed(2)}%</p>
        <p>{num} / {deno}</p>
      </div>
    </div>
  );
};

const SubAchievementDisplay = ({ subAchievement }: { subAchievement: Achievement }) => {
  const subUnlocked = isCompleted(subAchievement);
  const cardClasses = subUnlocked
    ? "bg-green-400/50 border border-[#26E251] "
    : "bg-secondary/50 border-gray-600 text-card-foreground grayscale opacity-80";

  return (
    <div className={cn("flex items-center text-xs p-2 rounded-md mt-1 border transition-colors hover:bg-secondary cursor-help", cardClasses)}>
      <div className="flex-grow truncate mr-2">{subAchievement.name}: {subAchievement.description}</div>
      {subUnlocked ? <FaCheck className="w-4 h-4 text-[#26E251] flex-shrink-0" /> : <FaLock className="w-4 h-4 text-gray-500 flex-shrink-0" />}
    </div>
  );
};

function DetailAchievement({ achievement }: {
  achievement: Achievement,
}) {
  const { allItems } = useItemsStore();;

  let achievementProgress;
  if (isCompleted(achievement)) {
    achievementProgress = achievement.subAchievements.length === 0 ? achievement.amount : achievement.subAchievements.length;
  } else if (achievement.subAchievements.length > 0) {
    achievementProgress = achievement.subAchievements.reduce((acc, curr) => acc + (isCompleted(curr) ? 1 : 0), 0);
  } else {
    achievementProgress = achievement.progress;
  }

  const amount = achievement.amount === -1 ? achievement.subAchievements.length : achievement.amount;

  let closestItemName = allItems.find((item) => item.value === constants.dictAchievementIdToIcon.get(achievement.icon))?.img ?? "unknown.webp";
  if (closestItemName === "barriere.webp" || closestItemName === "unknown.webp") {
    closestItemName = "unknown.webp";
  }

  const cardClasses = isCompleted(achievement)
    ? "bg-green-400/50 hover:bg-green-500/50 border border-[#26E251]"
    : "bg-secondary border border-gray-600 hover:bg-card";

  const CardContent = (
    <div className={cn("rounded-lg my-2 transition-all w-full", cardClasses)}>
      <AchievementInfo
        title={achievement.name}
        img={isCompleted(achievement) ? safeJoinPaths(constants.imgPathProfile, "completed.png") : `/AH_img/${closestItemName}`}
        value={achievement.description}
      >
        <DisplayProgressionAchievement num={achievementProgress} deno={amount} />
      </AchievementInfo>
    </div>
  );

  return (
    <HoverCard openDelay={200} closeDelay={150}>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">
          {CardContent}
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-fit overflow-y-auto p-2 ">
        <div className="space-y-1">
          <h4 className="text-xl font-bold mb-2 px-1 pb-1">
            {achievement.name} ({achievementProgress === -1 ? 0 : achievementProgress}/{amount})
          </h4>
          <div className="text-sm font-bold pb-1 px-1 pb-2">
            {achievement.description}
          </div>
          {orderBy(achievement.subAchievements, (e) => {
            const match = e.name.match(/\b[IVXLCDM]+\b/);
            const roman = match ? match[0] : "";
            return romanToInt(roman);
          }).map((a) => (
            <SubAchievementDisplay key={a.id} subAchievement={a} />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}