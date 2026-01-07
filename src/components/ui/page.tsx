import * as React from "react"
import { cn } from "@/lib/utils"

const PageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("flex flex-col items-center text-center space-y-4 mb-4", className)}
    {...props}
  />
))
PageHeader.displayName = "PageHeader"

const PageHeaderHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "text-4xl md:text-5xl font-extrabold text-foreground tracking-tight",
      className
    )}
    {...props}
  />
))
PageHeaderHeading.displayName = "PageHeaderHeading"

const PageHeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-secondary-foreground max-w-2xl text-lg leading-relaxed",
      className
    )}
    {...props}
  />
))
PageHeaderDescription.displayName = "PageHeaderDescription"

export { PageHeader, PageHeaderHeading, PageHeaderDescription }