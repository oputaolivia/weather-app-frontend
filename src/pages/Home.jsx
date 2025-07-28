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
import { useWeather } from '../contexts/WeatherContext';
import { getUser } from '../services/userService';
import { getCookie } from '../services/cookies';
import {useUser} from '../contexts/UserContext';
import translationService from '../services/translationService';

const FarmWeatherApp = () => {
  const {user} = useUser();
  const { t, currentLanguage } = useLanguage();
  const { weatherData, cropAdvisory, loading, error } = useWeather();
  const [translatedWeather, setTranslatedWeather] = useState(null);
  const [translatedAdvisory, setTranslatedAdvisory] = useState(null);
  const [salutation, setSalutation] = useState('');

  useEffect(() => {
    const translateData = async () => {
      if (!weatherData || currentLanguage === 'en') {
        setTranslatedWeather(weatherData);
        setTranslatedAdvisory(cropAdvisory);
        return;
      }
      
      const lang = currentLanguage;
      
      try {
        // Batch all translations together for better performance
        const allTextsToTranslate = [];
        const textMap = new Map(); // Track which text belongs to what
        
        // Weather descriptions
        allTextsToTranslate.push(weatherData.current.description);
        textMap.set(weatherData.current.description, 'current');
        
        weatherData.forecast.forEach((day, index) => {
          allTextsToTranslate.push(day.description);
          textMap.set(day.description, `forecast_${index}`);
        });
        
        weatherData.alerts.forEach((alert, index) => {
          allTextsToTranslate.push(alert.description);
          textMap.set(alert.description, `alert_${index}`);
        });
        
        // Crop advisory texts
        if (cropAdvisory) {
          (cropAdvisory.immediateActions || []).forEach((action, index) => {
            allTextsToTranslate.push(action.action);
            textMap.set(action.action, `action_${index}`);
          });
          
          (cropAdvisory.weatherRecommendations || []).forEach((rec, index) => {
            allTextsToTranslate.push(rec.description);
            textMap.set(rec.description, `rec_${index}`);
          });
          
          (cropAdvisory.risks || []).forEach((risk, index) => {
            allTextsToTranslate.push(risk.risk);
            textMap.set(risk.risk, `risk_${index}`);
            allTextsToTranslate.push(risk.mitigation);
            textMap.set(risk.mitigation, `mitigation_${index}`);
          });
          
          (cropAdvisory.optimalTiming || []).forEach((timing, index) => {
            allTextsToTranslate.push(timing.timing);
            textMap.set(timing.timing, `timing_${index}`);
          });
          
          (cropAdvisory.generalTips || []).forEach((tip, index) => {
            allTextsToTranslate.push(tip);
            textMap.set(tip, `tip_${index}`);
          });
        }
        
        // Translate all texts in one batch
        const translatedTexts = await translationService.translateMultiple(allTextsToTranslate, lang, 'en');
        
        // Reconstruct weather data
        const translatedWeather = {
          ...weatherData,
          current: { 
            ...weatherData.current, 
            description: translatedTexts[allTextsToTranslate.indexOf(weatherData.current.description)]
          },
          forecast: weatherData.forecast.map((day, i) => ({
            ...day,
            description: translatedTexts[allTextsToTranslate.indexOf(day.description)]
          })),
          alerts: weatherData.alerts.map((alert, i) => ({
            ...alert,
            description: translatedTexts[allTextsToTranslate.indexOf(alert.description)]
          }))
        };
        
        setTranslatedWeather(translatedWeather);
        
        // Reconstruct crop advisory
        if (cropAdvisory) {
          const translatedAdvisory = {
            immediateActions: (cropAdvisory.immediateActions || []).map((action, i) => ({
              ...action,
              action: translatedTexts[allTextsToTranslate.indexOf(action.action)]
            })),
            weatherRecommendations: (cropAdvisory.weatherRecommendations || []).map((rec, i) => ({
              ...rec,
              description: translatedTexts[allTextsToTranslate.indexOf(rec.description)]
            })),
            risks: (cropAdvisory.risks || []).map((risk, i) => ({
              ...risk,
              risk: translatedTexts[allTextsToTranslate.indexOf(risk.risk)],
              mitigation: translatedTexts[allTextsToTranslate.indexOf(risk.mitigation)]
            })),
            optimalTiming: (cropAdvisory.optimalTiming || []).map((timing, i) => ({
              ...timing,
              timing: translatedTexts[allTextsToTranslate.indexOf(timing.timing)]
            })),
            generalTips: (cropAdvisory.generalTips || []).map((tip, i) => 
              translatedTexts[allTextsToTranslate.indexOf(tip)]
            )
          };
          
          setTranslatedAdvisory(translatedAdvisory);
        }
      } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original data
        setTranslatedWeather(weatherData);
        setTranslatedAdvisory(cropAdvisory);
      }
    };
    
    translateData();
  }, [currentLanguage, weatherData, cropAdvisory]);

  useEffect(() => {
    const getCompleteSalutation = () => {
      const hour = new Date().getHours();
      let salutationText = '';
      
      if (hour < 12) {
        salutationText = 'Good Morning';
      } else if (hour < 18) {
        salutationText = 'Good Afternoon';
      } else {
        salutationText = 'Good Evening';
      }
      
      // If it's English, return as is
      if (currentLanguage === 'en') {
        setSalutation(salutationText);
        return;
      }
      
      // Use fallback translation (already cached)
      const translatedSalutation = translationService.getFallbackTranslation(salutationText, currentLanguage);
      setSalutation(translatedSalutation);
    };

    getCompleteSalutation();
  }, [currentLanguage]);

  const getWeatherIcon = (iconCode, size = 'w-8 h-8') => {
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    return <img src={iconUrl} alt="weather" className={size} />;
  };

  // Get custom weather icon with better contrast
  const getCustomWeatherIcon = (weatherData, size = 'w-12 h-12') => {
    const description = weatherData.description?.toLowerCase() || '';
    const icon = weatherData.icon || '';
    const iconSize = size;
    
    // Sunny/Clear weather
    if (description.includes('clear') || description.includes('sun') || icon.includes('01')) {
      return (
        <div className={`${iconSize} flex items-center justify-center`}>
          <div className="text-4xl font-bold text-yellow-600 drop-shadow-lg">
            ☀️
          </div>
        </div>
      );
    }
    
    // Cloudy weather
    if (description.includes('cloud') || icon.includes('02') || icon.includes('03') || icon.includes('04')) {
      return (
        <div className={`${iconSize} flex items-center justify-center`}>
          <div className="text-4xl font-bold text-gray-700 drop-shadow-lg">
            ☁️
          </div>
        </div>
      );
    }
    
    // Rainy weather
    if (description.includes('rain') || description.includes('drizzle') || icon.includes('09') || icon.includes('10')) {
      return (
        <div className={`${iconSize} flex items-center justify-center`}>
          <div className="text-4xl font-bold text-blue-700 drop-shadow-lg">
            🌧️
          </div>
        </div>
      );
    }
    
    // Stormy weather
    if (description.includes('storm') || description.includes('thunder') || icon.includes('11')) {
      return (
        <div className={`${iconSize} flex items-center justify-center`}>
          <div className="text-4xl font-bold text-purple-700 drop-shadow-lg">
            ⛈️
          </div>
        </div>
      );
    }
    
    // Snowy weather
    if (description.includes('snow') || icon.includes('13')) {
      return (
        <div className={`${iconSize} flex items-center justify-center`}>
          <div className="text-4xl font-bold text-cyan-700 drop-shadow-lg">
            ❄️
          </div>
        </div>
      );
    }
    
    // Foggy/Misty weather
    if (description.includes('fog') || description.includes('mist') || icon.includes('50')) {
      return (
        <div className={`${iconSize} flex items-center justify-center`}>
          <div className="text-4xl font-bold text-slate-600 drop-shadow-lg">
            🌫️
          </div>
        </div>
      );
    }
    
    // Partly cloudy
    if (description.includes('partly') || icon.includes('02')) {
      return (
        <div className={`${iconSize} flex items-center justify-center`}>
          <div className="text-4xl font-bold text-gray-600 drop-shadow-lg">
            ⛅
          </div>
        </div>
      );
    }
    
    // Default (fallback)
    return (
      <div className={`${iconSize} flex items-center justify-center`}>
        <div className="text-4xl font-bold text-blue-600 drop-shadow-lg">
          🌤️
        </div>
      </div>
    );
  };

  // Get weather-based color classes
  const getWeatherColors = (weatherData) => {
    const description = weatherData.description?.toLowerCase() || '';
    const icon = weatherData.icon || '';
    
    // Sunny/Clear weather
    if (description.includes('clear') || description.includes('sun') || icon.includes('01')) {
      return {
        bg: 'bg-gradient-to-b from-yellow-50 to-orange-100 hover:from-yellow-100 hover:to-orange-200',
        text: 'text-orange-600',
        border: 'border-orange-200'
      };
    }
    
    // Cloudy weather
    if (description.includes('cloud') || icon.includes('02') || icon.includes('03') || icon.includes('04')) {
      return {
        bg: 'bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200',
        text: 'text-gray-600',
        border: 'border-gray-200'
      };
    }
    
    // Rainy weather
    if (description.includes('rain') || description.includes('drizzle') || icon.includes('09') || icon.includes('10')) {
      return {
        bg: 'bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200',
        text: 'text-blue-600',
        border: 'border-blue-200'
      };
    }
    
    // Stormy weather
    if (description.includes('storm') || description.includes('thunder') || icon.includes('11')) {
      return {
        bg: 'bg-gradient-to-b from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200',
        text: 'text-purple-600',
        border: 'border-purple-200'
      };
    }
    
    // Snowy weather
    if (description.includes('snow') || icon.includes('13')) {
      return {
        bg: 'bg-gradient-to-b from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200',
        text: 'text-cyan-600',
        border: 'border-cyan-200'
      };
    }
    
    // Foggy/Misty weather
    if (description.includes('fog') || description.includes('mist') || icon.includes('50')) {
      return {
        bg: 'bg-gradient-to-b from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200',
        text: 'text-slate-600',
        border: 'border-slate-200'
      };
    }
    
    // Default (fallback)
    return {
      bg: 'bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200',
      text: 'text-blue-600',
      border: 'border-blue-200'
    };
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
  const weather = translatedWeather || weatherData;
  const advisory = translatedAdvisory || cropAdvisory;

  // Debug logging
  useEffect(() => {
    console.log('Current language:', currentLanguage);
    console.log('Salutation state:', salutation);
    console.log('Weather data:', weather);
    console.log('Translated weather:', translatedWeather);
    console.log('Weather alerts:', weather?.alerts);
  }, [currentLanguage, salutation, weather, translatedWeather]);

  // Add loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-gray-500 text-lg">{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  // Add a check for weather data
  if (!weather || !weather.current || !weather.forecast || !Array.isArray(weather.alerts)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-gray-500 text-lg">No weather data available</div>
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
            {salutation || 'Good Morning'}, {user ? user.data.firstName : (t('guest') || 'Guest')}!
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-600">
            <p className="text-sm sm:text-base text-gray-600">
              {weather?.location || 'Loading location...'}
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
        {weather.alerts && weather.alerts.length > 0 && (
          <GlassCard className="mb-6 p-4 border-l-4 border-red-500 bg-red-50/80">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  {weather.alerts[0].type === 'rain' ? (t('rainAlert') || 'Rain Alert') :
                   weather.alerts[0].type === 'wind' ? (t('windAlert') || 'Wind Alert') :
                   weather.alerts[0].type === 'storm' ? (t('stormAlert') || 'Storm Alert') :
                   weather.alerts[0].type === 'temperature' ? (t('temperatureAlert') || 'Temperature Alert') :
                   weather.alerts[0].type === 'humidity' ? (t('humidityAlert') || 'Humidity Alert') :
                   weather.alerts[0].type === 'farming' ? (t('farmingAlert') || 'Farming Alert') :
                   (t('weatherAlert') || 'Weather Alert')}
                </h3>
                <p className="text-red-800 text-sm mb-3">
                  {weather.alerts[0].description}
                </p>
                <div className="flex gap-2">
                  <span className="bg-red-200 text-red-800 rounded-full px-3 py-1 text-xs font-medium">
                    {weather.alerts[0].type === 'rain' ? (t('rainAlert') || 'Rain Alert') :
                     weather.alerts[0].type === 'wind' ? (t('windAlert') || 'Wind Alert') :
                     weather.alerts[0].type === 'storm' ? (t('stormAlert') || 'Storm Alert') :
                     weather.alerts[0].type === 'temperature' ? (t('temperatureAlert') || 'Temperature Alert') :
                     weather.alerts[0].type === 'humidity' ? (t('humidityAlert') || 'Humidity Alert') :
                     weather.alerts[0].type === 'farming' ? (t('farmingAlert') || 'Farming Alert') :
                     (t('weatherAlert') || 'Weather Alert')}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    weather.alerts[0].severity === 'high' ? 'bg-red-200 text-red-800' :
                    weather.alerts[0].severity === 'moderate' ? 'bg-orange-200 text-orange-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {weather.alerts[0].severity === 'high' ? (t('highPriority') || 'High Priority') :
                     weather.alerts[0].severity === 'moderate' ? (t('mediumPriority') || 'Medium Priority') :
                     (t('lowPriority') || 'Low Priority')}
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
                    {getCustomWeatherIcon(weather.current, 'w-16 h-16')}
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
                      <span>{Math.round(weather.current.humidity)}%</span>
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
                      <span className="text-sm">{t('sunrise') || 'Sunrise'}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {weather.current.sunrise ? weather.current.sunrise.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      }) : '--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Sunset className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">{t('sunset') || 'Sunset'}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {weather.current.sunset ? weather.current.sunset.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      }) : '--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{t('visibility') || 'Visibility'}</span>
                    </div>
                    <span className="text-sm font-medium">{weather.current.visibility} km</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* 7-Day Forecast */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('sevenDayForecast') || '7-Day Forecast'}</h2>
              <div className="grid grid-row-7 md:grid-cols-7 gap-2">
                {weather.forecast.map((day, index) => {
                  const weatherColors = getWeatherColors(day);
                  return (
                    <div key={index} className={`text-center p-3 rounded-lg ${weatherColors.bg} transition-colors`}>
                      <div className="font-medium text-sm text-gray-700 mb-2">
                        {formatDate(day.date)}
                      </div>
                      <div className="flex justify-center mb-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl border-2 border-white/50">
                          {getCustomWeatherIcon(day, 'w-12 h-12')}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{day.temp}°</div>
                      <div className="text-xs text-gray-500">{day.tempMin}°</div>
                      <div className={`text-xs mt-1 font-semibold ${weatherColors.text}`}>{Math.round(day.precipitation)}%</div>
                    </div>
                  );
                })}
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
                {advisory && advisory.immediateActions && advisory.immediateActions.length > 0 ? (
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {advisory.immediateActions[0].crop === 'general' ? (t('generalFarming') || 'General Farming') : advisory.immediateActions[0].crop}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {advisory.immediateActions[0].action}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t('farmingAdvisory') || 'Farming Advisory'}</h3>
                        <p className="text-sm text-gray-700">
                          Loading farming recommendations based on current weather conditions...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-emerald-600 text-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="w-4 h-4" />
                    <span className="font-medium">{t('listenToAudio') || 'Listen to Audio'}</span>
                  </div>
                  <p className="text-sm text-emerald-100">
                    {t('farmingGuidance') || 'Get detailed farming guidance in your local language'}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Community Updates */}
            {/* <GlassCard className="p-6">
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
            </GlassCard> */}
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



