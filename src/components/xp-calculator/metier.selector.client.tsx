"use client";
import { MetierKey } from "@/types";
import { Button } from "@/components/ui/button-v2";
import { prettyJobName } from "@/lib/misc";
import { cn } from "@/lib/utils";
import { MetierComponentWrapper } from "../metier-list";
import { useXpCalcStore } from "@/stores/use-xp-calc-store";

const JAVA_METIERS: MetierKey[] = ["miner", "farmer", "hunter", "alchemist"];
const BEDROCK_METIERS: MetierKey[] = ["miner", "farmer", "hunter"];

interface MetierSelectorProps {
  metier: MetierKey;
  setMetier: (metier: MetierKey) => void;
}

/**
 * Display the jobs and their name under, enable selection to set the active one.
 * Alchemist is hidden in Bedrock mode (doesn't exist on that platform).
 * @param metier current job
 * @param setMetier callback to the active jobs
 */
export const MetierSelector = ({ metier, setMetier }: MetierSelectorProps) => {
  const { platform, metier: xpCalcMetiers } = useXpCalcStore();
  const metierKeys = platform === "bedrock" ? BEDROCK_METIERS : JAVA_METIERS;

  return (
    <div className="flex justify-center pt-0">
      <div className={cn("grid grid-cols-2 gap-4 ",
        platform === "java" ? "sm:grid-cols-4" : "sm:grid-cols-3")
      }>
        {metierKeys.map((key) => {
          const isSelected = metier === key;
          return (
            <Button
              key={key}
              onClick={() => setMetier(key)}
              className={cn("flex flex-col group relative w-full h-auto p-2 rounded-xl transition-all duration-300 cursor-pointer",
                isSelected ? "bg-indigo-500/30 border border-indigo-500 hover:bg-indigo-700"
                  : "bg-card border border-secondary text-card-foreground hover:bg-secondary")}
              title={prettyJobName(key)}
            >
              <MetierComponentWrapper metierKey={key} metierData={xpCalcMetiers[key]} />
              <p className={`text-xs font-semibold mt-1 text-center truncate
                              ${isSelected ? "" : "text-card-foreground group-hover:"}`}>{prettyJobName(key)}</p>
            </Button>
          );
        })}
      </div>
    </div>
  );
};