"use client";
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useRef, useState } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { CardTitle } from "@/components/ui/card";
import { formatPrice, safeJoinPaths } from "@/lib/misc";
import { useTheme } from "next-themes";
import { Achievement, CategoryEnum } from "@/types";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Image from "next/image";
import { AchievementInfo, DisplayCategoryCard } from "@/components/Profil/Achievement/DisplayAchievement";
import { constants } from "@/lib/constants";

function DisplayProgressionCategory({ category }: { category: CategoryEnum }) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  const allAchievements = playerInfo.achievements.filter(achievement => achievement.category === category && achievement.icon);

  const totalCompleted = allAchievements.filter(achievement => achievement.completed).length;

  const total = allAchievements.length;
  const value = totalCompleted * 100 / total;

  return (
    <div className="flex-col items-center w-full hidden sm:flex">
      <div className="w-full h-10 flex flex-row items-center justify-center gap-2 font-mc">
        {totalCompleted}/{total}<AchievementsGlobalProgressBar value={value}/>
      </div>
    </div>
  );
}

function AchievementsGlobalProgressBar({ value, showText = true }: { value: number, showText?: boolean }) {
  const textRef = useRef<SVGTextElement>(null);
  const [viewBoxState] = useState({ width: 0, height: 0 });
  if (value === 0) {
    value = 0.00001;
  }

  useEffect(() => {
    if (textRef !== null && textRef.current !== null && value === 0) {
      const textWidth = textRef.current.getBoundingClientRect().width;
      const textHeight = textRef.current.getBoundingClientRect().height;

      let newX = 0;
      if (value === 0) {
        newX = textWidth / 2 + 5;
      }

      const newY = textHeight + (viewBoxState.height - textHeight) / 2;

      textRef.current.setAttribute("x", `${newX}`);
      textRef.current.setAttribute("y", `${newY}`);
    }
  }, [viewBoxState, value]);

  const renderCustomizedLabel = (props: any) => {
    const { x, y, height, value, viewBox } = props;

    let newX = 0;
    if (value !== 0) {
      newX = (viewBox.width / value) * 50;
    }

    return (
      <text ref={textRef} x={x + newX} y={y + height / 2} fill={theme === "dark" ? "#ffffff" : "#000000"}
        textAnchor="middle" dominantBaseline="middle"
        className="bg-red-500 font-mc">
        {`${formatPrice(Math.floor(value))} %`}
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
        <Bar dataKey="value" fill="#26E251" background={{ fill: theme === "dark" ? "#323232" : "#A2A2A2" }}>
          {showText && <LabelList dataKey="value" content={renderCustomizedLabel}/>}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Shows the user's global achievement progression with a progress bar.
 */
export function DisplayProgressionGlobal() {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  const totalCompleted = playerInfo.achievements.filter(achievement => achievement.completed).length;
  const total = playerInfo.achievements.filter((achievement) => achievement.icon).length;

  const value = totalCompleted * 100 / total;

  return (
    <>
      <CardTitle className="flex xl:flex-row flex-col justify-between items-center xl:place-items-end font-mc">
        <h1 className="text-3xl sm:text-5xl text-primary font-bold">
          Achievements
        </h1>
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
  let displayText = "";
  switch (category) {
  case CategoryEnum.HOW_TO_START:
    imgPath = "AH_img/wood_pickaxe.webp";
    displayText = "Premier pas";
    break;
  case CategoryEnum.JOBS:
    imgPath = "AH_img/stone_pickaxe.webp";
    displayText = "Métiers";
    break;
  case CategoryEnum.FACTION:
    imgPath = "AH_img/diamond_sword.webp";
    displayText = "Faction";
    break;
  case CategoryEnum.ATTACK_DEFENSE:
    imgPath = "AH_img/tnt.webp";
    displayText = "Pillage & Défense";
    break;
  case CategoryEnum.ECONOMY:
    imgPath = "AH_img/gold_ingot.webp";
    displayText = "Economie";
    break;
  case CategoryEnum.ALLIANCE:
    imgPath = "AH_img/goggles_of_community.webp";
    displayText = "Ordre vs Chaos";
    break;
  case CategoryEnum.OTHERS:
    imgPath = "AH_img/ender_pearl.webp";
    displayText = "Divers";
    break;
  default:
    imgPath = "unknown.webp";
    displayText = "Inconnu";
    break;
  }

  return <button
    className={cn("flex bg-secondary hover:border-gray-500 border-4 duration-100 cursor-pointer justify-center", selectedCategory === category && "border-primary border-4 hover:border-primary")}
    onClick={() => setSelectedCategory(CategoryEnum[category])}>
    <DisplayCategoryCard title={displayText} img={imgPath} unoptimized>
      <DisplayProgressionCategory category={category}/>
    </DisplayCategoryCard>
  </button>;
}

/**
 * Renders the achievements UI: category list (left) + achievements of selected category (right).
 * @param itemList - the list of know item in the DB.
 */
export function AchievementBody({ itemList }: { itemList: { img: string, value: string }[] }) {

  const [selectedCategory, setSelectedCategory] = useState<CategoryEnum>(CategoryEnum.HOW_TO_START);

  return <>
    <ScrollArea className="overflow-visible">
      <ScrollBar orientation="vertical"/>
      <div className="pr-3">
        <h3 className="font-mc">Catégorie</h3>
        <div className="flex flex-col gap-1">
          {Object.keys(CategoryEnum).map((category, index) => {
            return <AchievementSelectorCategory key={category + index}
              category={Object.keys(CategoryEnum).find((c) => c === category) as CategoryEnum}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}/>;
          })}
        </div>

      </div>
    </ScrollArea>
    <ScrollArea className="w-full overflow-visible">
      <div className="w-full pr-3">
        <h3 className="font-mc">Achievements</h3>
        <DisplayAllAchievementInCategory category={selectedCategory} itemList={itemList}/>
      </div>
      <ScrollBar orientation="vertical"/>
    </ScrollArea>
  </>;
}

function DisplayAllAchievementInCategory({ category, itemList }: {
  category: CategoryEnum,
  itemList: { img: string, value: string }[]
}) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  const allAchivements = playerInfo.achievements.filter(achievement => achievement.category === category && achievement.icon);
  allAchivements.sort((a, b) => a.id.localeCompare(b.id));

  // TODO: achievement.icon
  return <div className="flex flex-col gap-4">
    {allAchivements.map((achievement, index) => {
      return <DetailAchievement key={achievement.name + index} achievement={achievement} itemList={itemList}/>;
    })}
  </div>;
}

function DetailAchievement({ achievement, itemList }: {
  achievement: Achievement,
  itemList: { img: string, value: string }[]
}) {
  const [showSubAchievements, setShowSubAchievements] = useState(false);
  let achievementProgress;
  if (achievement.completed) {
    achievementProgress = achievement.subAchievements.length === 0 ? achievement.amount : achievement.subAchievements.length;
  } else if (achievement.subAchievements.length > 0) {
    achievementProgress = achievement.subAchievements.reduce((acc, curr) => acc + (curr.completed ? 1 : 0), 0);
  } else {
    achievementProgress = achievement.progress;
  }

  const amount = achievement.amount === -1 ? achievement.subAchievements.length : achievement.amount;
  const value = achievementProgress * 100 / amount;

  const arrowPath = achievement.subAchievements.length === 0 ? "" : (showSubAchievements ? safeJoinPaths(constants.imgPathProfile, "/arrow_top.png") : safeJoinPaths(constants.imgPathProfile,"/arrow_down.png"));

  let closestItemName = itemList.find((item) => item.value === constants.dictAchievementIdToIcon.get(achievement.icon))?.img ?? "unknown.webp";

  if (closestItemName === "unknown.webp") {
    console.log("Unknown item : " + achievement.icon);
  }

  if (closestItemName === "barriere.webp") {
    closestItemName = "unknown.webp";
  }

  return <div onClick={() => achievement.subAchievements.length !== 0 && setShowSubAchievements(!showSubAchievements)}
    className={cn("border-2 border-secondary-foreground px-2 animate-fade-in", achievement.completed && "bg-green-400/50 hover:bg-green-500/50")}>
    <AchievementInfo title={achievement.name}
      img={achievement.completed ? safeJoinPaths(constants.imgPathProfile,"completed.png") : `/AH_img/${closestItemName}`}
      value={achievement.description}
      arrowPath={arrowPath}

    >
      <DisplayProgressionAchievement achievementProgress={achievementProgress} amount={amount} value={value}/>
    </AchievementInfo>

    {showSubAchievements &&
      <div className="pb-2">
        {achievement.subAchievements.map((a) => <SubAchievementDisplay key={a.id} subAchievement={a}/>)}
      </div>}
  </div>;

}

function DisplayProgressionAchievement({ achievementProgress, amount, value }: {
  achievementProgress: number,
  amount: number,
  value: number
}) {

  return <div className="flex flex-col items-center w-full">
    <div className="w-full flex flex-row items-center justify-end gap-2">
      {achievementProgress}/{amount}
      <div className="xl:w-60 w-32 hidden sm:block h-12">
        <AchievementsGlobalProgressBar value={value} showText={true}/>
      </div>
    </div>
  </div>;
}

function SubAchievementDisplay({ subAchievement }: { subAchievement: Achievement }) {
  const imgPath = subAchievement.completed ? safeJoinPaths(constants.imgPathProfile, "sub_checked.png") : safeJoinPaths(constants.imgPathProfile,"sub_unchecked.png");

  return <div className="flex flex-row gap-4 items-center pl-10">
    <Image width={20} height={20} src={imgPath} alt={subAchievement.completed ? "checked" : "unchecked"}/>
    {subAchievement.name + " : " + subAchievement.description}
  </div>;
}