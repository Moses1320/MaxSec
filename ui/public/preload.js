/**
 * Electron preload script
 * Provides secure IPC bridge between renderer and main process
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Process monitoring
  getProcesses: () => ipcRenderer.invoke("get-processes"),
  monitorProcess: (pid) => ipcRenderer.invoke("monitor-process", pid),

  // Risk analysis
  analyzeRisk: (pid) => ipcRenderer.invoke("analyze-risk", pid),

  // Enforcement
  terminateProcess: (pid) => ipcRenderer.invoke("terminate-process", pid),
  quarantineProcess: (pid) => ipcRenderer.invoke("quarantine-process", pid),
  blockNetwork: (pid) => ipcRenderer.invoke("block-network", pid),

  // Alerts
  getAlerts: () => ipcRenderer.invoke("get-alerts"),
  dismissAlert: (alertId) => ipcRenderer.invoke("dismiss-alert", alertId),

  // Settings
  getSettings: () => ipcRenderer.invoke("get-settings"),
  updateSettings: (settings) =>
    ipcRenderer.invoke("update-settings", settings),

  // Real-time listeners
  onProcessUpdate: (callback) =>
    ipcRenderer.on("process-update", (_event, data) => callback(data)),
  onAlertCreated: (callback) =>
    ipcRenderer.on("alert-created", (_event, alert) => callback(alert)),
  onSystemStatus: (callback) =>
    ipcRenderer.on("system-status", (_event, status) => callback(status)),

  // Cleanup
  removeAllListeners: () => ipcRenderer.removeAllListeners(),
});
