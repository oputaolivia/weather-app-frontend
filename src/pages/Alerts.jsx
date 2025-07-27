import React, { useState, useEffect } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import cropAdvisoryService, { NIGERIAN_CROPS } from '../services/cropAdvisoryService';

const Alerts = () => {
  const { weatherData, loading, error, refreshWeather } = useWeather();
  const { t } = useLanguage();
  const { user } = useUser();
  const [farmingAlerts, setFarmingAlerts] = useState([]);
  const [processingAlerts, setProcessingAlerts] = useState(false);

  // Generate farming alerts based on weather and location
  const generateFarmingAlerts = async () => {
    if (!weatherData || !weatherData.current) return;
    
    setProcessingAlerts(true);
    const alerts = [];

    try {
      const userLocation = user?.data?.location?.state || 'Lagos';

      // 1. Weather-based alerts
      const weatherAlerts = generateWeatherAlerts(weatherData);
      alerts.push(...weatherAlerts);

      // 2. General Nigerian crops alerts
      const cropAlerts = generateNigerianCropsAlerts(weatherData, userLocation);
      alerts.push(...cropAlerts);

      // 3. General farming alerts
      const generalAlerts = generateGeneralFarmingAlerts(weatherData);
      alerts.push(...generalAlerts);

      // 4. Seasonal alerts
      const seasonalAlerts = generateSeasonalAlerts(weatherData);
      alerts.push(...seasonalAlerts);

      // Sort alerts by priority
      alerts.sort((a, b) => {
        const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      setFarmingAlerts(alerts);
    } catch (error) {
      console.error('Error generating farming alerts:', error);
    } finally {
      setProcessingAlerts(false);
    }
  };

  // Generate weather-based alerts
  const generateWeatherAlerts = (weatherData) => {
    const alerts = [];
    const current = weatherData.current;
    const forecast = weatherData.forecast;

    // Temperature alerts
    if (current.temp > 35) {
      alerts.push({
        id: 'high-temp',
        type: 'temperature',
        title: t('weatherTooHot'),
        message: t('weatherTooHotMessage'),
        priority: 'high',
        icon: '🌡️',
        color: 'red',
        actions: [
          t('waterFarmMore'),
          t('putShadeOnCrops'),
          t('workEarlyMorning')
        ]
      });
    } else if (current.temp < 18) {
      alerts.push({
        id: 'low-temp',
        type: 'temperature',
        title: t('weatherTooCold'),
        message: t('weatherTooColdMessage'),
        priority: 'high',
        icon: '❄️',
        color: 'blue',
        actions: [
          t('coverSmallPlants'),
          t('waitToPlant'),
          t('useWarmWater')
        ]
      });
    }

    // Rainfall alerts
    const rainForecast = forecast.filter(day => day.precipitation > 60);
    if (rainForecast.length > 0) {
      alerts.push({
        id: 'heavy-rain',
        type: 'rainfall',
        title: t('rainComing'),
        message: t('rainComingMessage'),
        priority: 'medium',
        icon: '🌧️',
        color: 'blue',
        actions: [
          t('dontWorkOutside'),
          t('checkWaterFlow'),
          t('tieDownTools')
        ]
      });
    }

    // Wind alerts
    if (current.windSpeed > 20) {
      alerts.push({
        id: 'strong-wind',
        type: 'wind',
        title: t('windTooStrong'),
        message: t('windTooStrongMessage'),
        priority: 'medium',
        icon: '💨',
        color: 'orange',
        actions: [
          t('tieDownCrops'),
          t('checkFarmTools'),
          t('dontSprayNow')
        ]
      });
    }

    // Humidity alerts
    if (current.humidity > 85) {
      alerts.push({
        id: 'high-humidity',
        type: 'humidity',
        title: t('airTooWet'),
        message: t('airTooWetMessage'),
        priority: 'medium',
        icon: '💧',
        color: 'yellow',
        actions: [
          t('checkForSickness'),
          t('letAirFlow'),
          t('dontWaterMuch')
        ]
      });
    }

    return alerts;
  };

  // Generate alerts for common Nigerian crops based on weather
  const generateNigerianCropsAlerts = (weatherData, location) => {
    const alerts = [];
    const current = weatherData.current;
    const forecast = weatherData.forecast;

    // Common Nigerian crops and their weather preferences
    const nigerianCrops = {
      grains: ['Maize', 'Rice', 'Sorghum', 'Millet'],
      tubers: ['Cassava', 'Yam', 'Sweet Potato'],
      legumes: ['Beans', 'Cowpea', 'Groundnut'],
      vegetables: ['Tomato', 'Pepper', 'Okra'],
      fruits: ['Mango', 'Orange', 'Banana']
    };

    // Temperature-based crop advice
    if (current.temp > 32) {
      alerts.push({
        id: 'hot-weather-crops',
        type: 'crops',
        title: t('hotWeatherCrops'),
        message: t('hotWeatherCropsMessage'),
        priority: 'high',
        icon: '🌾',
        color: 'orange',
        actions: [
          t('waterCropsTwice'),
          t('useShadeCloth'),
          t('plantEarlyMorning')
        ]
      });
    } else if (current.temp < 18) {
      alerts.push({
        id: 'cold-weather-crops',
        type: 'crops',
        title: t('coldWeatherCrops'),
        message: t('coldWeatherCropsMessage'),
        priority: 'high',
        icon: '🌾',
        color: 'blue',
        actions: [
          t('delayPlanting'),
          t('coverYoungPlants'),
          t('useWarmWater')
        ]
      });
    }

    // Rainfall-based crop advice
    const rainForecast = forecast.filter(day => day.precipitation > 60);
    if (rainForecast.length > 0) {
      alerts.push({
        id: 'rain-crops',
        type: 'crops',
        title: t('rainCrops'),
        message: t('rainCropsMessage'),
        priority: 'medium',
        icon: '🌧️',
        color: 'blue',
        actions: [
          t('checkDrainage'),
          t('avoidPlanting'),
          t('protectSeeds')
        ]
      });
    }

    // Humidity-based crop advice
    if (current.humidity > 80) {
      alerts.push({
        id: 'humid-crops',
        type: 'crops',
        title: t('humidCrops'),
        message: t('humidCropsMessage'),
        priority: 'medium',
        icon: '💧',
        color: 'yellow',
        actions: [
          t('spacePlantsWell'),
          t('checkForDisease'),
          t('improveAirFlow')
        ]
      });
    }

    // Good weather for farming
    if (current.temp >= 20 && current.temp <= 30 && current.humidity >= 60 && current.humidity <= 75) {
      alerts.push({
        id: 'good-farming-weather',
        type: 'crops',
        title: t('goodFarmingWeather'),
        message: t('goodFarmingWeatherMessage'),
        priority: 'low',
        icon: '✅',
        color: 'green',
        actions: [
          t('plantNow'),
          t('applyFertilizer'),
          t('weedFarm')
        ]
      });
    }

    return alerts;
  };

  // Generate general farming alerts
  const generateGeneralFarmingAlerts = (weatherData) => {
    const alerts = [];
    const current = weatherData.current;

    // Good farming weather
    if (current.temp >= 20 && current.temp <= 30 && current.humidity >= 60 && current.humidity <= 80) {
      alerts.push({
        id: 'good-weather',
        type: 'general',
        title: t('weatherGood'),
        message: t('weatherGoodMessage'),
        priority: 'low',
        icon: '✅',
        color: 'green',
        actions: [
          t('plantNow'),
          t('putFertilizer'),
          t('removeWeeds')
        ]
      });
    }

    // Need water
    if (current.humidity < 50) {
      alerts.push({
        id: 'need-water',
        type: 'irrigation',
        title: t('needMoreWater'),
        message: t('needMoreWaterMessage'),
        priority: 'medium',
        icon: '💧',
        color: 'blue',
        actions: [
          t('waterFarm'),
          t('checkSoil'),
          t('waterMorning')
        ]
      });
    }

    return alerts;
  };

  // Generate seasonal alerts
  const generateSeasonalAlerts = (weatherData) => {
    const alerts = [];
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;

    // Planting time (March-June)
    if (month >= 3 && month <= 6) {
      alerts.push({
        id: 'planting-time',
        type: 'seasonal',
        title: t('timeToPlant'),
        message: t('timeToPlantMessage'),
        priority: 'medium',
        icon: '🌱',
        color: 'green',
        actions: [
          t('prepareLand'),
          t('buyGoodSeeds'),
          t('planPlanting')
        ]
      });
    }

    // Harvesting time (September-December)
    if (month >= 9 && month <= 12) {
      alerts.push({
        id: 'harvesting-time',
        type: 'seasonal',
        title: t('timeToHarvest'),
        message: t('timeToHarvestMessage'),
        priority: 'medium',
        icon: '🌾',
        color: 'gold',
        actions: [
          t('getHarvestTools'),
          t('checkCropReady'),
          t('planHarvest')
        ]
      });
    }

    return alerts;
  };

  // Get alert color classes
  const getAlertColorClasses = (color) => {
    const colorMap = {
      red: 'bg-red-50 border-red-400 text-red-700',
      orange: 'bg-orange-50 border-orange-400 text-orange-700',
      yellow: 'bg-yellow-50 border-yellow-400 text-yellow-700',
      blue: 'bg-blue-50 border-blue-400 text-blue-700',
      green: 'bg-green-50 border-green-400 text-green-700',
      gold: 'bg-amber-50 border-amber-400 text-amber-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    const priorityMap = {
      critical: 'bg-red-200 text-red-800',
      high: 'bg-orange-200 text-orange-800',
      medium: 'bg-yellow-200 text-yellow-800',
      low: 'bg-green-200 text-green-800'
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  // Generate alerts when weather data changes
  useEffect(() => {
    if (weatherData) {
      generateFarmingAlerts();
    }
  }, [weatherData, user]);

  if (loading || processingAlerts) {
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

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('weatherAlerts')}</h1>
          <button 
            onClick={refreshWeather}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            {t('refresh')}
          </button>
        </div>

        {/* Alert Summary */}
        {farmingAlerts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">{t('alertSummary')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {farmingAlerts.filter(a => a.priority === 'critical').length}
                </div>
                <div className="text-sm text-gray-600">{t('critical')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {farmingAlerts.filter(a => a.priority === 'high').length}
                </div>
                <div className="text-sm text-gray-600">{t('high')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {farmingAlerts.filter(a => a.priority === 'medium').length}
                </div>
                <div className="text-sm text-gray-600">{t('medium')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {farmingAlerts.filter(a => a.priority === 'low').length}
                </div>
                <div className="text-sm text-gray-600">{t('low')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Farming Alerts */}
        {farmingAlerts.length > 0 ? (
          <div className="space-y-4">
            {farmingAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`border-l-4 rounded p-4 ${getAlertColorClasses(alert.color)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{alert.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(alert.priority)}`}>
                          {t(alert.priority)}
                        </span>
                        {alert.crop && (
                          <span className="bg-purple-200 text-purple-800 rounded px-2 py-1 text-xs">
                            {alert.crop}
                          </span>
                        )}
                      </div>
                      <p className="mb-3">{alert.message}</p>
                      
                      {/* Recommended Actions */}
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">{t('recommendedActions')}:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {alert.actions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
        </div>
      </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('noAlerts')}</h2>
            <p className="text-gray-600">{t('noAlertsMessage')}</p>
          </div>
        )}

        {/* Crop Selection Reminder */}
        {(!user?.data?.crops || user.data.crops.length === 0) && (
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 mt-6">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">ℹ️</span>
              <span className="font-semibold">{t('cropSelectionReminder')}</span>
        </div>
            <p className="mt-2 text-blue-700">{t('cropSelectionMessage')}</p>
        </div>
        )}
      </div>
    </div>
  );
};

export default Alerts; 