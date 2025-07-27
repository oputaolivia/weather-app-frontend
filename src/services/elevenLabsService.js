// ElevenLabs Text-to-Speech Service
// For Nigerian/African voice integration

class ElevenLabsService {
  constructor() {
    // You'll need to get your API key from ElevenLabs dashboard
    this.apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY || '';
    this.baseUrl = 'https://api.elevenlabs.io/v1';
    
    // Nigerian/African voice IDs - you can find these in the ElevenLabs voice library
    // These are example voice IDs - you should replace with actual Nigerian/African voice IDs
    this.voices = {
      nigerianMale: 'pNInz6obpgDQGcFmaJgB', // Example - replace with actual voice ID
      nigerianFemale: '21m00Tcm4TlvDq8ikWAM', // Example - replace with actual voice ID
      africanMale: 'AZnzlk1XvdvUeBnXmlld', // Example - replace with actual voice ID
      africanFemale: 'EXAVITQu4vr4xnSDxMaL', // Example - replace with actual voice ID
    };
  }

  // Get available voices from ElevenLabs
  async getVoices() {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  // Convert text to speech
  async textToSpeech(text, voiceId = null, modelId = 'eleven_monolingual_v1') {
    try {
      if (!this.apiKey) {
        console.warn('ElevenLabs API key not found. Please set REACT_APP_ELEVENLABS_API_KEY in your environment variables.');
        return null;
      }

      // Use default Nigerian voice if none specified
      const selectedVoiceId = voiceId || this.voices.nigerianMale;

      const response = await fetch(`${this.baseUrl}/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return audioBlob;
    } catch (error) {
      console.error('Error converting text to speech:', error);
      return null;
    }
  }

  // Play audio from blob
  playAudio(audioBlob) {
    if (!audioBlob) {
      console.warn('No audio blob provided');
      return;
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl); // Clean up the URL
    };

    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });

    return audio;
  }

  // Speak weather alert with Nigerian/African voice
  async speakAlert(alert, language = 'en') {
    if (!alert) return;

    let alertText = '';
    
    // Create alert message based on type and severity
    const alertType = alert.type || 'weather';
    const severity = alert.severity || 'moderate';
    const description = alert.description || '';

    // Choose voice based on language preference
    let voiceId = this.voices.nigerianMale; // Default
    
    if (language === 'ha' || language === 'yo' || language === 'ig') {
      // Use Nigerian voice for local languages
      voiceId = this.voices.nigerianFemale;
    } else if (language === 'sw' || language === 'am') {
      // Use African voice for East African languages
      voiceId = this.voices.africanFemale;
    }

    // Create alert message
    alertText = `Weather Alert: ${alertType} alert. ${description}. This is a ${severity} priority alert. Please take necessary precautions.`;

    // Convert to speech and play
    const audioBlob = await this.textToSpeech(alertText, voiceId);
    if (audioBlob) {
      this.playAudio(audioBlob);
    }
  }

  // Speak general weather information
  async speakWeatherInfo(weatherData, language = 'en') {
    if (!weatherData) return;

    const { current, location } = weatherData;
    
    let voiceId = this.voices.nigerianMale;
    
    if (language === 'ha' || language === 'yo' || language === 'ig') {
      voiceId = this.voices.nigerianFemale;
    } else if (language === 'sw' || language === 'am') {
      voiceId = this.voices.africanFemale;
    }

    const weatherText = `Current weather in ${location}: ${current.temperature} degrees Celsius, ${current.description}. Humidity is ${current.humidity} percent. Wind speed is ${current.windSpeed} kilometers per hour.`;

    const audioBlob = await this.textToSpeech(weatherText, voiceId);
    if (audioBlob) {
      this.playAudio(audioBlob);
    }
  }

  // Stop any currently playing audio
  stopAudio() {
    // This is a simple implementation - in a real app you might want to track audio instances
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}

// Create singleton instance
const elevenLabsService = new ElevenLabsService();

export default elevenLabsService; 