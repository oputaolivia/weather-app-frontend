// AI Crop Advisory Service using GitHub AI Models
import OpenAI from "openai";

const token = import.meta.env.VITE_GITHUB_GPT_API_KEY;
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
    this.client = new OpenAI({ 
      baseURL: endpoint, 
      apiKey: token,
      dangerouslyAllowBrowser: true
    });
  }

  // Generate crop advisory based on weather and location
  async generateCropAdvisory(weatherData, location) {
    try {
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
      return this.getFallbackAdvisory(weatherData);
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

  // Fallback advisory when AI is unavailable
  getFallbackAdvisory(weatherData) {
    const currentTemp = weatherData.current.temperature;
    const humidity = weatherData.current.humidity;
    const description = weatherData.current.description;

    const actions = [];
    
    // Basic temperature-based advice
    if (currentTemp > 30) {
      actions.push({
        crop: 'general',
        action: 'High temperature detected. Ensure adequate irrigation and consider shade for sensitive crops.',
        priority: 'high'
      });
    } else if (currentTemp < 15) {
      actions.push({
        crop: 'general',
        action: 'Low temperature detected. Protect sensitive crops and consider delaying planting.',
        priority: 'high'
      });
    }

    // Humidity-based advice
    if (humidity > 80) {
      actions.push({
        crop: 'general',
        action: 'High humidity detected. Monitor for fungal diseases and ensure good air circulation.',
        priority: 'medium'
      });
    }

    return {
      immediateActions: actions,
      weatherRecommendations: [
        {
          type: 'Temperature',
          description: `Current temperature is ${currentTemp}°C. ${currentTemp > 25 ? 'Warm conditions are good for most crops.' : 'Cool conditions may slow growth.'}`
        }
      ],
      risks: [],
      optimalTiming: [],
      generalTips: [
        'Monitor weather conditions regularly',
        'Adjust irrigation based on rainfall',
        'Protect crops from extreme weather events'
      ]
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