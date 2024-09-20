'use client'
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useRef, useState } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { CardTitle } from "@/components/ui/card.tsx";
import { formatPrice } from "@/lib/misc.ts";
import { useTheme } from "next-themes";
import { Achievement, CategoryEnum } from "@/types";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { cn } from "@/lib/utils.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";


export function DisplayProgressionCategory({ category }: { category: CategoryEnum }) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo)
    return null;

  const allAchivements = playerInfo.achievements.data.filter(achievement => achievement.category === category);

  const totalCompleted = allAchivements.filter(achievement => achievement.completed).length;

  const total = allAchivements.length
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
  }, [textRef.current, viewBoxState]);

  const renderCustomizedLabel = (props: any) => {
    const { x, y, height, value, viewBox } = props;
    setViewBoxState(viewBox);

    let newX = 0;
    if (value !== 0)
      newX = (viewBox.width / value) * 50;


    return (
      <text ref={textRef} x={x + newX} y={y + height / 2} fill={theme === "dark" ? "#ffffff" : "#000000"}
            textAnchor="middle" dominantBaseline="middle"
            className="bg-red-500">
        {`${formatPrice(value)}%`}
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

  const totalCompleted = playerInfo.achievements.data.filter(achievement => achievement.completed).length;

  const value = totalCompleted * 100 / playerInfo.achievements.totalCount;

  return (
    <>
      <CardTitle className="flex flex-row justify-between place-items-end">
        <div className="text-5xl text-primary font-bold">
          Achievements
        </div>
        <div className="text-xl font-bold">
          Progression Globale : {totalCompleted} / {playerInfo.achievements.totalCount}
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
    <SmallCardInfo title={category} img={imgPath} className="w-96">
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

  const allAchivements = playerInfo.achievements.data.filter(achievement => achievement.category === category);

  console.log(playerInfo.achievements.data)

  // TODO: achievement.icon
  return <div className="flex flex-col gap-4">
    {allAchivements.map((achievement, index) => {
      return <SmallCardInfo key={achievement.name + index} title={achievement.name} img={"AH_img/paladium_ingot.png"}
                            value={achievement.description}
                            className="w-full">
        <DisplayProgressionAchievement achievement={achievement}/>
      </SmallCardInfo>
    })}
  </div>
}

export function DisplayProgressionAchievement({ achievement }: { achievement: Achievement }) {
  const value = achievement.completed ? 100 : achievement.progress * 100 / achievement.amount;

  return <div className="flex flex-col items-center w-full">
    <div className="w-full h-12 flex flex-row items-center justify-center gap-2">
      {achievement.progress}/{achievement.amount}<AchievementsGlobalProgressBar value={value} showText={true}/>
    </div>
  </div>
}