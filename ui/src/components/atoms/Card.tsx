/**
 * Card component - Flexible container with styling
 */

import React from "react";
import { cn } from "../../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, elevated = false, bordered = true, hoverable = false, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "bg-white dark:bg-space-800 rounded-lg transition-all",
        bordered && "border border-lavender-100 dark:border-space-700",
        elevated && "shadow-medium",
        !elevated && "shadow-soft",
        hoverable &&
          "hover:shadow-medium hover:border-lavender-200 dark:hover:border-space-600 cursor-pointer",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-4 border-b border-lavender-100 dark:border-space-700", className)}
      {...props}
    />
  )
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold text-space-900 dark:text-platinum-100",
        className
      )}
      {...props}
    />
  )
);

CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-space-600 dark:text-lavender-300", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
  )
);

CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-t border-lavender-100 dark:border-space-700 flex items-center justify-between",
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = "CardFooter";
