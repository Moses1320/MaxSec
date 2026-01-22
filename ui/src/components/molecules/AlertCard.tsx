/**
 * Alert card component
 * Displays security alerts with actionable controls
 */

import React from "react";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  X,
  TrendingUp,
} from "lucide-react";
import { Button } from "../atoms/Button";
import { RiskBadge } from "../atoms/RiskBadge";

interface AlertCardProps {
  id: string;
  processName: string;
  riskLevel: "safe" | "suspicious" | "high_risk" | "critical";
  riskScore: number;
  violations: string[];
  timestamp: Date;
  onAction?: (action: string) => void;
  onDismiss?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  id,
  processName,
  riskLevel,
  riskScore,
  violations,
  timestamp,
  onAction,
  onDismiss,
}) => {
  const getIcon = () => {
    switch (riskLevel) {
      case "safe":
        return <CheckCircle className="text-green-600" size={20} />;
      case "suspicious":
        return <AlertTriangle className="text-yellow-600" size={20} />;
      case "high_risk":
        return <AlertTriangle className="text-orange-600" size={20} />;
      case "critical":
        return <AlertOctagon className="text-red-600" size={20} />;
    }
  };

  const formattedTime = timestamp.toLocaleTimeString();

  return (
    <article
      className="p-4 bg-white border-l-4 border-space-600 rounded-lg shadow-medium hover:shadow-elevated transition-shadow"
      role="region"
      aria-label={`Alert: ${processName}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {getIcon()}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-space-900">{processName}</h3>
              <RiskBadge level={riskLevel} score={riskScore} size="sm" />
            </div>
            <p className="text-sm text-space-600 mt-1">{formattedTime}</p>
            {violations.length > 0 && (
              <ul className="mt-2 text-sm text-space-700">
                {violations.map((violation, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-strawberry-500" />
                    {violation}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {riskLevel !== "safe" && (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onAction?.(id)}
                ariaLabel={`Terminate ${processName}`}
              >
                Terminate
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAction?.(`quarantine-${id}`)}
                ariaLabel={`Quarantine ${processName}`}
              >
                Quarantine
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss?.(id)}
            ariaLabel={`Dismiss alert for ${processName}`}
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </article>
  );
};
