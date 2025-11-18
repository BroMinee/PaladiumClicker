"use client";
import { GenericSectionTabs, TabData } from "../shared/section.client";
import { MarketSection } from "./market.clients";
import { AchievementSection } from "./achievements.client";
import { FriendsSection } from "./friends.client";
import { ProfileSection } from "./profile-section.client";
import { FactionSection } from "./faction/faction-section.client";

/**
 * Display the profile section tabs and tabs content.
 */
export function ProfileSectionSelector() {
  const tabs: TabData<"Profil" | "Faction" | "Amis" | "Succès" | "Hôtel de Vente">[] = [
    { key: "Profil", label: "Profil", content: () => <ProfileSection/> },
    { key: "Faction", label: "Faction", content: () => <FactionSection/> },
    { key: "Amis", label: "Amis", content: () => <FriendsSection/> },
    { key: "Succès", label: "Succès", content: () => <AchievementSection/> },
    { key: "Hôtel de Vente", label: "Hôtel de Vente", content: () => <MarketSection/> },
  ];

  return (
    <GenericSectionTabs tabs={tabs}/>
  );
}

