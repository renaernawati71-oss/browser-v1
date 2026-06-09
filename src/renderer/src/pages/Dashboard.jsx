import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Globe, 
  Users, 
  Zap, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Fetch system stats
  const { data: systemStats, isLoading: systemLoading } = useQuery({
    queryKey: ['systemStats'],
    queryFn: async () => {
      if (window.electronAPI?.resources) {
        return await window.electronAPI.resources.getStats();
      }
      return null;
    },
    refetchInterval: refreshInterval,
  });

  // Fetch browser stats
  const { data: browserStats, isLoading: browserLoading } = useQuery({
    queryKey: ['browserStats'],
    queryFn: async () => {
      if (window.electronAPI?.resources) {
        return await window.electronAPI.resources.getBrowserStats();
      }
      return null;
    },
    refetchInterval: refreshInterval,
  });

  // Fetch profiles
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      if (window.electronAPI?.profile) {
        return await window.electronAPI.profile.getAll();
      }
      return [];
    },
  });

  const stats = [
    {
      title: 'Total Profiles',
      value: profiles?.length || 0,
      icon: Users,
      color: 'blue',
      trend: '+12%',
    },
    {
      title: 'Active Browsers',
      value: browserStats?.count || 0,
      icon: Activity,
      color: 'green',
      trend: '+5%',
    },
    {
      title: 'CPU Usage',
      value: systemStats?.cpu?.usage ? `${systemStats.cpu.usage.toFixed(1)}%` : '0%',
      icon: Cpu,
      color: 'orange',
      trend: '+2%',
    },
    {
      title: 'Memory Usage',
      value: systemStats?.memory?.usagePercent ? `${systemStats.memory.usagePercent.toFixed(1)}%` : '0%',
      icon: HardDrive,
      color: 'purple',
      trend: '+8%',
    },
  ];

  const recentProfiles = profiles?.slice(0, 5) || [];

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Monitor your browser workspace platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
            green: 'from-green-500/20 to-green-600/20 border-green-500/30',
            orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
            purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
          };

          return (
            <div
              key={stat.title}
              className={`glass-light rounded-xl p-6 border ${colorClasses[stat.color]} backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[stat.color]}`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <p className="text-sm text-gray-400">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Profiles */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Profiles</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
          
          {profilesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : recentProfiles.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No profiles yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{profile.name}</p>
                      <p className="text-xs text-gray-400">{profile.workspace_name || 'No workspace'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.status === 'running' ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Running</span>
                      </div>
                    ) : profile.status === 'stopped' ? (
                      <div className="flex items-center gap-1 text-gray-400">
                        <PauseCircle className="w-4 h-4" />
                        <span className="text-xs">Stopped</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs">Crashed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Resources */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">System Resources</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Auto-refresh</span>
            </div>
          </div>

          {systemLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="loading-spinner"></div>
            </div>
          ) : systemStats ? (
            <div className="space-y-6">
              {/* CPU */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">CPU Usage</span>
                  <span className="text-sm font-medium text-white">
                    {systemStats.cpu?.usage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${systemStats.cpu?.usage || 0}%` }}
                  />
                </div>
              </div>

              {/* Memory */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Memory Usage</span>
                  <span className="text-sm font-medium text-white">
                    {systemStats.memory?.usagePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-teal-600 transition-all duration-500"
                    style={{ width: `${systemStats.memory?.usagePercent || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {(systemStats.memory?.used / (1024 * 1024 * 1024)).toFixed(2)} GB / 
                  {(systemStats.memory?.total / (1024 * 1024 * 1024)).toFixed(2)} GB
                </p>
              </div>

              {/* Browser Stats */}
              {browserStats && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Browser Memory</span>
                    <span className="text-sm font-medium text-white">
                      {(browserStats.totalMemory / (1024 * 1024 * 1024)).toFixed(2)} GB
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500"
                      style={{ width: `${Math.min((browserStats.totalMemory / systemStats.memory?.used) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No resource data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 rounded-lg bg-blue-600/20 border border-blue-600/30 hover:bg-blue-600/30 transition-colors">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Launch All Profiles</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-green-600/20 border border-green-600/30 hover:bg-green-600/30 transition-colors">
            <Globe className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-white">Test All Proxies</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-purple-600/20 border border-purple-600/30 hover:bg-purple-600/30 transition-colors">
            <AlertTriangle className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-white">Run Diagnostics</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
