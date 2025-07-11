import React from 'react';

const Forecast = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">7-Day Forecast</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-3xl mb-2">☀️</div>
            <div className="font-bold text-lg mb-1">Day {i + 1}</div>
            <div className="text-gray-500 mb-1">28°C / 22°C</div>
            <div className="text-blue-600">Sunny</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast; 