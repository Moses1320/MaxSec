const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    icon: path.join(__dirname, "../assets/icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      sandbox: true,
    },
  });

  // Load URL based on environment
  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

function createMenu() {
  const template = [
    {
      label: "MaxSec",
      submenu: [
        { label: "About MaxSec", role: "about" },
        { type: "separator" },
        {
          label: "Preferences",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            mainWindow?.webContents.send("navigate", "#settings");
          },
        },
        { type: "separator" },
        { label: "Exit", accelerator: "CmdOrCtrl+Q", role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers for process monitoring
ipcMain.handle("get-processes", async () => {
  // TODO: Call Python backend to get processes
  return [];
});

ipcMain.handle("monitor-process", async (_event, pid) => {
  // TODO: Call Python backend
  return { pid, monitored: true };
});

ipcMain.handle("analyze-risk", async (_event, pid) => {
  // TODO: Call Python backend for risk analysis
  return { pid, riskScore: 0, riskLevel: "safe" };
});

// IPC Handlers for enforcement
ipcMain.handle("terminate-process", async (_event, pid) => {
  // TODO: Call Python backend to terminate process
  return { success: true, pid };
});

ipcMain.handle("quarantine-process", async (_event, pid) => {
  // TODO: Call Python backend to quarantine
  return { success: true, pid };
});

ipcMain.handle("block-network", async (_event, pid) => {
  // TODO: Call Python backend to block network
  return { success: true, pid };
});

// IPC Handlers for alerts
ipcMain.handle("get-alerts", async () => {
  // TODO: Call Python backend to get alerts
  return [];
});

ipcMain.handle("dismiss-alert", async (_event, alertId) => {
  // TODO: Call Python backend to dismiss alert
  return { success: true, alertId };
});

// IPC Handlers for settings
ipcMain.handle("get-settings", async () => {
  // TODO: Load settings from file/database
  return {
    darkMode: false,
    autoStart: true,
    notificationsEnabled: true,
  };
});

ipcMain.handle("update-settings", async (_event, settings) => {
  // TODO: Save settings to file/database
  return { success: true, settings };
});

app.on("ready", () => {
  createWindow();
  createMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle any uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});
