/**
 * Button component with accessibility support
 * WCAG AA compliant
 */

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-space-600 text-white hover:bg-space-700 focus:ring-space-600 active:bg-space-800",
        secondary:
          "bg-lavender-200 text-space-600 hover:bg-lavender-300 focus:ring-lavender-500 active:bg-lavender-400",
        danger:
          "bg-strawberry-500 text-white hover:bg-strawberry-600 focus:ring-strawberry-500 active:bg-strawberry-700",
        critical:
          "bg-flag-500 text-white hover:bg-flag-600 focus:ring-flag-500 active:bg-flag-700",
        ghost:
          "bg-transparent text-space-600 hover:bg-lavender-100 focus:ring-space-600",
        outline:
          "border-2 border-space-600 text-space-600 hover:bg-space-50 focus:ring-space-600",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      children,
      isLoading,
      icon,
      disabled,
      ariaLabel,
      ...props
    },
    ref
  ) => (
    <button
      className={cn(
        buttonVariants({ variant, size, fullWidth }),
        className
      )}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <div
          className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
          role="status"
          aria-label="Loading"
        />
      )}
      {icon && !isLoading && icon}
      {children}
    </button>
  )
);

Button.displayName = "Button";
