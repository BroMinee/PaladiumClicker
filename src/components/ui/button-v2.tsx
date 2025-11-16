"use client";
import React from "react";
import { cn } from "@/lib/utils"; // Your class merging utility (cn)
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded whitespace-nowrap text-sm font-medium transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        none: "",
        primary: "bg-primary hover:bg-primary-darker text-white font-bold",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white font-semibold",
        default: "bg-indigo-500 text-white shadow hover:bg-indigo-600",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        none: "",
        default: "h-9 px-4 py-2 rounded-lg",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 rounded-lg p-0",
        card: "p-3 rounded-lg aspect-square",
      },
    },
    defaultVariants: {
      variant: "none",
      size: "none",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  className?: string;
  variant?: "none" | "primary" | "secondary" | "default" | "ghost";
  size?: "none" | "default" | "sm" | "lg" | "icon" | "card";
  onClick: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, onClick, ...props }, ref) => {

    const baseClasses = cn(
      buttonVariants({ variant, size, className })
    );

    return (
      <button
        onClick={onClick}
        className={baseClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };