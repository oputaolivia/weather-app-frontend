// AI Crop Advisory Service using GitHub AI Models
import OpenAI from "openai";

const token = import.meta.env.VITE_GITHUB_GPT_API_KEY_ADVICE;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

// Common Nigerian crops
export const NIGERIAN_CROPS = {
  grains: ['Maize', 'Rice', 'Sorghum', 'Millet', 'Wheat'],
  legumes: ['Beans', 'Cowpea', 'Groundnut', 'Soybean'],
  tubers: ['Cassava', 'Yam', 'Sweet Potato', 'Cocoyam'],
  vegetables: ['Tomato', 'Pepper', 'Okra', 'Spinach', 'Lettuce'],
  fruits: ['Mango', 'Orange', 'Banana', 'Pineapple', 'Pawpaw'],
  cash_crops: ['Cocoa', 'Coffee', 'Cotton', 'Sugarcane', 'Palm Oil']
};

class CropAdvisoryService {
  constructor() {
    this.client = null;
    
    if (token) {
      try {
        this.client = new OpenAI({ 
          baseURL: endpoint, 
          apiKey: token,
          dangerouslyAllowBrowser: true
        });
      } catch (error) {
        console.error('Failed to initialize GitHub AI client:', error);
        this.client = null;
      }
    } else {
      console.warn('GitHub AI API key not found. Using fallback crop advisory system.');
    }
  }

  // Generate crop advisory based on weather and location
  async generateCropAdvisory(weatherData, location) {
    try {
      // If no client available, use fallback
      if (!this.client) {
        console.log('Using fallback crop advisory system');
        return this.getFallbackAdvisory(weatherData, location);
      }

      const prompt = this.buildAdvisoryPrompt(weatherData, location);
      
      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert agricultural advisor specializing in Nigerian farming conditions. 
            Provide practical, actionable advice for farmers based on weather conditions and location. 
            Focus on local farming practices and conditions. Respond in a structured, easy-to-understand format.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        top_p: 1,
        model: model
      });

      return this.parseAdvisoryResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating crop advisory:', error);
      console.log('Falling back to local advisory system');
      return this.getFallbackAdvisory(weatherData, location);
    }
  }

  // Build the prompt for AI advisory
  buildAdvisoryPrompt(weatherData, location) {
    const currentWeather = weatherData.current;
    const forecast = weatherData.forecast;
    const alerts = weatherData.alerts;

    return `
    Location: ${location}
    Current Weather: ${currentWeather.temperature}°C, ${currentWeather.description}, Humidity: ${currentWeather.humidity}%, Wind: ${currentWeather.windSpeed} km/h
    
    Weather Forecast (Next 7 days):
    ${forecast.map(day => 
      `${day.date.toDateString()}: ${day.temp}°C, ${day.description}, Rain chance: ${day.precipitation}%`
    ).join('\n')}
    
    Weather Alerts: ${alerts.length > 0 ? alerts.map(alert => alert.description).join(', ') : 'None'}
    
    Based on this weather data and location, provide general farming advice for Nigerian farmers in this area. Focus on:
    1. General farming practices suitable for current weather conditions
    2. Weather-based recommendations for common Nigerian crops
    3. Potential risks and mitigation strategies
    4. Optimal timing for farming activities
    5. General farming tips for the current conditions
    
    Format the response as JSON with the following structure:
    {
      "immediateActions": [{"crop": "general", "action": "action_description", "priority": "high/medium/low"}],
      "weatherRecommendations": [{"type": "recommendation_type", "description": "description"}],
      "risks": [{"risk": "risk_description", "mitigation": "mitigation_strategy"}],
      "optimalTiming": [{"activity": "activity_name", "timing": "timing_description"}],
      "generalTips": ["tip1", "tip2", "tip3"]
    }
    `;
  }

  // Parse AI response
  parseAdvisoryResponse(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: return structured text
      return {
        immediateActions: [{ crop: 'All Crops', action: response, priority: 'medium' }],
        weatherRecommendations: [],
        risks: [],
        optimalTiming: [],
        generalTips: [response]
      };
    } catch (error) {
      console.error('Error parsing advisory response:', error);
      return {
        immediateActions: [{ crop: 'All Crops', action: response, priority: 'medium' }],
        weatherRecommendations: [],
        risks: [],
        optimalTiming: [],
        generalTips: [response]
      };
    }
  }

  // Enhanced fallback advisory when AI is unavailable
  getFallbackAdvisory(weatherData, location = 'Nigeria') {
    const currentTemp = weatherData.current.temperature;
    const humidity = weatherData.current.humidity;
    const description = weatherData.current.description.toLowerCase();
    const windSpeed = weatherData.current.windSpeed;
    const alerts = weatherData.alerts || [];

    const actions = [];
    const recommendations = [];
    const risks = [];
    const timing = [];
    const tips = [];
    
    // Temperature-based advice
    if (currentTemp > 32) {
      actions.push({
        crop: 'general',
        action: 'High temperature detected. Water crops early morning and evening. Consider shade for sensitive crops like tomatoes and peppers.',
        priority: 'high'
      });
      risks.push({
        risk: 'Heat stress on crops',
        mitigation: 'Increase irrigation frequency and provide shade for sensitive crops'
      });
    } else if (currentTemp > 25 && currentTemp <= 32) {
      actions.push({
        crop: 'general',
        action: 'Warm conditions are ideal for most crops. Continue regular watering and monitor for pests.',
        priority: 'medium'
      });
    } else if (currentTemp < 20) {
      actions.push({
        crop: 'general',
        action: 'Cool temperature detected. Good for planting and root development. Protect sensitive crops from cold.',
        priority: 'medium'
      });
    }

    // Humidity-based advice
    if (humidity > 80) {
      actions.push({
        crop: 'general',
        action: 'High humidity detected. Monitor for fungal diseases like blight and mildew. Ensure good air circulation.',
        priority: 'medium'
      });
      risks.push({
        risk: 'Fungal diseases',
        mitigation: 'Apply fungicides if needed and ensure proper spacing between plants'
      });
    } else if (humidity < 40) {
      actions.push({
        crop: 'general',
        action: 'Low humidity detected. Increase irrigation and consider mulching to retain soil moisture.',
        priority: 'medium'
      });
    }

    // Wind-based advice
    if (windSpeed > 20) {
      actions.push({
        crop: 'general',
        action: 'Strong winds detected. Secure farm structures and avoid spraying pesticides. Protect young plants.',
        priority: 'high'
      });
      risks.push({
        risk: 'Wind damage to crops',
        mitigation: 'Use windbreaks and secure farm structures'
      });
    }

    // Weather condition specific advice
    if (description.includes('rain') || description.includes('drizzle')) {
      actions.push({
        crop: 'general',
        action: 'Rainy conditions. Good for crops but avoid working in wet fields. Monitor for waterlogging.',
        priority: 'medium'
      });
      timing.push({
        activity: 'Planting',
        timing: 'Wait for soil to dry slightly before planting to avoid compaction'
      });
    } else if (description.includes('sunny') || description.includes('clear')) {
      actions.push({
        crop: 'general',
        action: 'Sunny conditions. Ensure adequate irrigation and protect crops from sunburn.',
        priority: 'medium'
      });
      timing.push({
        activity: 'Irrigation',
        timing: 'Water early morning or evening to reduce evaporation'
      });
    }

    // Location-specific advice
    if (location.toLowerCase().includes('north')) {
      recommendations.push({
        type: 'Regional',
        description: 'Northern region: Consider drought-resistant crops like millet and sorghum during dry periods.'
      });
    } else if (location.toLowerCase().includes('south')) {
      recommendations.push({
        type: 'Regional',
        description: 'Southern region: High rainfall area. Ensure good drainage and consider crops like cassava and yam.'
      });
    }

    // General weather recommendations
    recommendations.push({
      type: 'Temperature',
      description: `Current temperature is ${currentTemp}°C. ${currentTemp > 25 ? 'Warm conditions are good for most crops.' : 'Cool conditions may slow growth but are good for root development.'}`
    });

    recommendations.push({
      type: 'Humidity',
      description: `Humidity is ${humidity}%. ${humidity > 70 ? 'High humidity - monitor for diseases.' : humidity < 50 ? 'Low humidity - increase irrigation.' : 'Optimal humidity for most crops.'}`
    });

    // General tips
    tips.push('Monitor weather forecasts daily for planning farming activities');
    tips.push('Adjust irrigation based on rainfall and temperature');
    tips.push('Protect crops from extreme weather events');
    tips.push('Use weather data to plan planting and harvesting times');
    tips.push('Keep farm records to track weather impact on yields');

    // Add alert-based advice
    if (alerts.length > 0) {
      alerts.forEach(alert => {
        if (alert.type === 'rain' && alert.severity === 'high') {
          actions.push({
            crop: 'general',
            action: 'Heavy rain expected. Secure farm structures and ensure drainage is working properly.',
            priority: 'high'
          });
        }
      });
    }

    return {
      immediateActions: actions.length > 0 ? actions : [{
        crop: 'general',
        action: 'Weather conditions are generally favorable for farming. Continue regular monitoring and maintenance.',
        priority: 'low'
      }],
      weatherRecommendations: recommendations,
      risks: risks,
      optimalTiming: timing,
      generalTips: tips
    };
  }

  // Get crop-specific recommendations
  async getCropSpecificAdvice(cropName, weatherData) {
    const cropAdvice = {
      'Maize': {
        temperature: { min: 18, max: 32, optimal: 25 },
        rainfall: { min: 500, optimal: 800 },
        humidity: { min: 60, max: 80 }
      },
      'Rice': {
        temperature: { min: 20, max: 35, optimal: 28 },
        rainfall: { min: 1000, optimal: 1500 },
        humidity: { min: 70, max: 90 }
      },
      'Cassava': {
        temperature: { min: 20, max: 35, optimal: 30 },
        rainfall: { min: 1000, optimal: 1500 },
        humidity: { min: 60, max: 80 }
      }
    };

    const crop = cropAdvice[cropName];
    if (!crop) return null;

    const currentTemp = weatherData.current.temperature;
    const currentHumidity = weatherData.current.humidity;

    let advice = `For ${cropName}: `;
    
    if (currentTemp < crop.temperature.min) {
      advice += 'Temperature is too low for optimal growth. ';
    } else if (currentTemp > crop.temperature.max) {
      advice += 'Temperature is too high. Consider shade or irrigation. ';
    } else {
      advice += 'Temperature conditions are favorable. ';
    }

    if (currentHumidity < crop.humidity.min) {
      advice += 'Humidity is low. Increase irrigation. ';
    } else if (currentHumidity > crop.humidity.max) {
      advice += 'Humidity is high. Monitor for diseases. ';
    }

    return advice;
  }
}

export default new CropAdvisoryService(); 