import {cn} from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> { }

const GradientText = ({ children, className, ...props }: GradientTextProps) => {
  return (
    <span
      className={cn("bg-clip-text text-transparent bg-gradient-to-tr from-primary to-destructive/85", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export default GradientText;