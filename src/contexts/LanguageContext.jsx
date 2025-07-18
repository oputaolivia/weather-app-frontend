import React, { createContext, useContext, useState, useEffect } from 'react';
import translationService, { SUPPORTED_LANGUAGES } from '../services/translationService';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Default translations in English
  const defaultTranslations = {
    en: {
      // Navigation
      home: 'Home',
      forecast: 'Forecast',
      alerts: 'Alerts',
      profile: 'Profile',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      
      // Weather
      currentWeather: 'Current Weather',
      todaysWeather: "Today's Weather",
      feelsLike: 'Feels like',
      humidity: 'Humidity',
      wind: 'Wind',
      weatherAlert: 'Weather Alert',
      sevenDayForecast: '7-Day Forecast',
      
      // Crop Advisory
      cropAdvisories: 'Crop Advisories',
      cropAdvisory: 'Crop Advisory',
      communityUpdates: 'Community Updates',
      listen: 'Listen',
      
      // Profile
      language: 'Language',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      enterName: 'Enter your name',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      userInformation: 'User Information',
      languageSettings: 'Language Settings',
      cropSelection: 'Crop Selection',
      cropSelectionDescription: 'Select the crops you grow to receive personalized farming advice.',
      selectedCrops: 'Selected Crops',
      
      // Weather descriptions
      sunny: 'Sunny',
      cloudy: 'Cloudy',
      rainy: 'Rainy',
      stormy: 'Stormy',
      windy: 'Windy',
      
      // Alerts
      heavyRainfall: 'Heavy rainfall expected tomorrow afternoon. Consider postponing outdoor farming activities.',
      heavyRainAlert: 'Heavy Rain Alert',
      rainAlert: 'Rain Alert',
      highPriority: 'High Priority',
      windAdvisory: 'Wind Advisory',
      strongWinds: 'Strong winds expected in the northern region. Secure your crops and farm structures.',
      windAlert: 'Wind Alert',
      weatherAlerts: 'Weather Alerts',
      heavyRainfallExpected: 'Heavy Rainfall Expected',
      
      // Crop specific
      maizePlanting: 'Maize Planting',
      maizeAdvice: 'Ideal conditions for maize planting. Soil moisture is optimal.',
      riceHarvesting: 'Rice Harvesting',
      riceAdvice: 'Delay harvesting due to expected rainfall tomorrow.',
      
      // Community
      hoursAgo: 'h ago',
      share: 'Share',
      from: 'from',
      
      // Actions
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      remove: 'Remove',
      
      // Messages
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      noData: 'No data available',
      noCropsSelected: 'No Crops Selected',
      selectCropsForAdvisory: 'Select your crops in the profile to get personalized farming advice.',
      
      // Greetings
      good: 'Good',
      
      // Audio
      audioAlerts: 'Audio Alerts',
      
      // Calendar and Community
      calendar: 'Calendar',
      community: 'Community',
      
      // Form Labels
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      emailOrPhone: 'Email or Phone Number',
      enterFirstName: 'Enter your first name',
      enterLastName: 'Enter your last name',
      enterEmailOrPhone: 'Enter your email or phone number',
      enterPassword: 'Enter your password',
      signingIn: 'Signing In...',
      
      // Validation Messages
      requiredFields: 'Email/Phone and password are required.',
      invalidEmailOrPhone: 'Enter a valid email or phone number.',
      signInFailed: 'Oops! Sign-in failed.',
      signUpFailed: 'Oops! Sign-up failed.',
      accountExists: 'An account with this email or phone number already exists.',
      firstNameRequired: 'First name, last name, and password are required.',
      emailOrPhoneRequired: 'Either email or phone number is required.',
      invalidEmail: 'Invalid email format.',
      
      // Units
      celsius: '°C',
      kilometers: 'km/h',
      percent: '%',
      millimeters: 'mm',
      
      // Time
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      
      // Weather Details
      pressure: 'Pressure',
      visibility: 'Visibility',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      
      // Crop Advisory Sections
      immediateActions: 'Immediate Actions',
      weatherRecommendations: 'Weather Recommendations',
      risksAndMitigation: 'Risks & Mitigation',
      optimalTiming: 'Optimal Timing',
      generalTips: 'General Tips',
      
      // Community Messages
      communityMessage1: 'Heavy winds damaged my maize crops yesterday. Other farmers in the area should secure their farms.',
      communityMessage2: 'Perfect weather for cassava harvesting this week. Getting good yields!',
      
      // App Brand
      farmWeather: 'FarmWeather',
      kanoNigeria: 'Kano, Nigeria'
    }
  };

  // Initialize translations
  useEffect(() => {
    setTranslations(defaultTranslations);
  }, []);

  // Change language
  const changeLanguage = async (languageCode) => {
    if (languageCode === currentLanguage) return;
    
    setIsLoading(true);
    setCurrentLanguage(languageCode);
    
    try {
      // If we have cached translations, use them
      if (translations[languageCode]) {
        setIsLoading(false);
        return;
      }
      
      // Translate all English text to the target language
      const englishTexts = Object.values(defaultTranslations.en);
      const translatedTexts = await translationService.translateMultiple(
        englishTexts,
        languageCode,
        'en'
      );
      
      // Create new translations object
      const newTranslations = { ...translations };
      newTranslations[languageCode] = {};
      
      Object.keys(defaultTranslations.en).forEach((key, index) => {
        newTranslations[languageCode][key] = translatedTexts[index] || defaultTranslations.en[key];
      });
      
      setTranslations(newTranslations);
    } catch (error) {
      console.error('Error changing language:', error);
      // Fallback to English
      setCurrentLanguage('en');
    } finally {
      setIsLoading(false);
    }
  };

  // Get translation for a key
  const t = (key) => {
    return translations[currentLanguage]?.[key] || defaultTranslations.en[key] || key;
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES.en;
  };

  // Get all supported languages
  const getSupportedLanguages = () => {
    return Object.values(SUPPORTED_LANGUAGES);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    getCurrentLanguageInfo,
    getSupportedLanguages,
    supportedLanguages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 