import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  CloudSunIcon, 
  ArrowRight, 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind,
  Leaf,
  Users,
  Smartphone,
  Loader2,
} from 'lucide-react';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { changeLanguage, getSupportedLanguages } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = getSupportedLanguages();

  const handleLanguageSelect = async (languageCode) => {
    setIsLoading(true);
    setSelectedLanguage(languageCode);
    
    try {
      await changeLanguage(languageCode);
      // Store language preference in localStorage
      localStorage.setItem('selectedLanguage', languageCode);
      
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to sign-in page
      navigate('/signin');
    } catch (error) {
      console.error('Error changing language:', error);
      // Still navigate even if translation fails
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <CloudSunIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Setting up AgriCast
            </h3>
            <p className="text-gray-600 mb-6">
              Configuring your language preferences...
            </p>
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-sm text-gray-500">
                {selectedLanguage === 'en' ? 'Loading English...' :
                 selectedLanguage === 'yo' ? 'N gbaa Èdè Yorùbá...' :
                 selectedLanguage === 'ig' ? 'Na-ebu Asụsụ Igbo...' :
                 selectedLanguage === 'ha' ? 'Ana yin Harshen Hausa...' :
                 selectedLanguage === 'pcm' ? 'Dey load Nigerian Pidgin...' : 
                 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full mt-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <CloudSunIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to AgriCast
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your preferred language to get started with personalized weather and farming guidance
            </p>
          </div>

          {/* Language Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {languages.map((language) => (
              <div
                key={language.code}
                onClick={() => !isLoading && handleLanguageSelect(language.code)}
                className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  isLoading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:bg-white/90">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {language.code === 'en' ? '🇺🇸' : 
                           language.code === 'yo' ? '🇳🇬' :
                           language.code === 'ig' ? '🇳🇬' :
                           language.code === 'ha' ? '🇳🇬' :
                           language.code === 'pcm' ? '🇳🇬' : '🌍'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {language.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {language.code === 'en' ? 'English' :
                           language.code === 'yo' ? 'Èdè Yorùbá' :
                           language.code === 'ig' ? 'Asụsụ Igbo' :
                           language.code === 'ha' ? 'Harshen Hausa' :
                           language.code === 'pcm' ? 'Nigerian Pidgin' : language.name}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  {/* Language-specific description */}
                  <p className="text-sm text-gray-600">
                    {language.code === 'en' ? 'Get weather updates and farming advice in English' :
                     language.code === 'yo' ? 'Gba alaye oju-ọjọ ati imọran ọgbọ nínú èdè Yorùbá' :
                     language.code === 'ig' ? 'Nweta ọhụụ ihu igwe na ndụmọdụ ọrụ ugbo n\'asụsụ Igbo' :
                     language.code === 'ha' ? 'Samu bayanin yanayi da shawarar noma a cikin harshen Hausa' :
                     language.code === 'pcm' ? 'Get weather info and farming advice for Nigerian Pidgin' : 
                     'Get weather updates and farming advice'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Features Preview */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What you'll get with AgriCast
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sun className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Weather Forecast</h3>
                <p className="text-sm text-gray-600">7-day weather predictions for your farm</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Farming Advice</h3>
                <p className="text-sm text-gray-600">Personalized crop recommendations</p>
              </div>
              {/* <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-600">Connect with other farmers</p>
              </div> */}
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy Access</h3>
                <p className="text-sm text-gray-600">Works on any device</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Your language preference will be saved and can be changed later in settings
            </p>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LanguageSelection; 