/**
 * Modal component - Accessible dialog overlay
 */

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white dark:bg-space-800 rounded-lg shadow-medium",
          "max-w-full mx-4 animate-slideUp",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-lavender-100 dark:border-space-700">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-space-900 dark:text-platinum-100"
          >
            {title}
          </h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-platinum-100 dark:hover:bg-space-700 rounded-base transition-colors focus:outline-none focus:ring-2 focus:ring-space-600"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-lavender-100 dark:border-space-700 flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
