"use client";
import { AxisDomain, Dataset } from "@/types";
import { Button } from "@/components/ui/button-v2";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { cn } from "@/lib/utils";

/**
 * Component that display a legends to the ranking graph.
 * - Handle double click to highlight a curve
 * - Handle simple click to show/hide a curve
 */
export function GraphLegends<Key extends AxisDomain,Value extends AxisDomain>({ data, toggleVisibility, handleHighlight, className}: { data: Dataset<Key, Value>[], toggleVisibility: (plt: Dataset<Key, Value>) => void, handleHighlight: (plt: Dataset<Key, Value>) => void, className?: string })  {
  return (<div className={cn("w-full bg-card p-4 rounded-lg", className)}>
    <h3 className="text-lg font-semibold mb-2">Légende</h3>
    <ul className="space-y-2 max-h-[300px] overflow-y-auto">
      {data.map(plt => {
        const isHidden = !plt.visibility;

        return (
          <Button
            variant="none"
            className="flex justify-start text-left items-center overflow-hidden py-2 px-2 w-full h-full bg-secondary rounded-xl"
            key={plt.id}
            onClick={() => toggleVisibility(plt)} onDoubleClick={() => handleHighlight(plt)}
          >
            <>
              <div
                className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: plt.color, opacity: isHidden ? 0.2 : 1 }}
              />
              <div className="flex flex-row justify-between items-center w-full mouse-pointer">
                <span>
                  {plt.name}
                </span>
                <div
                  className="p-1 bg-secondary"
                  onClick={(e) => {
                    e.stopPropagation(); toggleVisibility(plt);
                  }}
                  title={isHidden ? "Afficher la courbe" : "Cacher la courbe"}
                >
                  {isHidden ? <FaRegEyeSlash /> : <FaRegEye />}
                </div>
              </div>
            </>

          </Button>
        );
      })}
    </ul>
  </div>);
}