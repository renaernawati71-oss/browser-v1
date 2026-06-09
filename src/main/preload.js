const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Profile Management
  profile: {
    create: (profileData) => ipcRenderer.invoke('profile:create', profileData),
    update: (profileId, profileData) => ipcRenderer.invoke('profile:update', profileId, profileData),
    delete: (profileId) => ipcRenderer.invoke('profile:delete', profileId),
    getAll: () => ipcRenderer.invoke('profile:getAll'),
    getById: (profileId) => ipcRenderer.invoke('profile:getById', profileId),
    clone: (profileId, cloneOptions) => ipcRenderer.invoke('profile:clone', profileId, cloneOptions),
  },

  // Browser Management
  browser: {
    launch: (profileId) => ipcRenderer.invoke('browser:launch', profileId),
    stop: (profileId) => ipcRenderer.invoke('browser:stop', profileId),
    launchBatch: (profileIds) => ipcRenderer.invoke('browser:launchBatch', profileIds),
    stopAll: () => ipcRenderer.invoke('browser:stopAll'),
  },

  // Proxy Management
  proxy: {
    create: (proxyData) => ipcRenderer.invoke('proxy:create', proxyData),
    update: (proxyId, proxyData) => ipcRenderer.invoke('proxy:update', proxyId, proxyData),
    delete: (proxyId) => ipcRenderer.invoke('proxy:delete', proxyId),
    test: (proxyData) => ipcRenderer.invoke('proxy:test', proxyData),
    getAll: () => ipcRenderer.invoke('proxy:getAll'),
  },

  // Fingerprint Management
  fingerprint: {
    generate: (options) => ipcRenderer.invoke('fingerprint:generate', options),
    validate: (fingerprint) => ipcRenderer.invoke('fingerprint:validate', fingerprint),
  },

  // Resource Monitoring
  resources: {
    getStats: () => ipcRenderer.invoke('resources:getStats'),
    getBrowserStats: () => ipcRenderer.invoke('resources:getBrowserStats'),
  },

  // Workspace Management
  workspace: {
    create: (workspaceData) => ipcRenderer.invoke('workspace:create', workspaceData),
    getAll: () => ipcRenderer.invoke('workspace:getAll'),
    update: (workspaceId, workspaceData) => ipcRenderer.invoke('workspace:update', workspaceId, workspaceData),
    delete: (workspaceId) => ipcRenderer.invoke('workspace:delete', workspaceId),
  },

  // Diagnostics
  diagnostics: {
    getLogs: (options) => ipcRenderer.invoke('diagnostics:getLogs', options),
    getSystemHealth: () => ipcRenderer.invoke('diagnostics:getSystemHealth'),
  },

  // Settings
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (settings) => ipcRenderer.invoke('settings:update', settings),
  },

  // App info
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPath: (name) => ipcRenderer.invoke('app:getPath', name),
});
