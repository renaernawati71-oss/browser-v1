import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProfileManager from './pages/ProfileManager';
import WorkspaceManager from './pages/WorkspaceManager';
import ProxyManager from './pages/ProxyManager';
import FingerprintManager from './pages/FingerprintManager';
import ExtensionManager from './pages/ExtensionManager';
import BatchManager from './pages/BatchManager';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import Diagnostics from './pages/Diagnostics';

function App() {
  const { darkMode } = useThemeStore();

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profiles" element={<ProfileManager />} />
          <Route path="/workspaces" element={<WorkspaceManager />} />
          <Route path="/proxies" element={<ProxyManager />} />
          <Route path="/fingerprints" element={<FingerprintManager />} />
          <Route path="/extensions" element={<ExtensionManager />} />
          <Route path="/batch" element={<BatchManager />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
