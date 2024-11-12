'use client'
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useRef, useState } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { CardTitle } from "@/components/ui/card.tsx";
import { formatPrice, GetAllFileNameInFolder, levenshteinDistance, safeJoinPaths } from "@/lib/misc.ts";
import { useTheme } from "next-themes";
import { Achievement, CategoryEnum } from "@/types";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { cn } from "@/lib/utils.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";

import Image from "next/image";
import AchievementInfo from "@/components/Profil/Achievement/DisplayAchievement.tsx";

export function DisplayProgressionCategory({ category }: { category: CategoryEnum }) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo)
    return null;

  const allAchievements = playerInfo.achievements.filter(achievement => achievement.category === category && achievement.icon);

  const totalCompleted = allAchievements.filter(achievement => achievement.completed).length;

  const total = allAchievements.length
  const value = totalCompleted * 100 / total;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full h-12 flex flex-row items-center justify-center gap-2">
        {totalCompleted}/{total}<AchievementsGlobalProgressBar value={value}/>
      </div>
    </div>
  );
}

export function AchievementsGlobalProgressBar({ value, showText = true }: { value: number, showText?: boolean }) {
  const textRef = useRef<SVGTextElement>(null);
  const [viewBoxState, setViewBoxState] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (textRef !== null && textRef.current !== null && value === 0) {
      const textWidth = textRef.current.getBoundingClientRect().width;
      const textHeight = textRef.current.getBoundingClientRect().height;

      let newX = 0;
      if (value === 0)
        newX = textWidth / 2 + 5;

      let newY = textHeight + (viewBoxState.height - textHeight) / 2;


      textRef.current.setAttribute("x", `${newX}`);
      textRef.current.setAttribute("y", `${newY}`);
    }
  }, [viewBoxState]);

  const renderCustomizedLabel = (props: any) => {
    const { x, y, height, value, viewBox } = props;

    let newX = 0;
    if (value !== 0)
      newX = (viewBox.width / value) * 50;


    return (
      <text ref={textRef} x={x + newX} y={y + height / 2} fill={theme === "dark" ? "#ffffff" : "#000000"}
            textAnchor="middle" dominantBaseline="middle"
            className="bg-red-500">
        {`${formatPrice(Math.floor(value))}%`}
      </text>
    );
  };

  const { theme } = useTheme();


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={[{ value: value, name: "Progression Globale" }]}
        margin={{
          top: 5, right: 0, left: 0, bottom: 5,
        }}
        layout={"vertical"}
      >
        <XAxis type="number" domain={[0, 100]} hide/>
        <YAxis type="category" dataKey="name" hide/>
        <Bar dataKey="value" fill="#26E251" background={{ fill: theme === "dark" ? '#323232' : "#A2A2A2" }}>
          {showText && <LabelList dataKey="value" content={renderCustomizedLabel}/>}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}


export function DisplayProgressionGlobal() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo)
    return null;

  const totalCompleted = playerInfo.achievements.filter(achievement => achievement.completed).length;
  const total = playerInfo.achievements.filter((achievement) => achievement.icon).length;

  const value = totalCompleted * 100 / total;

  return (
    <>
      <CardTitle className="flex flex-row justify-between place-items-end">
        <div className="text-5xl text-primary font-bold">
          Achievements
        </div>
        <div className="text-xl font-bold">
          Progression Globale : {totalCompleted} / {total}
        </div>
      </CardTitle>
      <div className="flex flex-col items-center w-full">
        <div className="h-20 w-full">
          <AchievementsGlobalProgressBar value={value}/>
        </div>
      </div>
    </>
  );
}

function AchievementSelectorCategory({ category, selectedCategory, setSelectedCategory }: {
  category: CategoryEnum,
  selectedCategory: CategoryEnum,
  setSelectedCategory: (category: CategoryEnum) => void
}) {

  let imgPath = "";
  switch (category) {
    case CategoryEnum.HOW_TO_START:
      imgPath = "AH_img/wood_pickaxe.png";
      break;
    case CategoryEnum.JOBS:
      imgPath = "AH_img/stone_pickaxe.png";
      break;
    case CategoryEnum.FACTION:
      imgPath = "AH_img/diamond_sword.png";
      break;
    case CategoryEnum.ATTACK_DEFENSE:
      imgPath = "AH_img/tnt.png";
      break;
    case CategoryEnum.ECONOMY:
      imgPath = "AH_img/gold_ingot.png";
      break;
      case CategoryEnum.ALLIANCE:
      imgPath = "AH_img/goggles_of_community.png";
      break;
    case CategoryEnum.OTHERS:
      imgPath = "AH_img/ender_pearl.png";
      break
    default:
      imgPath = "unknown.png";
      break;
  }

  return <button
    className={cn("flex bg-secondary hover:border-primary/65 hover:border-4 hover:scale-105 duration-100  cursor-pointer", selectedCategory === category && "border-primary border-4 hover:border-primary")}
    onClick={() => setSelectedCategory(CategoryEnum[category])}>
    <SmallCardInfo title={category} img={imgPath} className="w-96" unoptimized>
      <DisplayProgressionCategory category={category}/>
    </SmallCardInfo>
  </button>
}

export function AchievementBody() {

  const [selectedCategory, setSelectedCategory] = useState<CategoryEnum>(CategoryEnum.HOW_TO_START);

  return <>
    <div className="pr-4">
      <h1>Catégorie</h1>
      {Object.keys(CategoryEnum).map((category, index) => {
        return <AchievementSelectorCategory key={category + index}
                                            category={Object.keys(CategoryEnum).find((c) => c === category) as CategoryEnum}
                                            selectedCategory={selectedCategory}
                                            setSelectedCategory={setSelectedCategory}/>
      })}
    </div>
    <div className="w-full">
      <h1>Achievements</h1>
      <ScrollArea className="h-[calc(100vh-20vh)]">
        <DisplayAllAchievementInCategory category={selectedCategory}/>
        <ScrollBar orientation="vertical"/>
      </ScrollArea>
    </div>
  </>
}


export function DisplayAllAchievementInCategory({ category }: { category: CategoryEnum }) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo)
    return null;


  const allAchivements = playerInfo.achievements.filter(achievement => achievement.category === category && achievement.icon)
  allAchivements.sort((a, b) => a.id.localeCompare(b.id))

  console.log(allAchivements)

  const closestItemNames = allAchivements.map(achievement => {
    if(!achievement.icon) return "unknown"
    let achievementIcon = achievement.icon.replace("palamod:", "").replace("item.", "").replace("minecraft:", "").replace("tile.", "").replace("customnpc:", "").replace("guardiangolem:", "")

    return GetAllFileNameInFolder().reduce((acc, curr) => {
      if (levenshteinDistance(curr, achievementIcon) < levenshteinDistance(acc, achievementIcon)) {
        return curr;
      } else {
        return acc;
      }
    });
  });


  // TODO: achievement.icon
  return <div className="flex flex-col gap-4">
    {allAchivements.map((achievement, index) => {
      return <DetailAchievement key={achievement.name + index} achievement={achievement}
                                closestItemName={closestItemNames[index]}/>
    })}
  </div>
}

function DetailAchievement({ achievement, closestItemName }: { achievement: Achievement, closestItemName: string }) {
  const [showSubAchievements, setShowSubAchievements] = useState(false);
  let achievementProgress;
  if (achievement.completed) {
    achievementProgress = achievement.subAchievements.length === 0 ? achievement.amount : achievement.subAchievements.length;
  }
  else if(achievement.subAchievements.length > 0)
    achievementProgress = achievement.subAchievements.reduce((acc, curr) => acc + curr.completed, 0)
  else
    achievementProgress = achievement.progress;


  const amount = achievement.amount === -1 ? achievement.subAchievements.length : achievement.amount;
  const value = achievementProgress * 100 / amount;

  let arrowPath = achievement.subAchievements.length === 0 ? "" : (showSubAchievements ? "/ProfileImg/arrow_top.png" : "/ProfileImg/arrow_down.png");

  return <div onClick={() => achievement.subAchievements.length !== 0 && setShowSubAchievements(!showSubAchievements)}
              className={cn("border-2 border-secondary-foreground  px-2", achievement.completed && "bg-green-400/50")}>
    <AchievementInfo title={achievement.name.toUpperCase()}
                     img={achievement.completed ? safeJoinPaths("/ProfileImg/", `completed.png`) : safeJoinPaths("/AH_img/", `${closestItemName}.png`)}
                     value={achievement.description}
                     className="w-full" unoptimized
                     arrowPath={arrowPath}

    >
      <DisplayProgressionAchievement achievementProgress={achievementProgress} amount={amount} value={value}/>
    </AchievementInfo>

    {showSubAchievements &&
      <div className="pb-2">
        {achievement.subAchievements.map((a) => <SubAchievementDisplay key={a.id} subAchievement={a}/>)}
      </div>}
  </div>

}

export function DisplayProgressionAchievement({ achievementProgress, amount, value }: {
  achievementProgress: number,
  amount: number,
  value: number
}) {


  return <div className="flex flex-col items-center w-full">
    <div className="w-full h-12 flex flex-row items-center justify-center gap-2">
      {achievementProgress}/{amount}<AchievementsGlobalProgressBar value={value} showText={true}/>
    </div>
  </div>
}

function SubAchievementDisplay({ subAchievement }: { subAchievement: Achievement }) {
  const imgPath = subAchievement.completed ? "/ProfileImg/sub_checked.png" : "/ProfileImg/sub_unchecked.png";

  return <div className="flex flex-row gap-4 items-center pl-10">
    <Image width={20} height={20} src={imgPath} alt={subAchievement.completed ? "checked" : "unchecked"}/>
    {subAchievement.name + " : " + subAchievement.description}
  </div>
}