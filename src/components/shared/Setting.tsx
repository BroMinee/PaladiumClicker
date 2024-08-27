import { IoSettings } from "react-icons/io5";

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

export default function Setting() {

  const { settings, setFallingImage } = useSettingsStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <IoSettings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          className="flex items-center justify-between"
        >
          <span>Images tombantes</span>
          <Switch checked={settings.fallingImage} onCheckedChange={setFallingImage} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}
