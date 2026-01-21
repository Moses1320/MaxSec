/**
 * Vite configuration for React + Electron development
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  build: {
    target: "ES2020",
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
  },
  define: {
    "process.env": {},
  },
});
