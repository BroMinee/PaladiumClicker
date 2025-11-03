"use client";
import { IoSettings } from "react-icons/io5";
import { constants } from "@/lib/constants.ts";

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
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { useEffect } from "react";

export default function Setting() {

  const { settings, setFallingImage, setDefaultProfile } = useSettingsStore();
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
      <DropdownMenuContent align="end" className="w-56 z-[101]">
        <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          className="flex items-center justify-between"
        >
          <span>Images tombantes</span>
          <Switch checked={settings.fallingImage} onCheckedChange={setFallingImage}/>
        </DropdownMenuItem>
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
