import React from 'react';

const Alerts = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Weather Alerts</h1>
      <div className="bg-orange-50 border-l-4 border-orange-400 rounded p-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-orange-500">⚠️</span>
          <span className="font-semibold">Heavy Rainfall Expected</span>
        </div>
        <p className="mt-2 text-orange-700">Heavy rainfall expected tomorrow afternoon. Consider postponing outdoor farming activities.</p>
        <div className="mt-2 flex gap-2">
          <span className="bg-orange-200 text-orange-800 rounded px-2 py-1 text-xs">Rain Alert</span>
          <span className="bg-red-200 text-red-800 rounded px-2 py-1 text-xs">High Priority</span>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">ℹ️</span>
          <span className="font-semibold">Wind Advisory</span>
        </div>
        <p className="mt-2 text-blue-700">Strong winds expected in the northern region. Secure your crops and farm structures.</p>
        <div className="mt-2 flex gap-2">
          <span className="bg-blue-200 text-blue-800 rounded px-2 py-1 text-xs">Wind Alert</span>
        </div>
      </div>
    </div>
  );
};

export default Alerts; 