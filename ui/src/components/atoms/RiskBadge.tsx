/**
 * Risk badge component
 * Displays risk levels with appropriate colors and accessibility
 */

import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";

type RiskLevel = "safe" | "suspicious" | "high_risk" | "critical";

interface RiskBadgeProps {
  level: RiskLevel;
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const riskConfig = {
  safe: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
    label: "Safe",
    ariaLabel: "Risk level: Safe",
  },
  suspicious: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: AlertTriangle,
    label: "Suspicious",
    ariaLabel: "Risk level: Suspicious",
  },
  high_risk: {
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: AlertTriangle,
    label: "High Risk",
    ariaLabel: "Risk level: High Risk",
  },
  critical: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: AlertOctagon,
    label: "Critical",
    ariaLabel: "Risk level: Critical - immediate action required",
  },
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  size = "md",
  showLabel = true,
}) => {
  const config = riskConfig[level];
  const Icon = config.icon;

  const sizeClass = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border ${config.color} ${sizeClass}`}
      role="status"
      aria-label={config.ariaLabel}
    >
      <Icon
        size={size === "sm" ? 14 : size === "md" ? 16 : 20}
        aria-hidden="true"
      />
      {showLabel && <span className="font-medium">{config.label}</span>}
      <span className="font-mono text-xs opacity-75">{score.toFixed(0)}</span>
    </div>
  );
};
