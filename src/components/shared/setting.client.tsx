"use client";
import { IoSettings } from "react-icons/io5";
import { constants } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores/use-settings-store";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useEffect } from "react";

/**
 * Renders the settings dropdown menu allowing the user to toggle visual and profile options.
 * Includes controls for enabling/disabling falling images and using an empty default profile.
 */
export function Setting() {

  const { settings, setDefaultProfile } = useSettingsStore();
  const { setDefaultProfile: setDefaultProfileLocal, data: playerInfo } = usePlayerInfoStore();

  useEffect(() => {
    if (settings.defaultProfile && playerInfo?.username !== constants.defaultUsername) {
      setDefaultProfileLocal();
    }
  }, [settings.defaultProfile, playerInfo, setDefaultProfileLocal]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" id="settings-button">
          <IoSettings/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-[101]" side="top">
        <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          className="flex items-center justify-between"
        >
          <span>Utiliser un profil vide</span>
          <Switch checked={settings.defaultProfile} onCheckedChange={setDefaultProfile}/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}
