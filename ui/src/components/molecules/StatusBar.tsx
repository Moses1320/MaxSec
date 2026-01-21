/**
 * StatusBar component - Display current system status
 */

import React from "react";
import { Check, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { cn } from "../../utils/cn";

interface StatusItem {
  label: string;
  status: "healthy" | "warning" | "critical" | "offline";
  details?: string;
}

interface StatusBarProps {
  items: StatusItem[];
  position?: "top" | "bottom";
}

export const StatusBar: React.FC<StatusBarProps> = ({
  items,
  position = "bottom",
}) => {
  const statusColors = {
    healthy: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    warning: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    critical: "text-strawberry-600 bg-strawberry-50 dark:bg-red-900/20 border-strawberry-200 dark:border-red-800",
    offline: "text-space-500 bg-platinum-50 dark:bg-space-800 border-space-200 dark:border-space-700",
  };

  const statusIcons = {
    healthy: <Check size={16} />,
    warning: <AlertCircle size={16} />,
    critical: <AlertCircle size={16} />,
    offline: <WifiOff size={16} />,
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 flex-wrap p-3 bg-white dark:bg-space-800 border-t border-lavender-100 dark:border-space-700",
        position === "top" && "border-b border-t-0"
      )}
      role="region"
      aria-label="System status"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
            statusColors[item.status]
          )}
          role="status"
          aria-label={`${item.label}: ${item.status}`}
        >
          {statusIcons[item.status]}
          <span>{item.label}</span>
          {item.details && (
            <span className="text-xs opacity-75 ml-1">({item.details})</span>
          )}
        </div>
      ))}
    </div>
  );
};
