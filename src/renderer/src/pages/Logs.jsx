import React from 'react';
import { FileText } from 'lucide-react';

function Logs() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Logs</h1>
          <p className="text-gray-400">View application logs and history</p>
        </div>
      </div>

      <div className="glass rounded-xl p-12">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Logs Yet</h2>
          <p className="text-gray-400">Application logs will appear here</p>
        </div>
      </div>
    </div>
  );
}

export default Logs;
