import { cn } from "@/lib/utils";

/**
 * Renders text with a gradient from primary color to destructive color.
 *
 * @param children Text or elements to apply the gradient to.
 * @param className Optional additional classes.
 */
export const GradientText = ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("bg-clip-text text-transparent bg-gradient-to-tr from-primary to-destructive/85", className)}
      {...props}
    >
      {children}
    </span>
  );
};
