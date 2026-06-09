import React from 'react';
import { Activity } from 'lucide-react';

function Diagnostics() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Diagnostics</h1>
          <p className="text-gray-400">System health and diagnostic information</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
          <Activity className="w-4 h-4" />
          <span>Run Diagnostics</span>
        </button>
      </div>

      <div className="glass rounded-xl p-12">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">System Diagnostics</h2>
          <p className="text-gray-400">Click "Run Diagnostics" to check system health</p>
        </div>
      </div>
    </div>
  );
}

export default Diagnostics;
