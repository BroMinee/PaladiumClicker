import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Link from "next/link";

/**
 * <a> wrapper that handle hover transition
 * @param href link to redirect to
 * @param className Optional classname
 * @param children children
 */
export function ClickableLink({ href, className, children }: { href: string,className?: string, children: ReactNode }) {
  return <Link href={href}
    rel="noopener noreferrer"
    className={cn("hover:text-orange-700 transform transition-transform ease-in-out hover:scale-125 duration-300", className)}
  >
    {children}
  </Link>;
}