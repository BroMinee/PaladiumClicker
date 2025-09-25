import { cn } from "@/lib/utils";

const GradientText = ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("bg-clip-text text-transparent bg-gradient-to-tr from-primary to-destructive/85", className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default GradientText;