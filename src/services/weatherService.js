// OpenWeather API Configuration
// Get your API key from: https://openweathermap.org/api
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  constructor() {
    this.apiKey = OPENWEATHER_API_KEY;
  }

  // Get current weather for a location
  async getCurrentWeather(lat, lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      return this.formatCurrentWeather(data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  // Get 7-day forecast
  async getForecast(lat, lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      
      const data = await response.json();
      return this.formatForecast(data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }

  // Get weather alerts
  async getAlerts(lat, lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts data');
      }
      
      const data = await response.json();
      return this.formatAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }

  // Format current weather data
  formatCurrentWeather(data) {
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name,
      country: data.sys.country,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000)
    };
  }

  // Format forecast data
  formatForecast(data) {
    const dailyData = data.list.filter((item, index) => index % 8 === 0); // Get daily data (every 8th item)
    
    return dailyData.slice(0, 7).map(day => ({
      date: new Date(day.dt * 1000),
      temp: Math.round(day.main.temp),
      tempMin: Math.round(day.main.temp_min),
      tempMax: Math.round(day.main.temp_max),
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      humidity: day.main.humidity,
      windSpeed: Math.round(day.wind.speed * 3.6),
      precipitation: day.pop * 100 // Probability of precipitation
    }));
  }

  // Format alerts data
  formatAlerts(data) {
    if (!data.alerts) return [];
    
    return data.alerts.map(alert => ({
      event: alert.event,
      description: alert.description,
      start: new Date(alert.start * 1000),
      end: new Date(alert.end * 1000),
      severity: alert.tags[0] || 'moderate',
      type: this.categorizeAlert(alert.event)
    }));
  }

  // Categorize alert type
  categorizeAlert(event) {
    const eventLower = event.toLowerCase();
    if (eventLower.includes('rain') || eventLower.includes('storm')) return 'rain';
    if (eventLower.includes('wind')) return 'wind';
    if (eventLower.includes('heat')) return 'heat';
    if (eventLower.includes('cold')) return 'cold';
    return 'other';
  }

  // Get weather by city name
  async getWeatherByCity(cityName) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      return {
        lat: data.coord.lat,
        lon: data.coord.lon,
        weather: this.formatCurrentWeather(data)
      };
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw error;
    }
  }
}

export default new WeatherService(); 