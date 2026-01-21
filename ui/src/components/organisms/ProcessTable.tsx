/**
 * Process table component
 * Displays running processes with risk scores
 * WCAG AA compliant with keyboard navigation
 */

import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  Lock,
  Network,
} from "lucide-react";
import { RiskBadge } from "../atoms/RiskBadge";

interface Process {
  pid: number;
  name: string;
  riskScore: number;
  riskLevel: "safe" | "suspicious" | "high_risk" | "critical";
  memoryPercent: number;
  cpuPercent: number;
  connections: number;
  trusted: boolean;
}

interface ProcessTableProps {
  processes: Process[];
  onAction?: (action: string, pid: number) => void;
  isLoading?: boolean;
}

type SortKey = "name" | "riskScore" | "memoryPercent" | "cpuPercent";
type SortOrder = "asc" | "desc";

export const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  onAction,
  isLoading = false,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedProcesses = [...processes].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ active }: { active: boolean }) =>
    active ? (
      sortOrder === "asc" ? (
        <ChevronUp size={16} />
      ) : (
        <ChevronDown size={16} />
      )
    ) : (
      <ChevronUp size={16} className="opacity-30" />
    );

  const HeaderButton = ({
    onClick,
    label,
    isActive,
  }: {
    onClick: () => void;
    label: string;
    isActive: boolean;
  }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1 hover:text-space-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-space-600 rounded px-2 py-1"
      aria-label={`Sort by ${label}`}
    >
      {label}
      <SortIcon active={isActive} />
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <div className="animate-spin">
          <Network className="text-space-600" size={24} />
        </div>
        <span className="ml-2">Loading processes...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-lavender-200">
      <table className="w-full text-sm">
        <thead className="bg-platinum-100 border-b border-lavender-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-space-700">
              <HeaderButton
                onClick={() => toggleSort("name")}
                label="Process"
                isActive={sortKey === "name"}
              />
            </th>
            <th className="px-4 py-3 text-left font-semibold text-space-700">
              <HeaderButton
                onClick={() => toggleSort("riskScore")}
                label="Risk"
                isActive={sortKey === "riskScore"}
              />
            </th>
            <th className="px-4 py-3 text-right font-semibold text-space-700">
              <HeaderButton
                onClick={() => toggleSort("cpuPercent")}
                label="CPU"
                isActive={sortKey === "cpuPercent"}
              />
            </th>
            <th className="px-4 py-3 text-right font-semibold text-space-700">
              <HeaderButton
                onClick={() => toggleSort("memoryPercent")}
                label="Memory"
                isActive={sortKey === "memoryPercent"}
              />
            </th>
            <th className="px-4 py-3 text-center font-semibold text-space-700">
              Connections
            </th>
            <th className="px-4 py-3 text-center font-semibold text-space-700">
              Status
            </th>
            <th className="px-4 py-3 text-center font-semibold text-space-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedProcesses.map((proc, idx) => (
            <tr
              key={proc.pid}
              className={`border-b border-lavender-100 hover:bg-platinum-50 focus-within:bg-platinum-100 ${
                idx % 2 === 0 ? "bg-white" : "bg-platinum-50"
              }`}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-space-900">{proc.name}</div>
                <div className="text-xs text-space-600">PID {proc.pid}</div>
              </td>
              <td className="px-4 py-3">
                <RiskBadge
                  level={proc.riskLevel}
                  score={proc.riskScore}
                  size="sm"
                  showLabel={false}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={
                    proc.cpuPercent > 80
                      ? "text-strawberry-600 font-semibold"
                      : ""
                  }
                >
                  {proc.cpuPercent.toFixed(1)}%
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={
                    proc.memoryPercent > 50
                      ? "text-strawberry-600 font-semibold"
                      : ""
                  }
                >
                  {proc.memoryPercent.toFixed(1)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center gap-1">
                  <Network size={14} className="text-space-600" />
                  {proc.connections}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                {proc.trusted && (
                  <Lock
                    size={16}
                    className="text-green-600 mx-auto"
                    title="Trusted"
                  />
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onAction?.("inspect", proc.pid)}
                    className="p-2 hover:bg-platinum-200 rounded focus:outline-none focus:ring-2 focus:ring-space-600"
                    title="Inspect"
                    aria-label={`Inspect ${proc.name}`}
                  >
                    <Edit2 size={14} />
                  </button>
                  {proc.riskLevel !== "safe" && (
                    <button
                      onClick={() => onAction?.("terminate", proc.pid)}
                      className="p-2 hover:bg-strawberry-100 hover:text-strawberry-600 rounded focus:outline-none focus:ring-2 focus:ring-strawberry-500"
                      title="Terminate"
                      aria-label={`Terminate ${proc.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sortedProcesses.length === 0 && (
        <div className="p-8 text-center text-space-600">
          No processes found
        </div>
      )}
    </div>
  );
};
