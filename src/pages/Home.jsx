import React, { useState} from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import WeatherCard from '../components/WeatherCard';
import CropAdvisoryCard from '../components/CropAdvisoryCard';

const Home = () => {
  // MOCK DATA (replace API calls for now)
const { user } = useUser() // to be used to access user's name for the salutations. Not yet available.

  const mockWeatherData = {
    current: {
      temperature: 28,
      feelsLike: 30,
      humidity: 75,
      windSpeed: 12,
      description: 'Partly cloudy',
      icon: '03d',
      city: 'Surulere',
      country: 'NG',
      pressure: 1012,
      visibility: 8,
      sunrise: new Date(),
      sunset: new Date(),
    },
    forecast: [
      { date: new Date(), temp: 28, tempMin: 24, tempMax: 30, description: 'Partly cloudy', icon: '03d', humidity: 75, windSpeed: 12, precipitation: 20 },
      { date: new Date(Date.now() + 86400000), temp: 29, tempMin: 25, tempMax: 31, description: 'Sunny', icon: '01d', humidity: 70, windSpeed: 10, precipitation: 10 },
      { date: new Date(Date.now() + 2*86400000), temp: 27, tempMin: 23, tempMax: 29, description: 'Rainy', icon: '09d', humidity: 80, windSpeed: 15, precipitation: 60 },
      { date: new Date(Date.now() + 3*86400000), temp: 26, tempMin: 22, tempMax: 28, description: 'Thunderstorm', icon: '11d', humidity: 85, windSpeed: 20, precipitation: 80 },
      { date: new Date(Date.now() + 4*86400000), temp: 30, tempMin: 26, tempMax: 32, description: 'Sunny', icon: '01d', humidity: 65, windSpeed: 8, precipitation: 5 },
      { date: new Date(Date.now() + 5*86400000), temp: 31, tempMin: 27, tempMax: 33, description: 'Sunny', icon: '01d', humidity: 60, windSpeed: 7, precipitation: 0 },
      { date: new Date(Date.now() + 6*86400000), temp: 29, tempMin: 25, tempMax: 31, description: 'Cloudy', icon: '03d', humidity: 72, windSpeed: 9, precipitation: 15 },
    ],
    alerts: [
      {
        description: 'Heavy rainfall expected tomorrow afternoon. Consider postponing outdoor farming activities.',
        type: 'rain',
        severity: 'severe',
      },
      {
        description: 'Strong winds expected in the northern region. Secure your crops and farm structures.',
        type: 'wind',
        severity: 'moderate',
      },
    ],
    location: 'Surulere, Lagos, Nigeria',
  };

  const mockCropAdvisory = {
    immediateActions: [
      { crop: 'Maize', action: 'Irrigate fields early in the morning.', priority: 'high' },
      { crop: 'Cassava', action: 'Check for waterlogging after rain.', priority: 'medium' },
    ],
    weatherRecommendations: [
      { type: 'Rain', description: 'Delay fertilizer application until after rainfall.' },
    ],
    risks: [
      { risk: 'Flooding', mitigation: 'Improve drainage in low-lying areas.' },
    ],
    optimalTiming: [
      { activity: 'Planting', timing: 'Best done in the early morning this week.' },
    ],
    generalTips: [
      'Monitor weather updates daily.',
      'Store harvested crops in a dry place.',
    ],
  };

  // Reserve API-related code for later use
  // const { weatherData, cropAdvisory, loading, error, location } = useWeather();
  // const { t } = useLanguage();

  const t = (key) => key; // Mock translation function for now
  const weatherData = mockWeatherData;
  const cropAdvisory = mockCropAdvisory;
  const loading = false;
  const error = null;
  const location = mockWeatherData.location;

  console.log(location)
  // const { t } = useLanguage();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-900">
Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user.firstName || 'Username'}</h1>

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



