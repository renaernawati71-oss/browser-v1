import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  darkMode: true,
  toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
  setDarkMode: (darkMode) => set({ darkMode }),
}));

export const useProfileStore = create((set) => ({
  profiles: [],
  selectedProfile: null,
  setProfiles: (profiles) => set({ profiles }),
  addProfile: (profile) => set((state) => ({ profiles: [...state.profiles, profile] })),
  updateProfile: (profileId, updates) =>
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === profileId ? { ...p, ...updates } : p)),
    })),
  deleteProfile: (profileId) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== profileId),
    })),
  setSelectedProfile: (profile) => set({ selectedProfile: profile }),
}));

export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  selectedWorkspace: null,
  setWorkspaces: (workspaces) => set({ workspaces }),
  addWorkspace: (workspace) => set((state) => ({ workspaces: [...state.workspaces, workspace] })),
  updateWorkspace: (workspaceId, updates) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) => (w.id === workspaceId ? { ...w, ...updates } : w)),
    })),
  deleteWorkspace: (workspaceId) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.id !== workspaceId),
    })),
  setSelectedWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
}));

export const useProxyStore = create((set) => ({
  proxies: [],
  selectedProxy: null,
  setProxies: (proxies) => set({ proxies }),
  addProxy: (proxy) => set((state) => ({ proxies: [...state.proxies, proxy] })),
  updateProxy: (proxyId, updates) =>
    set((state) => ({
      proxies: state.proxies.map((p) => (p.id === proxyId ? { ...p, ...updates } : p)),
    })),
  deleteProxy: (proxyId) =>
    set((state) => ({
      proxies: state.proxies.filter((p) => p.id !== proxyId),
    })),
  setSelectedProxy: (proxy) => set({ selectedProxy: proxy }),
}));

export const useResourceStore = create((set) => ({
  systemStats: null,
  browserStats: null,
  setSystemStats: (stats) => set({ systemStats: stats }),
  setBrowserStats: (stats) => set({ browserStats: stats }),
}));

export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  currentView: 'dashboard',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCurrentView: (view) => set({ currentView: view }),
}));
