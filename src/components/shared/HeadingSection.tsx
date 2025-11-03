import { cn } from "@/lib/utils";

/**
 * Section heading `<h2>` with default styling.
 *
 * @param className Extra classes to extend or override the default styles.
 */
const HeadingSection = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2 className={cn("font-semibold text-xl text-primary-foreground", className)} {...props} />
  );
};

export default HeadingSection;