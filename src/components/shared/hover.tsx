
import { cn } from "@/lib/utils";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import React from "react";
type HoverCardProps = React.ComponentProps<typeof HoverCardPrimitive.Root> & {
  className?: string
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const HoverCard = ({ children, className, ...props }: HoverCardProps) => (
  <HoverCardPrimitive.Root {...props}>
    <div className={className}>
      {children}
    </div>
  </HoverCardPrimitive.Root>
);

export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border border-gray-700 bg-gray-800 p-4 text-white shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      className
    )}
    {...props}
  />
));

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;