'use client';
import React from "react";
import constants from "@/lib/constants.ts";
import { safeJoinPaths } from "@/lib/misc.ts";
import { navigate } from '@/components/actions';
import { useSettingsStore } from "@/stores/use-settings-store.ts";
import { Switch } from "@/components/ui/switch.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FaInfoCircle } from "react-icons/fa";

export default function ImportOfflineProfil() {

  const handleCheckChange = (checked: boolean) => {
    setDefaultProfile(checked);
    if (checked) {
      navigate(safeJoinPaths(constants.optimizerClickerPath, "Profil_vide"));
    }
  };

  const { settings, setDefaultProfile } = useSettingsStore();
  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <FaInfoCircle className="inline-block h-4 w-4"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          Le profil vide vous permet de saisir manuellement vos métiers, vos bâtiments, vos améliorations et autres pour
          pouvoir continuer à utiliser le site quand l&apos;API a un soucis
        </PopoverContent>
      </Popover>
      <span>Utiliser un profil vide</span>
      <Switch checked={settings.defaultProfile} onCheckedChange={handleCheckChange}/>

    </div>
  );
}