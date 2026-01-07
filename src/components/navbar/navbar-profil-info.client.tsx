"use client";

import { ToggleTheme } from "@/components/shared/toggle-theme.client";
import { Setting } from "@/components/shared/setting.client";
import React from "react";
import { useProfileStore } from "@/stores/use-profile-store";
import { LoginDiscord, NavBarProfileInfo } from "@/components/navbar/login-logout-discord.client";

/**
 * Displays the user's profile information in the bottom navbar, or login options if not logged in.
 *
 * Behavior:
 * - If user is logged, shows the user's profile details along with theme toggle and settings.
 * - If user is not logged, shows the Discord login button, theme toggle, and settings.
 */
export function NavBarProfilInfo() {
  const { profileInfo } = useProfileStore();
  if (!profileInfo) {
    return (
      <div className="flex justify-between flex-row w-full px-5 py-2">
        <LoginDiscord/>
        <ToggleTheme/>
        <Setting/>
      </div>
    );
  }

  return (
    <div className="flex justify-between flex-col w-full py-2 gap-1">
      <NavBarProfileInfo/>
      <div className="px-5 flex flex-row justify-between">
        <ToggleTheme/>
        <Setting/>
      </div>

    </div>
  );
}