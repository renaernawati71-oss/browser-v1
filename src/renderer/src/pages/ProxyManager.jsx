import React from 'react';
import { Plus, Shield } from 'lucide-react';

function ProxyManager() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Proxy Manager</h1>
          <p className="text-gray-400">Manage your proxy configurations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Proxy</span>
        </button>
      </div>

      <div className="glass rounded-xl p-12">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Proxies Yet</h2>
          <p className="text-gray-400">Add your first proxy to get started</p>
        </div>
      </div>
    </div>
  );
}

export default ProxyManager;
