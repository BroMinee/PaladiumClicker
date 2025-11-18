import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white dark:bg-gray-800 p-4 rounded-lg text-card-foreground",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
