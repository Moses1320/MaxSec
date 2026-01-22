/**
 * Main layout with navigation
 * Responsive design with dark mode support
 */

import React, { useState } from "react";
import {
  Menu,
  X,
  Shield,
  Activity,
  AlertCircle,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Policies from "./pages/Policies";
import SettingsPage from "./pages/Settings";

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("Home");

  const navigationItems = [
    {
      name: "Dashboard",
      icon: Activity,
      href: "#dashboard",
    },
    {
      name: "Incidents",
      icon: AlertCircle,
      href: "#incidents",
    },
    {
      name: "Policies",
      icon: Shield,
      href: "#policies",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "#settings",
    },
  ];

  return (
    <div
      className={`flex h-screen ${darkMode ? "dark" : ""}`}
      role="application"
    >
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        } bg-space-600 text-white transition-all duration-300 overflow-hidden flex flex-col`}
        aria-label="Main navigation"
      >
        {/* Logo - Clickable to go to Home */}
        <button
          onClick={() => setCurrentPage("Home")}
          className="p-4 flex items-center gap-3 border-b border-space-700 hover:bg-space-500 transition-colors focus:outline-none focus:ring-2 focus:ring-strawberry-500 focus:ring-offset-2 focus:ring-offset-space-600"
          title="Go to Home"
          aria-label="MaxSec Home"
        >
          <Shield size={24} className="flex-shrink-0" />
          {sidebarOpen && (
            <h2 className="font-bold text-lg whitespace-nowrap">MaxSec</h2>
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setCurrentPage(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.name === currentPage
                    ? "bg-space-500 text-white"
                    : "text-lavender-200 hover:bg-space-500"
                } focus:outline-none focus:ring-2 focus:ring-strawberry-500 focus:ring-offset-2 focus:ring-offset-space-600`}
                title={!sidebarOpen ? item.name : ""}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-space-700 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-lavender-200 hover:bg-space-500 transition-colors focus:outline-none focus:ring-2 focus:ring-strawberry-500"
            title="Toggle dark mode"
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarOpen && <span>{darkMode ? "Light" : "Dark"}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-platinum-50 dark:bg-space-900">
        {/* Top Bar */}
        <header className="bg-white dark:bg-space-800 border-b border-lavender-200 dark:border-space-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-platinum-100 dark:hover:bg-space-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-space-600"
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h2 className="text-lg font-semibold text-space-900 dark:text-platinum-100">
                Security Hub
              </h2>
              <p className="text-sm text-space-600 dark:text-lavender-400">
                Real-time threat monitoring
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-3 px-4 py-2 bg-platinum-100 dark:bg-space-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-space-700 dark:text-platinum-200">
              System Healthy
            </span>
          </div>
        </header>

        {/* Page Content */}
        {currentPage === "Home" && <Home />}
        {currentPage === "Dashboard" && <Dashboard />}
        {currentPage === "Incidents" && <Incidents />}
        {currentPage === "Policies" && <Policies />}
        {currentPage === "Settings" && <SettingsPage />}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="sr-only" role="complementary" aria-label="Keyboard shortcuts">
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>Tab: Navigate between elements</li>
          <li>Enter: Activate buttons and links</li>
          <li>Escape: Close modals and menus</li>
          <li>Ctrl+D: Toggle dark mode</li>
          <li>Ctrl+Shift+P: Open command palette</li>
        </ul>
      </div>
    </div>
  );
};
