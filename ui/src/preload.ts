/**
 * Electron preload script - Secure IPC bridge
 */

import { contextBridge, ipcRenderer } from "electron";

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Process monitoring
  getProcesses: () => ipcRenderer.invoke("get-processes"),
  monitorProcess: (pid: number) => ipcRenderer.invoke("monitor-process", pid),
  
  // Risk analysis
  analyzeRisk: (pid: number) => ipcRenderer.invoke("analyze-risk", pid),
  
  // Enforcement
  terminateProcess: (pid: number) =>
    ipcRenderer.invoke("terminate-process", pid),
  quarantineProcess: (pid: number) =>
    ipcRenderer.invoke("quarantine-process", pid),
  blockNetwork: (pid: number) => ipcRenderer.invoke("block-network", pid),
  
  // Alerts
  getAlerts: () => ipcRenderer.invoke("get-alerts"),
  dismissAlert: (alertId: string) =>
    ipcRenderer.invoke("dismiss-alert", alertId),
  
  // Settings
  getSettings: () => ipcRenderer.invoke("get-settings"),
  updateSettings: (settings: Record<string, any>) =>
    ipcRenderer.invoke("update-settings", settings),
  
  // Real-time listeners
  onProcessUpdate: (callback: (data: any) => void) =>
    ipcRenderer.on("process-update", (_event, data) => callback(data)),
  onAlertCreated: (callback: (alert: any) => void) =>
    ipcRenderer.on("alert-created", (_event, alert) => callback(alert)),
  onSystemStatus: (callback: (status: any) => void) =>
    ipcRenderer.on("system-status", (_event, status) => callback(status)),
  
  // Cleanup
  removeAllListeners: () => ipcRenderer.removeAllListeners(),
});

declare global {
  interface Window {
    electronAPI: {
      getProcesses: () => Promise<any>;
      monitorProcess: (pid: number) => Promise<any>;
      analyzeRisk: (pid: number) => Promise<any>;
      terminateProcess: (pid: number) => Promise<any>;
      quarantineProcess: (pid: number) => Promise<any>;
      blockNetwork: (pid: number) => Promise<any>;
      getAlerts: () => Promise<any[]>;
      dismissAlert: (alertId: string) => Promise<void>;
      getSettings: () => Promise<Record<string, any>>;
      updateSettings: (settings: Record<string, any>) => Promise<void>;
      onProcessUpdate: (callback: (data: any) => void) => void;
      onAlertCreated: (callback: (alert: any) => void) => void;
      onSystemStatus: (callback: (status: any) => void) => void;
      removeAllListeners: () => void;
    };
  }
}

export {};
