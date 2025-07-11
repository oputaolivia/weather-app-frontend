import React, { useState} from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';
import WeatherCard from '../components/WeatherCard';
import CropAdvisoryCard from '../components/CropAdvisoryCard';

const Home = () => {
  const { weatherData, cropAdvisory, loading, error, location } = useWeather();
  console.log(location)
  const { t } = useLanguage();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-900">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Username
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-green-800">
              Surulere, Lagos, Nigeria
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm bg-blue-100 text-blue-700 rounded px-3 py-1">
            🔊 {t('audioAlerts') || 'Audio Alerts'}
          </button>
        </div>
      </header>

      {/* Current Weather */}
      <section className="mb-4">
        <WeatherCard />
      </section>

      {/* Weather Alert */}
      {weatherData?.alerts && weatherData.alerts.length > 0 && (
        <section className="mb-4">
          {weatherData.alerts.map((alert, index) => (
            <div key={index} className="bg-orange-50 border-l-4 border-orange-400 rounded p-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-orange-500">⚠️</span>
                <span className="font-semibold">{t('weatherAlert')}</span>
              </div>
              <p className="mt-2 text-orange-700">{alert.description}</p>
              <div className="mt-2 flex gap-2">
                <span className="bg-orange-200 text-orange-800 rounded px-2 py-1 text-xs">
                  {alert.type} Alert
                </span>
                <span className="bg-red-200 text-red-800 rounded px-2 py-1 text-xs">
                  {alert.severity === 'severe' || alert.severity === 'extreme' ? 'High Priority' : 'Medium Priority'}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 7-Day Forecast */}
      {weatherData?.forecast && (
        <section className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold mb-2">{t('sevenDayForecast')}</h2>
          <div className="grid grid-cols-7 gap-2 text-center">
            {weatherData.forecast.map((day, i) => (
              <div key={i} className="bg-blue-50 rounded p-2">
                <div className="font-bold text-sm">
                  {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="mx-auto w-8 h-8"
                />
                <div className="text-lg font-bold">{day.temp}°</div>
                <div className="text-xs text-gray-400">{day.tempMin}°</div>
                <div className="text-xs text-blue-600">{day.precipitation}%</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Crop Advisories */}
      <section className="mb-4">
        <CropAdvisoryCard />
      </section>

      {/* Community Updates */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">{t('communityUpdates')}</h2>
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              👨‍🌾
            </div>
            <div>
              <div className="font-bold">
                Adamu from Kano <span className="text-xs text-gray-400">2h ago</span>
              </div>
              <div>
                {t('communityUpdate1') || 'Heavy winds damaged my maize crops yesterday. Other farmers in the area should secure their farms.'}
              </div>
              <div className="flex gap-2 mt-1 text-blue-600 text-xs">
                <button>👍 12</button>
                <button>🔗 {t('share')}</button>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              👩‍🌾
            </div>
            <div>
              <div className="font-bold">
                Ngozi from Enugu <span className="text-xs text-gray-400">5h ago</span>
              </div>
              <div>
                {t('communityUpdate2') || 'Perfect weather for cassava harvesting this week. Getting good yields!'}
              </div>
              <div className="flex gap-2 mt-1 text-blue-600 text-xs">
                <button>👍 8</button>
                <button>🔗 {t('share')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 