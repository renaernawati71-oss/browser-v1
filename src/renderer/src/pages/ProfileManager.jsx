import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Square, 
  Copy, 
  Trash2,
  Edit,
  RefreshCw
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProfileStore } from '../store/themeStore';

function ProfileManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  const { profiles, setProfiles, setSelectedProfile } = useProfileStore();

  // Fetch profiles
  const { data: profilesData, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      if (window.electronAPI?.profile) {
        const result = await window.electronAPI.profile.getAll();
        setProfiles(result);
        return result;
      }
      return [];
    },
  });

  // Launch profile mutation
  const launchMutation = useMutation({
    mutationFn: async (profileId) => {
      if (window.electronAPI?.browser) {
        return await window.electronAPI.browser.launch(profileId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
    },
  });

  // Stop profile mutation
  const stopMutation = useMutation({
    mutationFn: async (profileId) => {
      if (window.electronAPI?.browser) {
        return await window.electronAPI.browser.stop(profileId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
    },
  });

  // Delete profile mutation
  const deleteMutation = useMutation({
    mutationFn: async (profileId) => {
      if (window.electronAPI?.profile) {
        return await window.electronAPI.profile.delete(profileId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
    },
  });

  // Clone profile mutation
  const cloneMutation = useMutation({
    mutationFn: async (profileId) => {
      if (window.electronAPI?.profile) {
        return await window.electronAPI.profile.clone(profileId, {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
    },
  });

  const filteredProfiles = profilesData?.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (profile.workspace_name && profile.workspace_name.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleLaunch = async (profileId) => {
    await launchMutation.mutateAsync(profileId);
  };

  const handleStop = async (profileId) => {
    await stopMutation.mutateAsync(profileId);
  };

  const handleDelete = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      await deleteMutation.mutateAsync(profileId);
    }
  };

  const handleClone = async (profileId) => {
    await cloneMutation.mutateAsync(profileId);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      running: 'bg-green-500/20 text-green-400 border-green-500/30',
      stopped: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      crashed: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.stopped}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile Manager</h1>
          <p className="text-gray-400">Manage your browser profiles</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => queryClient.invalidateQueries(['profiles'])}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Profile</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Profile List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400 mb-2">No profiles found</p>
          <p className="text-sm text-gray-500">Create your first profile to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="glass rounded-xl p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Profile Icon */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Profile Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(profile.status)}
                      <span className="text-sm text-gray-400">
                        {profile.workspace_name || 'No workspace'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {profile.status === 'running' ? (
                    <button
                      onClick={() => handleStop(profile.id)}
                      className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors"
                      title="Stop"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLaunch(profile.id)}
                      className="p-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 transition-colors"
                      title="Launch"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleClone(profile.id)}
                    className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors"
                    title="Clone"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Browser Engine</p>
                  <p className="text-white">{profile.browser_engine || 'Chromium'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Startup URL</p>
                  <p className="text-white truncate">{profile.startup_url || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Proxy</p>
                  <p className="text-white">
                    {profile.proxy_host ? `${profile.proxy_host}:${profile.proxy_port}` : 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Login</p>
                  <p className="text-white">
                    {profile.last_login ? new Date(profile.last_login).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Profile Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Profile Name</label>
                <input
                  type="text"
                  placeholder="Enter profile name"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Startup URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileManager;
