import React, { useState } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NIGERIAN_CROPS } from '../services/cropAdvisoryService';

const CropSelector = ({ className = '' }) => {
  const { userCrops, updateUserCrops } = useWeather();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCropToggle = (crop) => {
    const updatedCrops = userCrops.includes(crop)
      ? userCrops.filter(c => c !== crop)
      : [...userCrops, crop];
    updateUserCrops(updatedCrops);
  };

  const filteredCrops = Object.entries(NIGERIAN_CROPS).flatMap(([category, crops]) =>
    crops.filter(crop => 
      crop.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(crop => ({ crop, category }))
  );

  const getCategoryColor = (category) => {
    const colors = {
      grains: 'bg-yellow-100 text-yellow-800',
      legumes: 'bg-green-100 text-green-800',
      tubers: 'bg-orange-100 text-orange-800',
      vegetables: 'bg-blue-100 text-blue-800',
      fruits: 'bg-purple-100 text-purple-800',
      cash_crops: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('selectCrops') || 'Select Your Crops'}
        </label>
        
        {/* Selected crops display */}
        <div className="flex flex-wrap gap-2 mb-3">
          {userCrops.map((crop) => (
            <span
              key={crop}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
            >
              {crop}
              <button
                onClick={() => handleCropToggle(crop)}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-600 hover:bg-green-200 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Dropdown trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <span className="text-gray-700">
            {userCrops.length === 0 
              ? (t('selectCrops') || 'Select crops...')
              : `${userCrops.length} ${t('cropsSelected') || 'crops selected'}`
            }
          </span>
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder={t('searchCrops') || 'Search crops...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Crop options */}
          <div className="py-1">
            {filteredCrops.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                {t('noCropsFound') || 'No crops found'}
              </div>
            ) : (
              filteredCrops.map(({ crop, category }) => (
                <label
                  key={crop}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={userCrops.includes(crop)}
                    onChange={() => handleCropToggle(crop)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{crop}</span>
                  <span className={`ml-auto px-2 py-1 text-xs rounded-full ${getCategoryColor(category)}`}>
                    {category.replace('_', ' ')}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CropSelector; 