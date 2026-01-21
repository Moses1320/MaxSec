/**
 * Backend API service wrapper
 * Handles HTTP requests and error management
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import { API_BASE_URL } from "../config/environment";

interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message,
          code: error.code || "UNKNOWN_ERROR",
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
    );
  }

  // Process endpoints
  async getProcesses() {
    return this.client.get("/api/processes");
  }

  async getProcessDetails(pid: number) {
    return this.client.get(`/api/processes/${pid}`);
  }

  async getProcessHistory(pid: number) {
    return this.client.get(`/api/processes/${pid}/history`);
  }

  // Risk analysis endpoints
  async analyzeProcess(pid: number) {
    return this.client.post(`/api/analyze`, { pid });
  }

  async getRiskScore(pid: number) {
    return this.client.get(`/api/risk/${pid}`);
  }

  // Alert endpoints
  async getAlerts(filters?: { severity?: string; resolved?: boolean }) {
    return this.client.get("/api/alerts", { params: filters });
  }

  async dismissAlert(alertId: string) {
    return this.client.patch(`/api/alerts/${alertId}`, { resolved: true });
  }

  // Enforcement endpoints
  async terminateProcess(pid: number) {
    return this.client.post(`/api/enforce/terminate`, { pid });
  }

  async quarantineProcess(pid: number) {
    return this.client.post(`/api/enforce/quarantine`, { pid });
  }

  async blockNetwork(pid: number) {
    return this.client.post(`/api/enforce/block-network`, { pid });
  }

  async suspendProcess(pid: number) {
    return this.client.post(`/api/enforce/suspend`, { pid });
  }

  // Settings endpoints
  async getSettings() {
    return this.client.get("/api/settings");
  }

  async updateSettings(settings: Record<string, any>) {
    return this.client.put("/api/settings", settings);
  }

  // Health check
  async healthCheck() {
    return this.client.get("/api/health");
  }
}

export const apiService = new ApiService();
