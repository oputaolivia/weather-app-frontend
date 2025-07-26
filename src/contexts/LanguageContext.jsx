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
      windAlert: 'Wind Alert',
      stormAlert: 'Storm Alert',
      temperatureAlert: 'Temperature Alert',
      humidityAlert: 'Humidity Alert',
      farmingAlert: 'Farming Alert',
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      lowPriority: 'Low Priority',
      windAdvisory: 'Wind Advisory',
      strongWinds: 'Strong winds expected in the northern region. Secure your crops and farm structures.',
      weatherAlerts: 'Weather Alerts',
      heavyRainfallExpected: 'Heavy Rainfall Expected',
      
      // Intelligent Farming Alerts
      alertSummary: 'Alert Summary',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      recommendedActions: 'Recommended Actions',
      noAlerts: 'No Active Alerts',
      noAlertsMessage: 'Current weather conditions are favorable for farming activities.',
      cropSelectionReminder: 'Crop Selection Reminder',
      cropSelectionMessage: 'Select your crops in the profile to receive personalized farming alerts.',
      
      // Simple Weather Alerts
      weatherTooHot: 'Weather Too Hot',
      weatherTooHotMessage: 'Weather is very hot. Your crops need extra care.',
      weatherTooCold: 'Weather Too Cold',
      weatherTooColdMessage: 'Weather is cold. Protect your young plants.',
      rainComing: 'Rain Coming',
      rainComingMessage: 'Heavy rain is coming. Be careful with farm work.',
      windTooStrong: 'Wind Too Strong',
      windTooStrongMessage: 'Wind is very strong. Secure your farm tools.',
      airTooWet: 'Air Too Wet',
      airTooWetMessage: 'Air is very wet. Check your crops for sickness.',
      
      // Simple Crop Alerts
      hotWeatherCrops: 'Hot Weather - Crops Need Care',
      hotWeatherCropsMessage: 'Weather is hot. Your crops need more water and shade.',
      coldWeatherCrops: 'Cold Weather - Protect Crops',
      coldWeatherCropsMessage: 'Weather is cold. Protect your crops from cold.',
      rainCrops: 'Rain Coming - Care for Crops',
      rainCropsMessage: 'Rain is coming. Check your farm drainage.',
      humidCrops: 'Wet Air - Check Crops',
      humidCropsMessage: 'Air is very wet. Check your crops for sickness.',
      goodFarmingWeather: 'Good Weather for Farming',
      goodFarmingWeatherMessage: 'Weather is good for farming. Plant and work on your farm.',
      
      // Simple General Alerts
      weatherGood: 'Weather is Good',
      weatherGoodMessage: 'Weather is perfect for farming. Plant your crops now.',
      needMoreWater: 'Farm Needs More Water',
      needMoreWaterMessage: 'Your farm needs more water. Water your crops.',
      
      // Simple Seasonal Alerts
      timeToPlant: 'Time to Plant',
      timeToPlantMessage: 'It is planting season. Prepare your land and plant crops.',
      timeToHarvest: 'Time to Harvest',
      timeToHarvestMessage: 'It is harvesting time. Get your tools ready.',
      
      // Simple Action Items
      waterFarmMore: 'Water your farm more',
      putShadeOnCrops: 'Put shade on your crops',
      workEarlyMorning: 'Work early in the morning',
      coverSmallPlants: 'Cover small plants',
      waitToPlant: 'Wait to plant',
      useWarmWater: 'Use warm water',
      dontWorkOutside: 'Do not work outside',
      checkWaterFlow: 'Check water flow in your farm',
      tieDownTools: 'Tie down your farm tools',
      tieDownCrops: 'Tie down your crops',
      checkFarmTools: 'Check your farm tools',
      dontSprayNow: 'Do not spray now',
      checkForSickness: 'Check for crop sickness',
      letAirFlow: 'Let air flow around crops',
      dontWaterMuch: 'Do not water too much',
      plantNow: 'Plant your crops now',
      putFertilizer: 'Put fertilizer on your farm',
      removeWeeds: 'Remove weeds from your farm',
      waterFarm: 'Water your farm',
      checkSoil: 'Check your soil',
      waterMorning: 'Water in the morning',
      prepareLand: 'Prepare your land',
      buyGoodSeeds: 'Buy good seeds',
      planPlanting: 'Plan your planting',
      getHarvestTools: 'Get your harvest tools',
      checkCropReady: 'Check if crops are ready',
      planHarvest: 'Plan your harvest',
      waterCropsTwice: 'Water crops twice a day',
      useShadeCloth: 'Use shade cloth',
      plantEarlyMorning: 'Plant early in the morning',
      delayPlanting: 'Delay planting',
      coverYoungPlants: 'Cover young plants',
      checkDrainage: 'Check farm drainage',
      avoidPlanting: 'Avoid planting now',
      protectSeeds: 'Protect your seeds',
      spacePlantsWell: 'Space plants well',
      checkForDisease: 'Check for crop disease',
      improveAirFlow: 'Improve air flow',
      
      // Temperature Alerts
      highTemperatureAlert: 'High Temperature Alert',
      highTemperatureMessage: 'Temperatures are above optimal range for most crops. Take immediate action to protect your crops.',
      lowTemperatureAlert: 'Low Temperature Alert',
      lowTemperatureMessage: 'Temperatures are below optimal range. Protect sensitive crops and consider delaying planting.',
      
      // Rainfall Alerts
      heavyRainfallMessage: 'Heavy rainfall is expected. Consider postponing outdoor farming activities and check drainage systems.',
      
      // Wind Alerts
      strongWindsMessage: 'Strong winds detected. Secure your crops and farm structures to prevent damage.',
      
      // Humidity Alerts
      highHumidityAlert: 'High Humidity Alert',
      highHumidityMessage: 'High humidity conditions detected. Monitor crops for fungal diseases and ensure good air circulation.',
      
      // General Farming Alerts
      optimalFarmingConditions: 'Optimal Farming Conditions',
      optimalConditionsMessage: 'Current weather conditions are ideal for most farming activities. Proceed with planting and maintenance.',
      irrigationNeeded: 'Irrigation Needed',
      irrigationNeededMessage: 'Low humidity detected. Consider increasing irrigation to maintain optimal soil moisture.',
      
      // Seasonal Alerts
      plantingSeason: 'Planting Season',
      plantingSeasonMessage: 'It\'s the optimal time for planting most crops. Prepare your soil and select quality seeds.',
      harvestingSeason: 'Harvesting Season',
      harvestingSeasonMessage: 'Harvesting season is approaching. Prepare your tools and check crop maturity.',
      
      // Action Items
      increaseIrrigation: 'Increase irrigation frequency',
      provideShade: 'Provide shade for sensitive crops',
      monitorCropStress: 'Monitor crops for stress signs',
      protectSensitiveCrops: 'Protect sensitive crops from cold',
      delayPlanting: 'Delay planting until conditions improve',
      useRowCovers: 'Use row covers for protection',
      postponeOutdoorActivities: 'Postpone outdoor farming activities',
      checkDrainage: 'Check and clear drainage systems',
      secureFarmStructures: 'Secure farm structures and equipment',
      secureCrops: 'Secure crops and trellises',
      avoidSpraying: 'Avoid spraying during windy conditions',
      monitorDiseases: 'Monitor for fungal diseases',
      improveAirCirculation: 'Improve air circulation around crops',
      reduceIrrigation: 'Reduce irrigation to prevent waterlogging',
      proceedWithPlanting: 'Proceed with planting activities',
      maintainCurrentPractices: 'Maintain current farming practices',
      monitorGrowth: 'Monitor crop growth and development',
      checkSoilMoisture: 'Check soil moisture levels',
      scheduleWatering: 'Schedule regular watering',
      prepareSoil: 'Prepare soil for planting',
      selectSeeds: 'Select quality seeds',
      planPlantingSchedule: 'Plan your planting schedule',
      prepareHarvestingTools: 'Prepare harvesting tools and equipment',
      checkCropMaturity: 'Check crop maturity indicators',
      planHarvestingSchedule: 'Plan your harvesting schedule',
      followCropGuidelines: 'Follow crop-specific guidelines',
      monitorCropHealth: 'Monitor crop health regularly',
      adjustPractices: 'Adjust farming practices as needed',
      
      // Time and Units
      today: 'Today',
      tomorrow: 'Tomorrow',
      retry: 'Retry',
      refresh: 'Refresh',
      forecastNotAvailable: 'Forecast data not available',
      forecastFor: 'Forecast for',
      precipitation: 'Precipitation',
      
      // Time of day
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      goodMorning: 'Good Morning',
      goodAfternoon: 'Good Afternoon',
      goodEvening: 'Good Evening',
      guest: 'Guest',
      
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
      generalFarming: 'General Farming',
      farmingAdvisory: 'Farming Advisory',
      listenToAudio: 'Listen to Audio',
      farmingGuidance: 'Get detailed farming guidance in your local language',
      
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