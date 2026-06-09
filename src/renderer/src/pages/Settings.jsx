import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

function Settings() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your application preferences</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">General</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-sm text-gray-400">Enable dark theme</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-blue-600 relative">
                <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto Backup</p>
                <p className="text-sm text-gray-400">Automatically backup profiles</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-blue-600 relative">
                <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Browser Settings */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Browser Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Concurrent Browsers</label>
              <input
                type="number"
                defaultValue={50}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Browser Timeout (ms)</label>
              <input
                type="number"
                defaultValue={30000}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Resource Limits */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Resource Limits</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max RAM Usage (GB)</label>
              <input
                type="number"
                defaultValue={16}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max CPU Usage (%)</label>
              <input
                type="number"
                defaultValue={80}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
