import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Shield, 
  Fingerprint, 
  Puzzle, 
  Layers, 
  Settings, 
  FileText, 
  Activity 
} from 'lucide-react';
import { useUIStore } from '../store/themeStore';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/profiles', icon: Users, label: 'Profiles' },
  { path: '/workspaces', icon: FolderKanban, label: 'Workspaces' },
  { path: '/proxies', icon: Shield, label: 'Proxies' },
  { path: '/fingerprints', icon: Fingerprint, label: 'Fingerprints' },
  { path: '/extensions', icon: Puzzle, label: 'Extensions' },
  { path: '/batch', icon: Layers, label: 'Batch Manager' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/logs', icon: FileText, label: 'Logs' },
  { path: '/diagnostics', icon: Activity, label: 'Diagnostics' },
];

function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside 
      className={`glass border-r border-dark-border flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">MB</span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-white truncate">Browser Workspace</h1>
              <p className="text-xs text-gray-500">Enterprise Edition</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-dark-border">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
            />
          </svg>
          {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
