# ElevenLabs Voice Integration Setup

This guide will help you set up ElevenLabs voice integration for the weather app.

## Step 1: Get ElevenLabs API Key

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for a free account
3. Go to your profile settings
4. Copy your API key

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory of your project:

```env
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## Step 3: Find Nigerian/African Voice IDs

1. Go to the ElevenLabs Voice Library
2. Search for "Nigerian" or "African" voices
3. Click on a voice to see its details
4. Copy the voice ID (it looks like: `pNInz6obpgDQGcFmaJgB`)

## Step 4: Update Voice Configuration

Edit `src/services/elevenLabsService.js` and replace the example voice IDs with real ones:

```javascript
this.voices = {
  nigerianMale: 'your_actual_nigerian_male_voice_id',
  nigerianFemale: 'your_actual_nigerian_female_voice_id',
  africanMale: 'your_actual_african_male_voice_id',
  africanFemale: 'your_actual_african_female_voice_id',
};
```

## Step 5: Test the Integration

1. Start your development server: `npm start`
2. Navigate to the Home page
3. Look for weather alerts or use the audio buttons
4. Check the browser console for any errors

## Troubleshooting

### No Audio Playing
- Check that your API key is correct
- Verify the voice IDs are valid
- Check browser console for errors
- Ensure your browser allows audio playback

### API Key Errors
- Make sure the API key is in the `.env` file
- Restart your development server after adding the key
- Check that the key has sufficient credits

### Voice Not Found
- Verify the voice IDs in the ElevenLabs dashboard
- Try different voices from the library
- Check that the voices are available in your account

## Features Available

- **Weather Alert Audio**: High-priority alerts play automatically
- **Manual Alert Playback**: Click "Listen" button on any alert
- **Farming Guidance Audio**: Audio playback of crop advisory
- **Audio Toggle**: Turn audio on/off in the header
- **Language-Specific Voices**: Different voices for different languages

## Voice Recommendations

For Nigerian/African voices, look for:
- Nigerian English accents
- West African English
- African American voices (for broader African representation)
- Voices that sound natural in local languages 