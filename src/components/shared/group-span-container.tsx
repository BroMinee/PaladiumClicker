import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

interface GroupedSpanContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  group: React.ReactNode;
}

/**
 * Renders the children and a group element inside a <span> element, which is wrapped by a <div>
 * that is specifically assigned the "group" class.
 */

export const GroupedSpanContainer = forwardRef<HTMLDivElement, GroupedSpanContainerProps>(
  ({ children, group, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex relative group items-center justify-center", className)}
        {...props}
      >
        {children}
        <span className='absolute bottom-full mb-2 w-fit py-1 px-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center whitespace-nowrap'>
          {group}
        </span>
      </div>
    );
  }
);

GroupedSpanContainer.displayName = "GroupedSpanContainer";