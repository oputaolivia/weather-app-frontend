import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, getSupportedLanguages, isLoading } = useLanguage();

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    changeLanguage(newLanguage);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-white/80" />
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        disabled={isLoading}
          className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 hover:bg-white/20 transition-colors"
      >
        {getSupportedLanguages().map((language) => (
            <option key={language.code} value={language.code} className="text-gray-900">
            {language.name}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="fill-current h-4 w-4 text-white/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
      
      {isLoading && (
        <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      )}
      </div>
    </div>
  );
};

export default LanguageSelector; 