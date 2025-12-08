"use client";
import { GenericSectionTabs, TabData } from "../shared/section.client";
import { MarketSection } from "./market.clients";
import { AchievementSection } from "./achievements.client";
import { FriendsSection } from "./friends.client";
import { ProfileSection } from "./profile-section.client";
import { FactionSection } from "./faction/faction-section.client";
import { getAllItemsServerAction } from "@/lib/api/apiServerAction";
import { useEffect, useState } from "react";
import { OptionType } from "@/types";
import { SetItemsStats } from "../shared/set-items-state.client";

/**
 * Display the profile section tabs and tabs content.
 */
export function ProfileSectionSelector() {
  const [allItems, setAllItems] = useState<OptionType[]>([]);

  useEffect(() => {
    getAllItemsServerAction().then(setAllItems);
  }, []);

  const tabs: TabData<"Profil" | "Faction" | "Amis" | "Succès" | "Hôtel de Vente">[] = [
    { key: "Profil", label: "Profil", content: () => <ProfileSection/> },
    { key: "Faction", label: "Faction", content: () => <FactionSection/> },
    { key: "Amis", label: "Amis", content: () => <FriendsSection/> },
    { key: "Succès", label: "Succès", content: () => <SetItemsStats allItems={allItems}><AchievementSection/></SetItemsStats> },
    { key: "Hôtel de Vente", label: "Hôtel de Vente", content: () => <SetItemsStats allItems={allItems}><MarketSection/></SetItemsStats> },
  ];

  return (
    <GenericSectionTabs tabs={tabs}/>
  );
}

