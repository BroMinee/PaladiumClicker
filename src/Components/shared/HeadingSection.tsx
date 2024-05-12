import { cn } from "@/lib/utils";

interface HeadingSectionProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const HeadingSection = ({ className, ...props }: HeadingSectionProps) => {
  return (
    <h2 className={cn("font-semibold text-xl", className)} {...props} />
  );
}

export default HeadingSection;