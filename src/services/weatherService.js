// Weather API Configuration
// New API endpoint for weather data
const WEATHER_API_URL = 'https://weather-app-backend-fdzb.onrender.com/api/weather/by-state';

class WeatherService {
  constructor() {
    this.apiUrl = WEATHER_API_URL;
  }

  // Get weather data by state (new method)
  async getWeatherByState(state) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // Format the new API response data
  formatWeatherData(data) {
    const current = this.formatCurrentWeather(data.current, data.lat, data.lon);
    const forecast = this.formatForecast(data.daily);
    const alerts = this.generateWeatherAlerts(current, forecast);
    
    return {
      current,
      forecast,
      alerts,
      location: `${data.lat}, ${data.lon}`,
      timezone: data.timezone
    };
  }

  // Generate weather alerts based on conditions
  generateWeatherAlerts(current, forecast) {
    const alerts = [];

    // Debug: Log current weather conditions
    console.log('Current weather for alerts:', {
      temperature: current.temperature,
      windSpeed: current.windSpeed,
      humidity: current.humidity,
      description: current.description
    });
    console.log('Forecast precipitation:', forecast.map(day => ({ date: day.date, precipitation: day.precipitation, description: day.description })));

    // Temperature alerts - adjusted for Nigerian climate
    if (current.temperature > 32) { // Lowered from 35°C
      alerts.push({
        description: 'High temperature alert: Temperatures are above 32°C. Water your crops more frequently and avoid working during peak hours.',
        type: 'temperature',
        severity: 'moderate'
      });
    } else if (current.temperature < 20) { // Raised from 15°C
      alerts.push({
        description: 'Cool temperature alert: Temperatures are below 20°C. Good conditions for planting and crop growth.',
        type: 'temperature',
        severity: 'low'
      });
    }

    // Wind alerts - adjusted for farming context
    if (current.windSpeed > 15) { // Lowered from 25 km/h
      alerts.push({
        description: 'Moderate wind alert: Wind speeds are moderate. Be careful with spraying activities and secure light farm structures.',
        type: 'wind',
        severity: 'low'
      });
    } else if (current.windSpeed > 25) { // Keep high wind alert
      alerts.push({
        description: 'Strong wind alert: Wind speeds are high. Secure farm structures and avoid spraying activities.',
        type: 'wind',
        severity: 'moderate'
      });
    }

    // Rainfall alerts based on forecast - more sensitive
    const moderateRainDays = forecast.filter(day => day.precipitation > 40); // Lowered from 70%
    const highRainDays = forecast.filter(day => day.precipitation > 70);
    
    if (highRainDays.length > 0) {
      alerts.push({
        description: `Heavy rainfall expected in the next ${highRainDays.length} day(s). Consider postponing outdoor farming activities.`,
        type: 'rain',
        severity: 'moderate'
      });
    } else if (moderateRainDays.length > 0) {
      alerts.push({
        description: `Moderate rainfall expected in the next ${moderateRainDays.length} day(s). Good for crops but plan activities accordingly.`,
        type: 'rain',
        severity: 'low'
      });
    }

    // Humidity alerts - adjusted for farming
    if (current.humidity > 80) { // Lowered from 85%
      alerts.push({
        description: 'High humidity alert: Conditions are favorable for fungal diseases. Monitor crops and ensure good air circulation.',
        type: 'humidity',
        severity: 'low'
      });
    } else if (current.humidity < 40) { // Add low humidity alert
      alerts.push({
        description: 'Low humidity alert: Dry conditions. Increase irrigation and monitor crops for water stress.',
        type: 'humidity',
        severity: 'low'
      });
    }

    // Storm alerts based on forecast
    const stormDays = forecast.filter(day => 
      day.description.toLowerCase().includes('storm') || 
      day.description.toLowerCase().includes('thunder')
    );
    if (stormDays.length > 0) {
      alerts.push({
        description: 'Storm warning: Thunderstorms expected. Secure farm equipment and avoid outdoor activities during storms.',
        type: 'storm',
        severity: 'high'
      });
    }

    // Add general farming condition alerts
    if (current.temperature >= 25 && current.temperature <= 30 && current.humidity >= 60 && current.humidity <= 80) {
      alerts.push({
        description: 'Optimal farming conditions: Temperature and humidity are ideal for most crops. Good time for planting and maintenance.',
        type: 'farming',
        severity: 'low'
      });
    }

    console.log('Generated weather alerts:', alerts);
    return alerts;
  }

  // Format current weather data from new API
  formatCurrentWeather(currentData, lat, lon) {
    return {
      temperature: Math.round(currentData.temp),
      feelsLike: Math.round(currentData.feels_like),
      humidity: currentData.humidity,
      windSpeed: Math.round(currentData.wind_speed * 3.6), // Convert m/s to km/h
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      city: 'Current Location', // Will be updated with actual city name
      country: 'NG',
      pressure: currentData.pressure,
      visibility: currentData.visibility / 1000, // Convert to km
      sunrise: new Date(currentData.sunrise * 1000),
      sunset: new Date(currentData.sunset * 1000)
    };
  }

  // Format forecast data from new API
  formatForecast(dailyData) {
    return dailyData.slice(0, 7).map(day => ({
      date: new Date(day.dt * 1000),
      temp: Math.round(day.temp.day),
      tempMin: Math.round(day.temp.min),
      tempMax: Math.round(day.temp.max),
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      humidity: day.humidity,
      windSpeed: Math.round(day.wind_speed * 3.6),
      precipitation: day.pop * 100, // Probability of precipitation
      summary: day.summary
    }));
  }

  // Legacy methods for backward compatibility (keeping for now)
  async getCurrentWeather(lat, lon) {
    // This method is now deprecated, use getWeatherByState instead
    console.warn('getCurrentWeather is deprecated, use getWeatherByState instead');
    return this.getWeatherByState('Lagos'); // Fallback
  }

  async getForecast(lat, lon) {
    // This method is now deprecated, use getWeatherByState instead
    console.warn('getForecast is deprecated, use getWeatherByState instead');
    const weatherData = await this.getWeatherByState('Lagos');
    return weatherData.forecast;
  }

  async getAlerts(lat, lon) {
    // Return empty array as new API doesn't provide alerts
    return [];
  }

  // Get weather by city name (keeping for backward compatibility)
  async getWeatherByCity(cityName) {
    try {
      // For now, we'll use the state-based API with a fallback
      // In a real implementation, you might want to map city names to states
      const stateMap = {
        'lagos': 'Lagos',
        'kano': 'Kano',
        'enugu': 'Enugu',
        'abuja': 'FCT',
        'port harcourt': 'Rivers',
        'calabar': 'Cross River'
      };
      
      const state = stateMap[cityName.toLowerCase()] || 'Lagos';
      const weatherData = await this.getWeatherByState(state);
      
      return {
        lat: weatherData.current.lat || 6.5244,
        lon: weatherData.current.lon || 3.3792,
        weather: weatherData.current
      };
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw error;
    }
  }
}

export default new WeatherService(); 