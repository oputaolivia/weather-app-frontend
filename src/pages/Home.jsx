import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudSun, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  AlertTriangle,
  Home,
  BarChart3,
  Calendar,
  Users,
  Bell,
  Menu,
  X,
  Volume2,
  Headphones,
  //testing
  AlertCircle, User, LogIn
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getUser } from '../services/userService';
import { getCookie } from '../services/cookies';
import {useUser} from '../contexts/UserContext'

const FarmWeatherApp = () => {
  const {user} = useUser();
  const { t, currentLanguage } = useLanguage();
  const [translatedWeather, setTranslatedWeather] = useState(null);
  const [translatedAdvisory, setTranslatedAdvisory] = useState(null);

  // Mock data
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
      { date: new Date(), temp: 28, tempMin: 24, tempMax: 30, description: 'Rainy', icon: '09d', humidity: 75, windSpeed: 12, precipitation: 20 },
      { date: new Date(Date.now() + 86400000), temp: 29, tempMin: 25, tempMax: 31, description: 'Sunny', icon: '01d', humidity: 70, windSpeed: 10, precipitation: 10 },
      { date: new Date(Date.now() + 2*86400000), temp: 27, tempMin: 23, tempMax: 29, description: 'Cloudy', icon: '03d', humidity: 80, windSpeed: 15, precipitation: 60 },
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
      }
    ],
    location: 'Kano, Nigeria',
  };


  const mockCropAdvisory = {
    immediateActions: [
      { crop: 'Maize', action: 'Heavy rain expected. Ensure proper drainage to prevent waterlogging. Harvest ready crops immediately.', priority: 'high' },
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

  useEffect(() => {
    const translateMockData = async () => {
      const ts = require('../services/translationService').default;
      const lang = currentLanguage;
      // Weather
      const translatedCurrentDesc = await ts.translateText(mockWeatherData.current.description, lang, 'en');
      const forecastDescs = mockWeatherData.forecast.map(day => day.description);
      const translatedForecastDescs = await ts.translateMultiple(forecastDescs, lang, 'en');
      const alertDescs = mockWeatherData.alerts.map(alert => alert.description);
      const translatedAlertDescs = alertDescs.length > 0 ? await ts.translateMultiple(alertDescs, lang, 'en') : [];
      setTranslatedWeather({
        ...mockWeatherData,
        current: { ...mockWeatherData.current, description: translatedCurrentDesc },
        forecast: mockWeatherData.forecast.map((day, i) => ({ ...day, description: translatedForecastDescs[i] })),
        alerts: mockWeatherData.alerts.map((alert, i) => ({ ...alert, description: translatedAlertDescs[i] })),
      });
      // Crop Advisory
      const actions = mockCropAdvisory.immediateActions || [];
      const actionTexts = actions.map(a => a.action);
      const translatedActions = actionTexts.length > 0 ? await ts.translateMultiple(actionTexts, lang, 'en') : [];
      const recs = mockCropAdvisory.weatherRecommendations || [];
      const recTexts = recs.map(r => r.description);
      const translatedRecs = recTexts.length > 0 ? await ts.translateMultiple(recTexts, lang, 'en') : [];
      const risks = mockCropAdvisory.risks || [];
      const riskTexts = risks.map(r => r.risk);
      const mitigationTexts = risks.map(r => r.mitigation);
      const translatedRisks = riskTexts.length > 0 ? await ts.translateMultiple(riskTexts, lang, 'en') : [];
      const translatedMitigations = mitigationTexts.length > 0 ? await ts.translateMultiple(mitigationTexts, lang, 'en') : [];
      const timings = mockCropAdvisory.optimalTiming || [];
      const timingTexts = timings.map(t => t.timing);
      const translatedTimings = timingTexts.length > 0 ? await ts.translateMultiple(timingTexts, lang, 'en') : [];
      const tips = mockCropAdvisory.generalTips || [];
      const translatedTips = tips.length > 0 ? await ts.translateMultiple(tips, lang, 'en') : [];
      setTranslatedAdvisory({
        ...mockCropAdvisory,
        immediateActions: actions.map((a, i) => ({ ...a, action: translatedActions[i] })),
        weatherRecommendations: recs.map((r, i) => ({ ...r, description: translatedRecs[i] })),
        risks: risks.map((r, i) => ({ ...r, risk: translatedRisks[i], mitigation: translatedMitigations[i] })),
        optimalTiming: timings.map((t, i) => ({ ...t, timing: translatedTimings[i] })),
        generalTips: translatedTips
      });
    };
    translateMockData();
  }, [currentLanguage]);

  const getWeatherIcon = (iconCode, size = 'w-8 h-8') => {
    const iconMap = {
      '01d': <Sun className={`${size} text-yellow-500`} />,
      '01n': <Sun className={`${size} text-yellow-400`} />,
      '02d': <Cloud className={`${size} text-gray-500`} />,
      '02n': <Cloud className={`${size} text-gray-400`} />,
      '03d': <Cloud className={`${size} text-gray-500`} />,
      '03n': <Cloud className={`${size} text-gray-400`} />,
      '04d': <Cloud className={`${size} text-gray-600`} />,
      '04n': <Cloud className={`${size} text-gray-500`} />,
      '09d': <CloudRain className={`${size} text-blue-500`} />,
      '09n': <CloudRain className={`${size} text-blue-400`} />,
      '10d': <CloudRain className={`${size} text-blue-500`} />,
      '10n': <CloudRain className={`${size} text-blue-400`} />,
      '11d': <CloudRain className={`${size} text-purple-500`} />,
      '11n': <CloudRain className={`${size} text-purple-400`} />,
      '13d': <Cloud className={`${size} text-blue-300`} />,
      '13n': <Cloud className={`${size} text-blue-200`} />,
      '50d': <Cloud className={`${size} text-gray-400`} />,
      '50n': <Cloud className={`${size} text-gray-300`} />,
    };
    return iconMap[iconCode] || <Sun className={`${size} text-yellow-500`} />;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );

  // Use translatedWeather and translatedAdvisory for all UI rendering
  const weather = translatedWeather || mockWeatherData;
  const advisory = translatedAdvisory || mockCropAdvisory;

  // Add a loading check for weather data and alerts
  if (!weather || !weather.current || !weather.forecast || !Array.isArray(weather.alerts)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-gray-500 text-lg">{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[40px] md:pt-[50px] bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* <NavigationBar /> */}
      
      <div className="pt-24 sm:pt-20 md:pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            {(t('good') || 'Good')} {getTimeOfDay()}, {user ? user.data.firstName : 'Guest'}!
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-600">
            <p className="text-sm sm:text-base text-gray-600">
              {user?.data?.location?.city && user?.data?.location?.state
                ? `${user?.data.location.city}, ${user?.data.location.state}, Nigeria`
                : 'Kano, Nigeria'}
            </p>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <Headphones className="w-4 h-4" />
                <span className="text-sm">{t('audioAlerts') || 'Audio Alerts'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Weather Alert */}
        {weather.alerts.length > 0 && (
          <GlassCard className="mb-6 p-4 border-l-4 border-red-500 bg-red-50/80">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">{t('heavyRainAlert') || 'Heavy Rain Alert'}</h3>
                <p className="text-red-800 text-sm mb-3">
                  {weather.alerts[0].description}
                </p>
                <div className="flex gap-2">
                  <span className="bg-red-200 text-red-800 rounded-full px-3 py-1 text-xs font-medium">
                    {t('rainAlert') || 'Rain Alert'}
                  </span>
                  <span className="bg-orange-200 text-orange-800 rounded-full px-3 py-1 text-xs font-medium">
                    {t('highPriority') || 'High Priority'}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather Card */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('todaysWeather') || "Today's Weather"}</h2>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    {getWeatherIcon(weather.current.icon, 'w-16 h-16')}
                    <div>
                      <div className="text-4xl font-bold text-gray-900">
                        {weather.current.temperature}°C
                      </div>
                      <div className="text-gray-600 capitalize">
                        {weather.current.description}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span>{t('feelsLike') || 'Feels like'} {weather.current.feelsLike}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-blue-500" />
                      <span>{weather.current.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span>{weather.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-gray-500" />
                      <span>{weather.current.pressure} hPa</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Sunrise className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Sunrise</span>
                    </div>
                    <span className="text-sm font-medium">6:25 AM</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Sunset className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Sunset</span>
                    </div>
                    <span className="text-sm font-medium">6:45 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Visibility</span>
                    </div>
                    <span className="text-sm font-medium">{weather.current.visibility} km</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* 7-Day Forecast */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('sevenDayForecast') || '7-Day Forecast'}</h2>
              <div className="grid grid-cols-7 gap-2">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center p-3 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors">
                    <div className="font-medium text-sm text-gray-700 mb-2">
                      {formatDate(day.date)}
                    </div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.icon, 'w-6 h-6')}
                    </div>
                    <div className="text-lg font-bold text-gray-900">{day.temp}°</div>
                    <div className="text-xs text-gray-500">{day.tempMin}°</div>
                    <div className="text-xs text-blue-600 mt-1">{day.precipitation}%</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Crop Advisory */}
          <div>
            <GlassCard className="p-6 mb-6 bg-gradient-to-br from-emerald-50 to-green-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{t('cropAdvisory') || 'Crop Advisory'}</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Maize Farming</h3>
                      <p className="text-sm text-gray-700">
                        {advisory.immediateActions[0].action}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-600 text-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="w-4 h-4" />
                    <span className="font-medium">Listen to Audio</span>
                  </div>
                  <p className="text-sm text-emerald-100">
                    Get detailed farming guidance in your local language
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Community Updates */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('communityUpdates') || 'Community Updates'}</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">👨‍🌾</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Adamu {t('from') || 'from'} Kano</span>
                      <span className="text-xs text-gray-500">2{t('hoursAgo') || 'h ago'}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Heavy winds damaged my maize crops yesterday. Other farmers in the area should secure their farms.
                    </p>
                    <div className="flex gap-3 text-xs">
                      <button className="text-blue-600 hover:text-blue-800">👍 12</button>
                      <button className="text-blue-600 hover:text-blue-800">🔗 {t('share') || 'Share'}</button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">👩‍🌾</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Ngozi {t('from') || 'from'} Enugu</span>
                      <span className="text-xs text-gray-500">5{t('hoursAgo') || 'h ago'}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Perfect weather for cassava harvesting this week. Getting good yields!
                    </p>
                    <div className="flex gap-3 text-xs">
                      <button className="text-blue-600 hover:text-blue-800">👍 8</button>
                      <button className="text-blue-600 hover:text-blue-800">🔗 {t('share') || 'Share'}</button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      {/* <BottomNavigation /> */}
    </div>
  );
};

export default FarmWeatherApp;



// import React, { useState} from 'react';
// import { useWeather } from '../contexts/WeatherContext';
// import { useLanguage } from '../contexts/LanguageContext';
// import { useUser } from '../contexts/UserContext';
// import WeatherCard from '../components/WeatherCard';
// import CropAdvisoryCard from '../components/CropAdvisoryCard';

// const Home = () => {
//   // MOCK DATA (replace API calls for now)
// const { user } = useUser() // to be used to access user's name for the salutations. Not yet available.

//   const mockWeatherData = {
//     current: {
//       temperature: 28,
//       feelsLike: 30,
//       humidity: 75,
//       windSpeed: 12,
//       description: 'Partly cloudy',
//       icon: '03d',
//       city: 'Surulere',
//       country: 'NG',
//       pressure: 1012,
//       visibility: 8,
//       sunrise: new Date(),
//       sunset: new Date(),
//     },
//     forecast: [
//       { date: new Date(), temp: 28, tempMin: 24, tempMax: 30, description: 'Partly cloudy', icon: '03d', humidity: 75, windSpeed: 12, precipitation: 20 },
//       { date: new Date(Date.now() + 86400000), temp: 29, tempMin: 25, tempMax: 31, description: 'Sunny', icon: '01d', humidity: 70, windSpeed: 10, precipitation: 10 },
//       { date: new Date(Date.now() + 2*86400000), temp: 27, tempMin: 23, tempMax: 29, description: 'Rainy', icon: '09d', humidity: 80, windSpeed: 15, precipitation: 60 },
//       { date: new Date(Date.now() + 3*86400000), temp: 26, tempMin: 22, tempMax: 28, description: 'Thunderstorm', icon: '11d', humidity: 85, windSpeed: 20, precipitation: 80 },
//       { date: new Date(Date.now() + 4*86400000), temp: 30, tempMin: 26, tempMax: 32, description: 'Sunny', icon: '01d', humidity: 65, windSpeed: 8, precipitation: 5 },
//       { date: new Date(Date.now() + 5*86400000), temp: 31, tempMin: 27, tempMax: 33, description: 'Sunny', icon: '01d', humidity: 60, windSpeed: 7, precipitation: 0 },
//       { date: new Date(Date.now() + 6*86400000), temp: 29, tempMin: 25, tempMax: 31, description: 'Cloudy', icon: '03d', humidity: 72, windSpeed: 9, precipitation: 15 },
//     ],
//     alerts: [
//       {
//         description: 'Heavy rainfall expected tomorrow afternoon. Consider postponing outdoor farming activities.',
//         type: 'rain',
//         severity: 'severe',
//       },
//       {
//         description: 'Strong winds expected in the northern region. Secure your crops and farm structures.',
//         type: 'wind',
//         severity: 'moderate',
//       },
//     ],
//     location: 'Surulere, Lagos, Nigeria',
//   };

//   const mockCropAdvisory = {
//     immediateActions: [
//       { crop: 'Maize', action: 'Irrigate fields early in the morning.', priority: 'high' },
//       { crop: 'Cassava', action: 'Check for waterlogging after rain.', priority: 'medium' },
//     ],
//     weatherRecommendations: [
//       { type: 'Rain', description: 'Delay fertilizer application until after rainfall.' },
//     ],
//     risks: [
//       { risk: 'Flooding', mitigation: 'Improve drainage in low-lying areas.' },
//     ],
//     optimalTiming: [
//       { activity: 'Planting', timing: 'Best done in the early morning this week.' },
//     ],
//     generalTips: [
//       'Monitor weather updates daily.',
//       'Store harvested crops in a dry place.',
//     ],
//   };

//   // Reserve API-related code for later use
//   // const { weatherData, cropAdvisory, loading, error, location } = useWeather();
//   // const { t } = useLanguage();

//   const t = (key) => key; // Mock translation function for now
//   const weatherData = mockWeatherData;
//   const cropAdvisory = mockCropAdvisory;
//   const loading = false;
//   const error = null;
//   const location = mockWeatherData.location;

//   console.log(location)
//   // const { t } = useLanguage();

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-6">
//         <div className="flex flex-col">
//           <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-900">
// Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user.firstName || 'Username'}</h1>

//           <p className="text-sm sm:text-base md:text-lg text-green-800">
//               Surulere, Lagos, Nigeria
//           </p>  
//         </div>
//         <div className="flex items-center gap-2">
//           <button className="btn btn-sm bg-blue-100 text-blue-700 rounded px-3 py-1">
//             🔊 {t('audioAlerts') || 'Audio Alerts'}
//           </button>
//         </div>
//       </header>

//       {/* Current Weather */}
//       <section className="mb-4">
//         <WeatherCard />
//       </section>

//       {/* Weather Alert */}
//       {weatherData?.alerts && weatherData.alerts.length > 0 && (
//         <section className="mb-4">
//           {weatherData.alerts.map((alert, index) => (
//             <div key={index} className="bg-orange-50 border-l-4 border-orange-400 rounded p-4 mb-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-orange-500">⚠️</span>
//                 <span className="font-semibold">{t('weatherAlert')}</span>
//               </div>
//               <p className="mt-2 text-orange-700">{alert.description}</p>
//               <div className="mt-2 flex gap-2">
//                 <span className="bg-orange-200 text-orange-800 rounded px-2 py-1 text-xs">
//                   {alert.type} Alert
//                 </span>
//                 <span className="bg-red-200 text-red-800 rounded px-2 py-1 text-xs">
//                   {alert.severity === 'severe' || alert.severity === 'extreme' ? 'High Priority' : 'Medium Priority'}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </section>
//       )}

//       {/* 7-Day Forecast */}
//       {weatherData?.forecast && (
//         <section className="bg-white rounded-lg shadow p-6 mb-4">
//           <h2 className="text-lg font-semibold mb-2">{t('sevenDayForecast')}</h2>
//           <div className="grid grid-cols-7 gap-2 text-center">
//             {weatherData.forecast.map((day, i) => (
//               <div key={i} className="bg-blue-50 rounded p-2">
//                 <div className="font-bold text-sm">
//                   {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
//                 </div>
//                 <img
//                   src={`https://openweathermap.org/img/wn/${day.icon}.png`}
//                   alt={day.description}
//                   className="mx-auto w-8 h-8"
//                 />
//                 <div className="text-lg font-bold">{day.temp}°</div>
//                 <div className="text-xs text-gray-400">{day.tempMin}°</div>
//                 <div className="text-xs text-blue-600">{day.precipitation}%</div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Crop Advisories */}
//       <section className="mb-4">
//         <CropAdvisoryCard />
//       </section>

//       {/* Community Updates */}
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-lg font-semibold mb-2">{t('communityUpdates')}</h2>
//         <div className="space-y-4">
//           <div className="flex gap-3 items-start">
//             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//               👨‍🌾
//             </div>
//             <div>
//               <div className="font-bold">
//                 Adamu from Kano <span className="text-xs text-gray-400">2h ago</span>
//               </div>
//               <div>
//                 {t('communityUpdate1') || 'Heavy winds damaged my maize crops yesterday. Other farmers in the area should secure their farms.'}
//               </div>
//               <div className="flex gap-2 mt-1 text-blue-600 text-xs">
//                 <button>👍 12</button>
//                 <button>🔗 {t('share')}</button>
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-3 items-start">
//             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//               👩‍🌾
//             </div>
//             <div>
//               <div className="font-bold">
//                 Ngozi from Enugu <span className="text-xs text-gray-400">5h ago</span>
//               </div>
//               <div>
//                 {t('communityUpdate2') || 'Perfect weather for cassava harvesting this week. Getting good yields!'}
//               </div>
//               <div className="flex gap-2 mt-1 text-blue-600 text-xs">
//                 <button>👍 8</button>
//                 <button>🔗 {t('share')}</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home; 



