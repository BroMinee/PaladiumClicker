import { Button } from "@/components/ui/button.tsx";
import { IoSettings } from "react-icons/io5";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { useSettings } from "@/components/shared/SettingsProvider.tsx";

export default function Setting() {

  const { settings, setFalling, } = useSettings();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <IoSettings/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="justify-center align-middle flex">
        <Button className={settings.fallingImage ? "bg-red-500" : "bg-green-500"}
                onClick={() => setFalling(!settings.fallingImage)}>{!settings.fallingImage ? "Activer les images tombantes" : "Désactiver les images tombantes"}
        </Button>
      </PopoverContent>
    </Popover>

  );
}
