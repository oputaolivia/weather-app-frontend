import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';

const WeatherCard = () => {
  const { weatherData, loading, error, getWeatherIcon } = useWeather();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="font-semibold">{t('error')}</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🌤️</div>
          <div>{t('noData')}</div>
        </div>
      </div>
    );
  }

  const { current, location } = weatherData;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t('currentWeather')}</h2>
          <p className="text-gray-500">{location}</p>
          <div className="flex items-center gap-4 mt-2">
            <img
              src={getWeatherIcon(current.icon)}
              alt={current.description}
              className="w-16 h-16"
            />
            <div>
              <span className="text-4xl font-bold">{current.temperature}{t('celsius')}</span>
              <p className="text-gray-400">
                {t('feelsLike')} {current.feelsLike}{t('celsius')}
              </p>
              <p className="text-green-600 capitalize">{current.description}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <div className="text-center">
            <div className="text-blue-500 text-2xl">💧</div>
            <div className="text-sm text-gray-600">{t('humidity')}</div>
            <div className="font-bold">{current.humidity}{t('percent')}</div>
          </div>
          <div className="text-center">
            <div className="text-green-500 text-2xl">💨</div>
            <div className="text-sm text-gray-600">{t('wind')}</div>
            <div className="font-bold">{current.windSpeed} {t('kilometers')}</div>
          </div>
        </div>
      </div>
      
      {/* Additional weather details */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-500">{t('pressure') || 'Pressure'}</div>
            <div className="font-semibold">{current.pressure} hPa</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">{t('visibility') || 'Visibility'}</div>
            <div className="font-semibold">{current.visibility} {t('kilometers')}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">{t('sunrise') || 'Sunrise'}</div>
            <div className="font-semibold">
              {current.sunrise.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">{t('sunset') || 'Sunset'}</div>
            <div className="font-semibold">
              {current.sunset.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 