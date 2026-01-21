/**
 * Input component - Accessible text/email/password input
 */

import React, { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-space-700 dark:text-platinum-200 mb-2"
          >
            {label}
            {props.required && (
              <span className="text-strawberry-600 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-space-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-3 py-2 border rounded-base",
              "bg-white dark:bg-space-800",
              "text-space-900 dark:text-platinum-100",
              "border-lavender-300 dark:border-space-600",
              "focus:outline-none focus:ring-2 focus:ring-space-600 focus:border-transparent",
              "placeholder:text-space-400 dark:placeholder:text-space-500",
              "disabled:bg-platinum-100 dark:disabled:bg-space-700 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-strawberry-500 focus:ring-strawberry-600",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-space-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-strawberry-600 dark:text-strawberry-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-xs text-space-500 dark:text-lavender-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
