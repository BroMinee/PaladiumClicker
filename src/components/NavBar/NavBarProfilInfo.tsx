"use client";

import ToggleTheme from "@/components/shared/ToggleTheme.tsx";
import Setting from "@/components/shared/Setting.tsx";
import React from "react";
import { useProfileStore } from "@/stores/use-profile-store.ts";
import { LoginDiscord, LogoutDiscord } from "@/components/NavBar/LoginLogoutDiscord.tsx";

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
      <LogoutDiscord/>
      <div className="px-5 flex flex-row justify-between">
        <ToggleTheme/>
        <Setting/>
      </div>

    </div>
  );
}