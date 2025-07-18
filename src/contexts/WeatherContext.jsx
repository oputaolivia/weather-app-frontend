import React, { createContext, useContext, useState, useEffect } from 'react';
import weatherService from '../services/weatherService';
import cropAdvisoryService from '../services/cropAdvisoryService';
import { useLanguage } from './LanguageContext';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [cropAdvisory, setCropAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [userCrops, setUserCrops] = useState([]);

  const { currentLanguage } = useLanguage();
  const defaultLocation = {
    lat: 6.5244,
    lon: 3.3792,
    name: 'Lagos, Nigeria'
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'Your Location'
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          setLocation(defaultLocation);
        }
      );
    } else {
      setLocation(defaultLocation);
    }
  }, []);

  // Refetch and re-translate on location or language change
  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
    // eslint-disable-next-line
  }, [location, currentLanguage]);

  // Fetch and translate weather data
  const fetchWeatherData = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const [currentWeather, forecast, alerts] = await Promise.all([
        weatherService.getCurrentWeather(location.lat, location.lon),
        weatherService.getForecast(location.lat, location.lon),
        weatherService.getAlerts(location.lat, location.lon)
      ]);

      // Translate weather descriptions
      const { translateText, translateMultiple } = require('../services/translationService').default;
      const lang = currentLanguage;
      // Current weather description
      const translatedCurrentDesc = await require('../services/translationService').default.translateText(currentWeather.description, lang, 'en');
      // Forecast descriptions
      const forecastDescriptions = forecast.map(day => day.description);
      const translatedForecastDescs = await require('../services/translationService').default.translateMultiple(forecastDescriptions, lang, 'en');
      // Alerts descriptions
      const alertDescriptions = alerts.map(alert => alert.description);
      const translatedAlertDescs = alertDescriptions.length > 0 ? await require('../services/translationService').default.translateMultiple(alertDescriptions, lang, 'en') : [];

      const translatedCurrent = { ...currentWeather, description: translatedCurrentDesc };
      const translatedForecast = forecast.map((day, i) => ({ ...day, description: translatedForecastDescs[i] }));
      const translatedAlerts = alerts.map((alert, i) => ({ ...alert, description: translatedAlertDescs[i] }));

      const weatherInfo = {
        current: translatedCurrent,
        forecast: translatedForecast,
        alerts: translatedAlerts,
        location: location.name
      };

      setWeatherData(weatherInfo);
      // Generate crop advisory if user has crops
      if (userCrops.length > 0) {
        generateCropAdvisory(weatherInfo);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate and translate crop advisory
  const generateCropAdvisory = async (weatherInfo) => {
    try {
      const advisory = await cropAdvisoryService.generateCropAdvisory(
        weatherInfo,
        userCrops,
        location.name
      );
      // Translate all advisory fields
      const lang = currentLanguage;
      const ts = require('../services/translationService').default;
      // Immediate actions
      const actions = advisory.immediateActions || [];
      const actionTexts = actions.map(a => a.action);
      const translatedActions = actionTexts.length > 0 ? await ts.translateMultiple(actionTexts, lang, 'en') : [];
      // Weather recommendations
      const recs = advisory.weatherRecommendations || [];
      const recTexts = recs.map(r => r.description);
      const translatedRecs = recTexts.length > 0 ? await ts.translateMultiple(recTexts, lang, 'en') : [];
      // Risks
      const risks = advisory.risks || [];
      const riskTexts = risks.map(r => r.risk);
      const mitigationTexts = risks.map(r => r.mitigation);
      const translatedRisks = riskTexts.length > 0 ? await ts.translateMultiple(riskTexts, lang, 'en') : [];
      const translatedMitigations = mitigationTexts.length > 0 ? await ts.translateMultiple(mitigationTexts, lang, 'en') : [];
      // Optimal timing
      const timings = advisory.optimalTiming || [];
      const timingTexts = timings.map(t => t.timing);
      const translatedTimings = timingTexts.length > 0 ? await ts.translateMultiple(timingTexts, lang, 'en') : [];
      // General tips
      const tips = advisory.generalTips || [];
      const translatedTips = tips.length > 0 ? await ts.translateMultiple(tips, lang, 'en') : [];

      const translatedAdvisory = {
        ...advisory,
        immediateActions: actions.map((a, i) => ({ ...a, action: translatedActions[i] })),
        weatherRecommendations: recs.map((r, i) => ({ ...r, description: translatedRecs[i] })),
        risks: risks.map((r, i) => ({ ...r, risk: translatedRisks[i], mitigation: translatedMitigations[i] })),
        optimalTiming: timings.map((t, i) => ({ ...t, timing: translatedTimings[i] })),
        generalTips: translatedTips
      };
      setCropAdvisory(translatedAdvisory);
    } catch (error) {
      console.error('Error generating crop advisory:', error);
      // Use fallback advisory
      const fallbackAdvisory = cropAdvisoryService.getFallbackAdvisory(weatherInfo, userCrops);
      setCropAdvisory(fallbackAdvisory);
    }
  };

  // Update user crops
  const updateUserCrops = (crops) => {
    setUserCrops(crops);
    if (weatherData) {
      generateCropAdvisory(weatherData);
    }
  };

  // Update location
  const updateLocation = async (cityName) => {
    try {
      setLoading(true);
      const locationData = await weatherService.getWeatherByCity(cityName);
      setLocation({
        lat: locationData.lat,
        lon: locationData.lon,
        name: cityName
      });
    } catch (error) {
      console.error('Error updating location:', error);
      setError('City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh weather data
  const refreshWeather = () => {
    fetchWeatherData();
  };

  // Get weather icon URL
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Get weather description
  const getWeatherDescription = (weatherData) => {
    if (!weatherData) return '';
    const temp = weatherData.current.temperature;
    const description = weatherData.current.description;
    if (temp > 30) return 'Hot';
    if (temp > 25) return 'Warm';
    if (temp > 15) return 'Mild';
    return 'Cool';
  };

  // Check if weather is suitable for farming
  const isWeatherSuitableForFarming = () => {
    if (!weatherData) return true;
    const temp = weatherData.current.temperature;
    const alerts = weatherData.alerts;
    if (temp < 10 || temp > 40) return false;
    const severeAlerts = alerts.filter(alert => 
      alert.severity === 'severe' || alert.severity === 'extreme'
    );
    return severeAlerts.length === 0;
  };

  const value = {
    weatherData,
    cropAdvisory,
    loading,
    error,
    location,
    userCrops,
    updateUserCrops,
    updateLocation,
    refreshWeather,
    getWeatherIcon,
    getWeatherDescription,
    isWeatherSuitableForFarming
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}; 