/**
 * React hooks for backend integration
 */

import { useState, useEffect, useCallback } from "react";

export interface ProcessInfo {
  pid: number;
  name: string;
  riskScore: number;
  riskLevel: "safe" | "suspicious" | "high_risk" | "critical";
  memoryPercent: number;
  cpuPercent: number;
  connections: number;
  trusted: boolean;
}

export interface Alert {
  id: string;
  processName: string;
  riskLevel: "safe" | "suspicious" | "high_risk" | "critical";
  riskScore: number;
  violations: string[];
  timestamp: Date;
}

/**
 * Hook to fetch and monitor all processes
 */
export const useProcesses = () => {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        setLoading(true);
        if (window.electronAPI) {
          const data = await window.electronAPI.getProcesses();
          setProcesses(data);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch processes");
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
    const interval = setInterval(fetchProcesses, 5000); // Poll every 5 seconds

    // Listen for real-time updates
    window.electronAPI?.onProcessUpdate((data) => {
      setProcesses(data);
    });

    return () => {
      clearInterval(interval);
      window.electronAPI?.removeAllListeners();
    };
  }, []);

  return { processes, loading, error };
};

/**
 * Hook to fetch and monitor alerts
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        if (window.electronAPI) {
          const data = await window.electronAPI.getAlerts();
          setAlerts(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Listen for new alerts in real-time
    window.electronAPI?.onAlertCreated((newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });

    return () => {
      window.electronAPI?.removeAllListeners();
    };
  }, []);

  const dismissAlert = useCallback(async (alertId: string) => {
    try {
      await window.electronAPI?.dismissAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
    }
  }, []);

  return { alerts, loading, dismissAlert };
};

/**
 * Hook to analyze process risk
 */
export const useAnalyzeRisk = () => {
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = useCallback(async (pid: number) => {
    try {
      setLoading(true);
      const data = await window.electronAPI?.analyzeRisk(pid);
      setRiskData(data);
      return data;
    } catch (err) {
      console.error("Failed to analyze risk:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { riskData, loading, analyze };
};

/**
 * Hook for process enforcement actions
 */
export const useEnforcement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const terminate = useCallback(async (pid: number) => {
    try {
      setLoading(true);
      await window.electronAPI?.terminateProcess(pid);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to terminate process");
    } finally {
      setLoading(false);
    }
  }, []);

  const quarantine = useCallback(async (pid: number) => {
    try {
      setLoading(true);
      await window.electronAPI?.quarantineProcess(pid);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to quarantine process");
    } finally {
      setLoading(false);
    }
  }, []);

  const blockNetwork = useCallback(async (pid: number) => {
    try {
      setLoading(true);
      await window.electronAPI?.blockNetwork(pid);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to block network");
    } finally {
      setLoading(false);
    }
  }, []);

  return { terminate, quarantine, blockNetwork, loading, error };
};

/**
 * Hook for system status
 */
export const useSystemStatus = () => {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    window.electronAPI?.onSystemStatus((data) => {
      setStatus(data);
    });

    return () => {
      window.electronAPI?.removeAllListeners();
    };
  }, []);

  return status;
};

/**
 * Hook for settings management
 */
export const useSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await window.electronAPI?.getSettings();
        setSettings(data || {});
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Record<string, any>) => {
    try {
      await window.electronAPI?.updateSettings(newSettings);
      setSettings((prev) => ({ ...prev, ...newSettings }));
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  }, []);

  return { settings, loading, updateSettings };
};
