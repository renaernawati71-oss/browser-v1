const { app, BrowserWindow, ipcMain, session, Menu, Tray } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Database = require('./database/database');
const ProfileManager = require('./services/profileManager');
const ProxyManager = require('./services/proxyManager');
const FingerprintEngine = require('./fingerprint/fingerprintEngine');
const LauncherEngine = require('./launcher/launcherEngine');
const ResourceManager = require('./services/resourceManager');

let mainWindow;
let tray;
let database;
let profileManager;
let proxyManager;
let fingerprintEngine;
let launcherEngine;
let resourceManager;

// Initialize application
async function initializeApp() {
  try {
    // Initialize database
    database = new Database();
    await database.initialize();

    // Initialize services
    profileManager = new ProfileManager(database);
    proxyManager = new ProxyManager(database);
    fingerprintEngine = new FingerprintEngine(database);
    launcherEngine = new LauncherEngine(profileManager, proxyManager, fingerprintEngine);
    resourceManager = new ResourceManager();

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    app.quit();
  }
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    frame: true,
    titleBarStyle: 'default',
    backgroundColor: '#0a0a0f',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      sandbox: true
    }
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create system tray
  createTray();
}

// Create system tray
function createTray() {
  tray = new Tray(path.join(__dirname, '../../build/icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Hide App', click: () => mainWindow.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  
  tray.setToolTip('Multi Browser Workspace Platform');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    mainWindow.show();
  });
}

// Application lifecycle
app.whenReady().then(async () => {
  await initializeApp();
  createWindow();
  
  // Set up security measures
  setupSecurity();
  
  // Set up IPC handlers
  setupIPCHandlers();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security setup
function setupSecurity() {
  // Disable web security for specific URLs if needed
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'"]
      }
    });
  });
}

// IPC Handlers setup
function setupIPCHandlers() {
  // Profile Management
  ipcMain.handle('profile:create', async (event, profileData) => {
    return await profileManager.createProfile(profileData);
  });

  ipcMain.handle('profile:update', async (event, profileId, profileData) => {
    return await profileManager.updateProfile(profileId, profileData);
  });

  ipcMain.handle('profile:delete', async (event, profileId) => {
    return await profileManager.deleteProfile(profileId);
  });

  ipcMain.handle('profile:getAll', async () => {
    return await profileManager.getAllProfiles();
  });

  ipcMain.handle('profile:getById', async (event, profileId) => {
    return await profileManager.getProfileById(profileId);
  });

  ipcMain.handle('profile:clone', async (event, profileId, cloneOptions) => {
    return await profileManager.cloneProfile(profileId, cloneOptions);
  });

  // Browser Launch
  ipcMain.handle('browser:launch', async (event, profileId) => {
    return await launcherEngine.launchProfile(profileId);
  });

  ipcMain.handle('browser:stop', async (event, profileId) => {
    return await launcherEngine.stopProfile(profileId);
  });

  ipcMain.handle('browser:launchBatch', async (event, profileIds) => {
    return await launcherEngine.launchBatch(profileIds);
  });

  ipcMain.handle('browser:stopAll', async () => {
    return await launcherEngine.stopAll();
  });

  // Proxy Management
  ipcMain.handle('proxy:create', async (event, proxyData) => {
    return await proxyManager.createProxy(proxyData);
  });

  ipcMain.handle('proxy:update', async (event, proxyId, proxyData) => {
    return await proxyManager.updateProxy(proxyId, proxyData);
  });

  ipcMain.handle('proxy:delete', async (event, proxyId) => {
    return await proxyManager.deleteProxy(proxyId);
  });

  ipcMain.handle('proxy:test', async (event, proxyData) => {
    return await proxyManager.testProxy(proxyData);
  });

  ipcMain.handle('proxy:getAll', async () => {
    return await proxyManager.getAllProxies();
  });

  // Fingerprint Management
  ipcMain.handle('fingerprint:generate', async (event, options) => {
    return await fingerprintEngine.generateFingerprint(options);
  });

  ipcMain.handle('fingerprint:validate', async (event, fingerprint) => {
    return await fingerprintEngine.validateFingerprint(fingerprint);
  });

  // Resource Monitoring
  ipcMain.handle('resources:getStats', async () => {
    return await resourceManager.getSystemStats();
  });

  ipcMain.handle('resources:getBrowserStats', async () => {
    return await resourceManager.getBrowserStats();
  });

  // Workspace Management
  ipcMain.handle('workspace:create', async (event, workspaceData) => {
    return await database.workspaces.create(workspaceData);
  });

  ipcMain.handle('workspace:getAll', async () => {
    return await database.workspaces.getAll();
  });

  ipcMain.handle('workspace:update', async (event, workspaceId, workspaceData) => {
    return await database.workspaces.update(workspaceId, workspaceData);
  });

  ipcMain.handle('workspace:delete', async (event, workspaceId) => {
    return await database.workspaces.delete(workspaceId);
  });

  // Diagnostics
  ipcMain.handle('diagnostics:getLogs', async (event, options) => {
    return await database.logs.getLogs(options);
  });

  ipcMain.handle('diagnostics:getSystemHealth', async () => {
    return await resourceManager.getSystemHealth();
  });

  // Settings
  ipcMain.handle('settings:get', async () => {
    return await database.settings.get();
  });

  ipcMain.handle('settings:update', async (event, settings) => {
    return await database.settings.update(settings);
  });
}

// Cleanup on quit
app.on('before-quit', async () => {
  if (launcherEngine) {
    await launcherEngine.stopAll();
  }
  
  if (database) {
    await database.close();
  }
});
