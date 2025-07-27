import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';

const Forecast = () => {
  const { weatherData, loading, error, refreshWeather } = useWeather();
  const { t } = useLanguage();

  // Helper function to get day name
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return t('today');
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t('tomorrow');
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  };

  // Helper function to get weather icon
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Helper function to get weather emoji
  const getWeatherEmoji = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('storm')) return '⛈️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
    if (desc.includes('wind')) return '💨';
    return '🌤️';
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('error')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refreshWeather}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData || !weatherData.forecast) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🌤️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('noData')}</h2>
          <p className="text-gray-600 mb-4">{t('forecastNotAvailable')}</p>
          <button 
            onClick={refreshWeather}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('refresh')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('sevenDayForecast')}</h1>
          <button 
            onClick={refreshWeather}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            {t('refresh')}
          </button>
        </div>

        {/* Current Weather Summary */}
        {weatherData.current && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('currentWeather')}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={getWeatherIcon(weatherData.current.icon)} 
                  alt={weatherData.current.description}
                  className="w-16 h-16"
                />
                <div>
                  <div className="text-3xl font-bold">{Math.round(weatherData.current.temp || weatherData.current.temperature)}{t('celsius')}</div>
                  <div className="text-gray-600">{weatherData.current.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{t('feelsLike')}</div>
                <div className="font-semibold">{Math.round(weatherData.current.feels_like || weatherData.current.feelsLike)}{t('celsius')}</div>
              </div>
            </div>
          </div>
        )}

        {/* 7-Day Forecast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weatherData.forecast.slice(0, 7).map((day, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">
                {getWeatherEmoji(day.description)}
              </div>
              <div className="font-bold text-lg mb-1 text-center">
                {getDayName(day.date)}
              </div>
              <div className="text-gray-500 mb-2 text-center">
                {Math.round(day.tempMax || day.maxTemp)}{t('celsius')} / {Math.round(day.tempMin || day.minTemp)}{t('celsius')}
              </div>
              <div className="text-blue-600 text-center mb-3">
                {day.description}
              </div>
              
              {/* Additional weather details */}
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('humidity')}:</span>
                  <span>{day.humidity}{t('percent')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('wind')}:</span>
                  <span>{Math.round(day.windSpeed || day.wind_speed)} {t('kilometers')}</span>
                </div>
                {day.precipitation && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('precipitation')}:</span>
                    <span>{day.precipitation} {t('millimeters')}</span>
                  </div>
                )}
              </div>
          </div>
        ))}
        </div>

        {/* Location Info */}
        {weatherData.location && (
          <div className="mt-6 text-center text-gray-600">
            <p>{t('forecastFor')}: {weatherData.location}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast; 