/**
 * Badge component - Decorative label
 */

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-space-100 dark:bg-space-700 text-space-700 dark:text-platinum-100",
        primary: "bg-space-600 text-white",
        secondary: "bg-lavender-200 dark:bg-lavender-800 text-space-700 dark:text-platinum-100",
        success: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100",
        warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100",
        danger: "bg-strawberry-100 dark:bg-strawberry-900 text-strawberry-700 dark:text-strawberry-100",
        critical: "bg-flag-100 dark:bg-red-900 text-flag-700 dark:text-red-100",
        outline: "border border-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, icon, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {props.children}
    </span>
  )
);

Badge.displayName = "Badge";
