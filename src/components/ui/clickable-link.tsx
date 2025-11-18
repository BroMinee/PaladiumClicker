import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * <a> wrapper that handle hover transition
 * @param href link to redirect to
 * @param className Optional classname
 * @param children children
 */
export function ClickableLink({ href, className, children }: { href: string,className?: string, children: ReactNode }) {
  return <a href={href}
    rel="noopener noreferrer"
    className={cn("hover:text-orange-700 transform transition-transform ease-in-out hover:scale-125 duration-300", className)}
  >
    {children}
  </a>;
}