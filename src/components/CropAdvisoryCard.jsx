import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';

const CropAdvisoryCard = () => {
  const { cropAdvisory, userCrops, weatherData } = useWeather();
  const { t } = useLanguage();

  if (!userCrops.length) {
    return (
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="text-center">
          <div className="text-blue-500 text-3xl mb-2">🌾</div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            {t('noCropsSelected') || 'No Crops Selected'}
          </h3>
          <p className="text-blue-600">
            {t('selectCropsForAdvisory') || 'Select your crops in the profile to get personalized farming advice.'}
          </p>
        </div>
      </div>
    );
  }

  if (!cropAdvisory) {
    return (
      <div className="bg-green-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-green-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-green-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const { immediateActions, weatherRecommendations, risks, optimalTiming, generalTips } = cropAdvisory;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t('cropAdvisories')}</h2>
      
      {/* Immediate Actions */}
      {immediateActions && immediateActions.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 rounded p-4">
          <h3 className="font-semibold text-red-800 mb-2">
            {t('immediateActions') || 'Immediate Actions'}
          </h3>
          <div className="space-y-2">
            {immediateActions.map((action, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  action.priority === 'high' ? 'bg-red-200 text-red-800' :
                  action.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {action.priority}
                </span>
                <div>
                  <span className="font-medium">{action.crop}:</span> {action.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Recommendations */}
      {weatherRecommendations && weatherRecommendations.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            {t('weatherRecommendations') || 'Weather Recommendations'}
          </h3>
          <div className="space-y-2">
            {weatherRecommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-800">
                  {rec.type}
                </span>
                <span>{rec.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks and Mitigation */}
      {risks && risks.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 rounded p-4">
          <h3 className="font-semibold text-orange-800 mb-2">
            {t('risksAndMitigation') || 'Risks & Mitigation'}
          </h3>
          <div className="space-y-2">
            {risks.map((risk, index) => (
              <div key={index} className="space-y-1">
                <div className="font-medium text-orange-700">⚠️ {risk.risk}</div>
                <div className="text-orange-600 text-sm">💡 {risk.mitigation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimal Timing */}
      {optimalTiming && optimalTiming.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 rounded p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            {t('optimalTiming') || 'Optimal Timing'}
          </h3>
          <div className="space-y-2">
            {optimalTiming.map((timing, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-800">
                  ⏰
                </span>
                <div>
                  <span className="font-medium">{timing.activity}:</span> {timing.timing}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Tips */}
      {generalTips && generalTips.length > 0 && (
        <div className="bg-purple-50 border-l-4 border-purple-400 rounded p-4">
          <h3 className="font-semibold text-purple-800 mb-2">
            {t('generalTips') || 'General Tips'}
          </h3>
          <ul className="space-y-1">
            {generalTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span className="text-purple-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Audio button */}
      <div className="flex justify-center mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          🔊 {t('listen')}
        </button>
      </div>
    </div>
  );
};

export default CropAdvisoryCard; 