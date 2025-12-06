"use client";
import { MetierKey } from "@/types";
import { Button } from "@/components/ui/button-v2";
import { prettyJobName } from "@/lib/misc";
import { cn } from "@/lib/utils";
import { MetierComponentWrapper } from "../MetierList";

interface MetierSelectorProps {
  metier: MetierKey;
  setMetier: (metier: MetierKey) => void;
}

/**
 * Display the 4 jobs and there name under, enable selection to set the active one.
 * @param metier current job
 * @param setMetier callback to the active jobs
 */
export const MetierSelector = ({ metier, setMetier }: MetierSelectorProps) => (
  <div className="flex justify-center pt-0">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {(["miner", "farmer", "hunter", "alchemist"] as MetierKey[]).map((key) => {
        const isSelected = metier === key;
        return (
          <Button
            key={key}
            onClick={() => setMetier(key as MetierKey)}
            className={cn("flex flex-col group relative w-full h-auto p-2 rounded-xl transition-all duration-300 cursor-pointer",
              isSelected ? "bg-indigo-500/30 border border-indigo-500 text-white hover:bg-indigo-700"
                : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700")}
            title={prettyJobName(key)}
          >
            <MetierComponentWrapper metierKey={key as MetierKey} />
            <p className={`text-xs font-semibold mt-1 text-center truncate 
                            ${isSelected ? "text-white" : "text-gray-400 group-hover:text-white"}`}>{prettyJobName(key)}</p>
          </Button>
        );
      })}
    </div>
  </div>
);