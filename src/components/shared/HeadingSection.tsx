import { cn } from "@/lib/utils";

const HeadingSection = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2 className={cn("font-semibold text-xl text-primary-foreground", className)} {...props} />
  );
};

export default HeadingSection;