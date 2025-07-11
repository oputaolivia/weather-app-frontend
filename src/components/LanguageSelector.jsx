import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, getSupportedLanguages, isLoading } = useLanguage();

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    changeLanguage(newLanguage);
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        disabled={isLoading}
        className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        {getSupportedLanguages().map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="fill-current h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
      
      {isLoading && (
        <div className="absolute inset-y-0 right-8 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 