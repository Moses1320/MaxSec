/**
 * Main dashboard page - Advanced data-heavy layout
 * Shows real-time threat overview and key metrics
 */

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertCircle,
  Shield,
  TrendingUp,
  Activity,
  Lock,
  Server,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../components/atoms/Button";
import { RiskBadge } from "../components/atoms/RiskBadge";
import { AlertCard } from "../components/molecules/AlertCard";
import { ProcessTable } from "../components/organisms/ProcessTable";

// Sample data - replace with real backend data
const mockRiskTrend = [
  { time: "00:00", safe: 120, suspicious: 20, high_risk: 5, critical: 2 },
  { time: "04:00", safe: 115, suspicious: 25, high_risk: 8, critical: 3 },
  { time: "08:00", safe: 110, suspicious: 30, high_risk: 12, critical: 5 },
  { time: "12:00", safe: 125, suspicious: 18, high_risk: 4, critical: 1 },
  { time: "16:00", safe: 130, suspicious: 22, high_risk: 7, critical: 2 },
  { time: "20:00", safe: 128, suspicious: 25, high_risk: 9, critical: 4 },
  { time: "24:00", safe: 132, suspicious: 20, high_risk: 6, critical: 2 },
];

const mockRiskDistribution = [
  { name: "Safe", value: 65, color: "#16A34A" },
  { name: "Suspicious", value: 25, color: "#F59E0B" },
  { name: "High Risk", value: 8, color: "#EA580C" },
  { name: "Critical", value: 2, color: "#DC2626" },
];

const mockAlerts = [
  {
    id: "1",
    processName: "unknown.exe",
    riskLevel: "critical" as const,
    riskScore: 87,
    violations: ["background_camera_access", "hidden_execution"],
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "2",
    processName: "svchost.exe",
    riskLevel: "suspicious" as const,
    riskScore: 45,
    violations: ["high_network_activity"],
    timestamp: new Date(Date.now() - 15 * 60000),
  },
];

const mockProcesses = [
  {
    pid: 1234,
    name: "unknown.exe",
    riskScore: 87,
    riskLevel: "critical" as const,
    memoryPercent: 45,
    cpuPercent: 88,
    connections: 120,
    trusted: false,
  },
  {
    pid: 5678,
    name: "chrome.exe",
    riskScore: 25,
    riskLevel: "suspicious" as const,
    memoryPercent: 65,
    cpuPercent: 12,
    connections: 15,
    trusted: true,
  },
  {
    pid: 9012,
    name: "svchost.exe",
    riskScore: 8,
    riskLevel: "safe" as const,
    memoryPercent: 8,
    cpuPercent: 1,
    connections: 2,
    trusted: true,
  },
];

interface KPICard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState("monitoring");
  const [showAlerts, setShowAlerts] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const kpis: KPICard[] = [
    {
      title: "Active Processes",
      value: "156",
      change: "+12 since last scan",
      icon: <Server size={24} />,
      color: "text-space-600",
    },
    {
      title: "High-Risk Apps",
      value: "3",
      change: "+1 new threat",
      icon: <AlertCircle size={24} />,
      color: "text-strawberry-600",
    },
    {
      title: "Blocked Connections",
      value: "42",
      change: "+8 blocked today",
      icon: <Lock size={24} />,
      color: "text-flag-600",
    },
    {
      title: "System Health",
      value: "92%",
      change: "Normal operations",
      icon: <Activity size={24} />,
      color: "text-green-600",
    },
  ];

  return (
    <main className="flex-1 bg-platinum-50 dark:bg-space-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-space-900 dark:text-platinum-100 flex items-center gap-3">
              <Shield className="text-space-600" size={32} />
              Security Dashboard
            </h1>
            <p className="text-space-600 dark:text-lavender-300 mt-2">
              Real-time threat monitoring and enforcement
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setSystemStatus("monitoring")}
            >
              <Eye size={16} />
              {systemStatus === "monitoring" ? "Monitor Mode" : "Switch"}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <article
              key={kpi.title}
              className="p-6 bg-white dark:bg-space-800 rounded-lg shadow-soft hover:shadow-medium transition-shadow border border-lavender-100 dark:border-space-700"
              role="region"
              aria-label={kpi.title}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-space-600 dark:text-lavender-300">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-space-900 dark:text-platinum-100 mt-2">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-space-500 dark:text-lavender-400 mt-1">
                    {kpi.change}
                  </p>
                </div>
                <div className={kpi.color}>{kpi.icon}</div>
              </div>
            </article>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Trend Chart */}
          <article className="lg:col-span-2 p-6 bg-white dark:bg-space-800 rounded-lg shadow-soft border border-lavender-100 dark:border-space-700">
            <h2 className="text-lg font-semibold text-space-900 dark:text-platinum-100 mb-4">
              Risk Trend (24h)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockRiskTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="safe" stroke="#16A34A" />
                <Line type="monotone" dataKey="suspicious" stroke="#F59E0B" />
                <Line type="monotone" dataKey="high_risk" stroke="#EA580C" />
                <Line type="monotone" dataKey="critical" stroke="#DC2626" />
              </LineChart>
            </ResponsiveContainer>
          </article>

          {/* Risk Distribution */}
          <article className="p-6 bg-white dark:bg-space-800 rounded-lg shadow-soft border border-lavender-100 dark:border-space-700">
            <h2 className="text-lg font-semibold text-space-900 dark:text-platinum-100 mb-4">
              Risk Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockRiskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {mockRiskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {mockRiskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="text-space-600 dark:text-lavender-300">
                    {item.name}
                  </span>
                  <span className="font-semibold text-space-900 dark:text-platinum-100">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Alerts Section */}
        {showAlerts && (
          <article className="p-6 bg-white dark:bg-space-800 rounded-lg shadow-soft border-l-4 border-strawberry-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-space-900 dark:text-platinum-100 flex items-center gap-2">
                <AlertCircle className="text-strawberry-600" size={20} />
                Active Alerts ({mockAlerts.length})
              </h2>
              <button
                onClick={() => setShowAlerts(false)}
                className="text-space-600 hover:text-space-900"
                aria-label="Close alerts"
              >
                <EyeOff size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  {...alert}
                  onDismiss={() => setSelectedAlert(null)}
                  onAction={(action) => console.log("Action:", action)}
                />
              ))}
            </div>
          </article>
        )}

        {/* Process Table */}
        <article className="p-6 bg-white dark:bg-space-800 rounded-lg shadow-soft border border-lavender-100 dark:border-space-700">
          <h2 className="text-lg font-semibold text-space-900 dark:text-platinum-100 mb-4">
            Process Monitor
          </h2>
          <ProcessTable
            processes={mockProcesses}
            onAction={(action, pid) => console.log(action, pid)}
          />
        </article>
      </div>
    </main>
  );
};

export default Dashboard;
