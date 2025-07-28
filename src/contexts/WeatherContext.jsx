import React, { createContext, useContext, useState, useEffect } from 'react';
import weatherService from '../services/weatherService';
import cropAdvisoryService from '../services/cropAdvisoryService';
import translationService from '../services/translationService';
import { useLanguage } from './LanguageContext';
import { useUser } from './UserContext';

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
  const { user } = useUser();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          setLocation(null);
        }
      );
    } else {
      setLocation(null);
    }
  }, []);

  // Refetch and re-translate on location, language, or user change
  useEffect(() => {
    fetchWeatherData();
  }, [location, currentLanguage, user]);

  // Fetch and translate weather data
  const fetchWeatherData = async () => {
    console.log("State of the location before use", location)
    setLoading(true);
    setError(null);
    try {
      // Get user's state from user data, fallback to default
      const userState = user?.data?.location?.state || 'Lagos';
      let weatherData;
      
      // Use the new weather service method with state parameter
      if (!location){
        console.log("No location found, using state fallback:", userState);
        weatherData = await weatherService.getWeatherByState(userState);
      } else {
        weatherData = await weatherService.getWeatherByCoordinates(location.latitude, location.longitude);
      }

      // Translate weather descriptions
      const lang = currentLanguage;
      
      // Current weather description
      const translatedCurrentDesc = await translationService.translateText(weatherData.current.description, lang, 'en');
      
      // Forecast descriptions
      const forecastDescriptions = weatherData.forecast.map(day => day.description);
      const translatedForecastDescs = await translationService.translateMultiple(forecastDescriptions, lang, 'en');

      const translatedCurrent = { ...weatherData.current, description: translatedCurrentDesc };
      const translatedForecast = weatherData.forecast.map((day, i) => ({ ...day, description: translatedForecastDescs[i] }));

      const weatherInfo = {
        current: translatedCurrent,
        forecast: translatedForecast,
        alerts: weatherData.alerts || [],
        location: user?.data?.location?.city && user?.data?.location?.state 
          ? `${user.data.location.city}, ${user.data.location.state}, Nigeria`
          : `${userState}, Nigeria`
      };

      setWeatherData(weatherInfo);
      // Generate crop advisory based on location
      generateCropAdvisory(weatherInfo);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate and translate crop advisory
  const generateCropAdvisory = async (weatherInfo) => {
    try {
      const userLocation = user?.data?.location?.state || 'Lagos';
      const advisory = await cropAdvisoryService.generateCropAdvisory(
        weatherInfo,
        userLocation
      );
      // Translate all advisory fields
      const lang = currentLanguage;
      // Immediate actions
      const actions = advisory.immediateActions || [];
      const actionTexts = actions.map(a => a.action);
      const translatedActions = actionTexts.length > 0 ? await translationService.translateMultiple(actionTexts, lang, 'en') : [];
      // Weather recommendations
      const recs = advisory.weatherRecommendations || [];
      const recTexts = recs.map(r => r.description);
      const translatedRecs = recTexts.length > 0 ? await translationService.translateMultiple(recTexts, lang, 'en') : [];
      // Risks
      const risks = advisory.risks || [];
      const riskTexts = risks.map(r => r.risk);
      const mitigationTexts = risks.map(r => r.mitigation);
      const translatedRisks = riskTexts.length > 0 ? await translationService.translateMultiple(riskTexts, lang, 'en') : [];
      const translatedMitigations = mitigationTexts.length > 0 ? await translationService.translateMultiple(mitigationTexts, lang, 'en') : [];
      // Optimal timing
      const timings = advisory.optimalTiming || [];
      const timingTexts = timings.map(t => t.timing);
      const translatedTimings = timingTexts.length > 0 ? await translationService.translateMultiple(timingTexts, lang, 'en') : [];
      // General tips
      const tips = advisory.generalTips || [];
      const translatedTips = tips.length > 0 ? await translationService.translateMultiple(tips, lang, 'en') : [];

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
      const fallbackAdvisory = cropAdvisoryService.getFallbackAdvisory(weatherInfo);
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
        latitude: locationData.lat,
        longitude: locationData.lon,
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