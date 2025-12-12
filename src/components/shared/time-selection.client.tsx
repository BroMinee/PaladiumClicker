"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button-v2";
import { ReactNode } from "react";

interface TimeSelection<Key extends string, Value extends ReactNode> {
  selected: Key,
  timeRanges: { key: Key, label: Value }[],
  callback: (t: Key) => void
}

/**
 * Handle range selection changes
 * @param selected current range selected
 * @param timeRanges available timeRanges
 * @param callback callback function when clicking on a range
 */
export function TimeSelection<Key extends string, Value extends ReactNode>({ selected, timeRanges, callback }: TimeSelection<Key, Value>) {
  return (<div>
    <div className="flex flex-wrap gap-2 rounded-lg bg-background p-2 max-w-md">
      {timeRanges.map(range => (
        <Button
          key={range.key}
          onClick={() => callback(range.key)}
          className={cn("font-bold py-2 px-4 rounded transition-colors", selected === range.key ? "bg-primary" : "bg-secondary")}
        >
          {range.label}
        </Button>
      ))}
    </div>
  </div>);
}