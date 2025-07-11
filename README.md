# FarmWeather Nigeria - Weather App Frontend

A comprehensive weather application designed specifically for Nigerian farmers, providing real-time weather data, crop advisories, and multilingual support.

## 🌟 Features

### Weather Information
- **Current Weather**: Real-time temperature, humidity, wind speed, and weather conditions
- **7-Day Forecast**: Detailed weather predictions for the week
- **Weather Alerts**: Important weather warnings and advisories
- **Location-based**: Automatically detects user location or allows manual city selection

### AI-Powered Crop Advisory
- **Personalized Recommendations**: AI-generated farming advice based on weather conditions and user's crops
- **Crop Selection**: Choose from common Nigerian crops (Maize, Rice, Cassava, etc.)
- **Risk Assessment**: Identifies potential risks and provides mitigation strategies
- **Optimal Timing**: Suggests best times for farming activities

### Multilingual Support
- **Nigerian Languages**: English, Yoruba, Igbo, Hausa, and Nigerian Pidgin
- **Dynamic Translation**: Real-time translation using LibreTranslate API
- **Language Persistence**: Remembers user's language preference

### User Management
- **Sign Up/Sign In**: User authentication interface
- **Profile Management**: Update personal information and crop preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 18 with JSX
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **APIs**: 
  - OpenWeather API (weather data)
  - LibreTranslate API (multilingual support)
  - OpenAI GPT-4 (crop advisory AI)

## 📋 Prerequisites

Before running this application, you'll need to obtain API keys for the following services:

### 1. OpenWeather API
- **Purpose**: Weather data (current weather, forecast, alerts)
- **Get API Key**: [OpenWeather API](https://openweathermap.org/api)
- **Cost**: Free tier available (1000 calls/day)

### 2. LibreTranslate API
- **Purpose**: Multilingual translation support
- **Get API Key**: [LibreTranslate](https://libretranslate.com/)
- **Alternative**: Google Cloud Translation API or Microsoft Translator
- **Cost**: Free tier available

### 3. OpenAI API
- **Purpose**: AI-powered crop advisory generation
- **Get API Key**: [OpenAI Platform](https://platform.openai.com/)
- **Alternative**: Anthropic Claude or Google Gemini
- **Cost**: Pay-per-use (very affordable for this use case)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd weather-app-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Keys
Open the following files and replace the placeholder API keys:

#### `src/services/weatherService.js`
```javascript
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY_HERE';
```

#### `src/services/translationService.js`
```javascript
const LIBRETRANSLATE_API_KEY = 'YOUR_LIBRETRANSLATE_API_KEY_HERE';
```

#### `src/services/cropAdvisoryService.js`
```javascript
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

### Getting Started
1. **Sign Up/In**: Create an account or sign in to access personalized features
2. **Select Location**: The app will automatically detect your location, or you can manually enter a city
3. **Choose Crops**: Go to Profile page and select the crops you grow
4. **View Weather**: Check current weather and forecast on the home page
5. **Get Advice**: Receive AI-generated farming recommendations based on weather and your crops

### Language Support
- Use the language selector in the navigation bar to switch between languages
- All content will be automatically translated
- Language preference is saved for future visits

### Crop Advisory
- Select your crops in the Profile section
- View personalized farming advice on the home page
- Recommendations are updated based on current weather conditions

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── WeatherCard.jsx
│   ├── CropAdvisoryCard.jsx
│   ├── LanguageSelector.jsx
│   └── CropSelector.jsx
├── contexts/           # React Context providers
│   ├── WeatherContext.jsx
│   └── LanguageContext.jsx
├── pages/             # Page components
│   ├── Home.jsx
│   ├── Forecast.jsx
│   ├── Alerts.jsx
│   ├── Profile.jsx
│   ├── SignIn.jsx
│   └── SignUp.jsx
├── services/          # API service functions
│   ├── weatherService.js
│   ├── translationService.js
│   └── cropAdvisoryService.js
├── App.jsx           # Main application component
└── main.jsx         # Application entry point
```

## 🔧 Configuration

### Environment Variables
For production deployment, consider using environment variables:

```bash
VITE_OPENWEATHER_API_KEY=your_openweather_key
VITE_LIBRETRANSLATE_API_KEY=your_libretranslate_key
VITE_OPENAI_API_KEY=your_openai_key
```

### Customization
- **Colors**: Modify the color scheme in `tailwind.config.js`
- **Languages**: Add more languages in `src/services/translationService.js`
- **Crops**: Update crop list in `src/services/cropAdvisoryService.js`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect your GitHub repository for automatic deployment
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload the `dist` folder to an S3 bucket
- **GitHub Pages**: Use GitHub Actions for deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeather**: For providing comprehensive weather data
- **LibreTranslate**: For open-source translation services
- **OpenAI**: For AI-powered crop advisory capabilities
- **Tailwind CSS**: For the excellent utility-first CSS framework
- **React Community**: For the amazing ecosystem and tools

## 📞 Support

For support, email support@farmweather.ng or create an issue in this repository.

---

**Note**: This is a frontend-only application. For a full-stack solution, you would need to implement backend services for user authentication, data persistence, and API key management.
