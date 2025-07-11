import React, { createContext, useContext, useState, useEffect } from 'react';
import weatherService from '../services/weatherService';
import cropAdvisoryService from '../services/cropAdvisoryService';

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

  // Default location (Lagos, Nigeria)
  const defaultLocation = {
    lat: 6.5244,
    lon: 3.3792,
    name: 'Lagos, Nigeria'
  };

  // Initialize location
  useEffect(() => {
    // Try to get user's location
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

  // Fetch weather data when location changes
  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  // Fetch weather data
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

      const weatherInfo = {
        current: currentWeather,
        forecast,
        alerts,
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

  // Generate crop advisory
  const generateCropAdvisory = async (weatherInfo) => {
    try {
      const advisory = await cropAdvisoryService.generateCropAdvisory(
        weatherInfo,
        userCrops,
        location.name
      );
      setCropAdvisory(advisory);
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
    
    // Check temperature range
    if (temp < 10 || temp > 40) return false;
    
    // Check for severe weather alerts
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