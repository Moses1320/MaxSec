/**
 * Environment configuration
 */

// Electron environment
export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

// API endpoints
export const API_BASE_URL = isDev ? "http://localhost:8000" : "http://localhost:8000";
export const WS_URL = isDev ? "ws://localhost:8001" : "ws://localhost:8001";

// Feature flags
export const FEATURES = {
  DARK_MODE: true,
  ADVANCED_MONITORING: true,
  THREAT_INTELLIGENCE: true,
  CUSTOM_POLICIES: true,
  EXPORT_REPORTS: true,
};

// Thresholds
export const RISK_THRESHOLDS = {
  SAFE: 25,
  SUSPICIOUS: 50,
  HIGH_RISK: 75,
  CRITICAL: 100,
};

// Refresh intervals (ms)
export const REFRESH_INTERVALS = {
  PROCESSES: 5000,
  ALERTS: 3000,
  SYSTEM_STATUS: 2000,
};

// UI Configuration
export const UI_CONFIG = {
  ALERT_TIMEOUT: 5000,
  MODAL_ANIMATION_DURATION: 200,
  TOAST_DURATION: 4000,
};
