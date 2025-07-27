# Weather App Frontend

A React-based weather application with farming advisory features, multi-language support, and voice integration.

## Features

- **Weather Information**: Real-time weather data with 7-day forecasts
- **Crop Advisory**: AI-powered farming recommendations based on weather conditions
- **Multi-language Support**: Support for multiple African languages
- **Voice Integration**: ElevenLabs text-to-speech with Nigerian/African voices
- **Weather Alerts**: Audio alerts for severe weather conditions
- **Community Updates**: Social features for farmers

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   # ElevenLabs API Key (for voice features)
   REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   
   # Other API keys as needed
   REACT_APP_WEATHER_API_KEY=your_weather_api_key
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ```

### Getting ElevenLabs API Key

1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Go to your profile settings
3. Copy your API key
4. Add it to your `.env` file as `REACT_APP_ELEVENLABS_API_KEY`

### Voice Configuration

The app uses Nigerian/African voices for better localization. You can customize the voice IDs in `src/services/elevenLabsService.js`:

```javascript
this.voices = {
  nigerianMale: 'your_nigerian_male_voice_id',
  nigerianFemale: 'your_nigerian_female_voice_id',
  africanMale: 'your_african_male_voice_id',
  africanFemale: 'your_african_female_voice_id',
};
```

To find voice IDs:
1. Go to ElevenLabs Voice Library
2. Search for Nigerian or African voices
3. Copy the voice ID from the voice details

### Running the Application

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Voice Features

### Weather Alerts
- High-priority alerts are automatically played with audio
- Manual play button for all alerts
- Uses Nigerian/African voices based on language preference

### Farming Guidance
- Audio playback of crop advisory information
- Localized voice selection based on user's language

### Audio Controls
- Toggle audio on/off in the header
- Visual feedback during audio playback
- Error handling for missing API keys

## Language Support

The app supports multiple African languages with voice integration:
- English (en)
- Hausa (ha)
- Yoruba (yo)
- Igbo (ig)
- Swahili (sw)
- Amharic (am)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
