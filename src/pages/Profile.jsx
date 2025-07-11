import React, { useState } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';
import CropSelector from '../components/CropSelector';
import LanguageSelector from '../components/LanguageSelector';

const Profile = () => {
  const { userCrops, updateUserCrops } = useWeather();
  const { t } = useLanguage();
  const [userInfo, setUserInfo] = useState({
    name: 'User Name',
    email: 'user@email.com'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleSignOut = () => {
    // Here you would typically clear user session
    console.log('Signing out...');
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">{t('profile')}</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* User Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t('userInformation') || 'User Information'}</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800"
            >
              {isEditing ? t('cancel') : t('edit')}
            </button>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">{t('name')}</label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">{t('email')}</label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t('save')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <span className="font-bold text-lg">{userInfo.name}</span>
              </div>
              <div className="text-gray-500">{userInfo.email}</div>
            </div>
          )}
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">{t('languageSettings') || 'Language Settings'}</h2>
          <div>
            <label className="block mb-2 font-semibold">{t('language')}</label>
            <LanguageSelector className="w-full max-w-xs" />
          </div>
        </div>

        {/* Crop Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">{t('cropSelection') || 'Crop Selection'}</h2>
          <p className="text-gray-600 mb-4">
            {t('cropSelectionDescription') || 'Select the crops you grow to receive personalized farming advice.'}
          </p>
          <CropSelector />
          
          {userCrops.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">{t('selectedCrops') || 'Selected Crops'}</h3>
              <div className="flex flex-wrap gap-2">
                {userCrops.map((crop) => (
                  <span
                    key={crop}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">{t('apiConfiguration') || 'API Configuration'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">OpenWeather API Key</label>
              <input
                type="password"
                placeholder="Enter your OpenWeather API key"
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Get your API key from{' '}
                <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  OpenWeather API
                </a>
              </p>
            </div>
            
            <div>
              <label className="block mb-2 font-semibold">LibreTranslate API Key</label>
              <input
                type="password"
                placeholder="Enter your LibreTranslate API key"
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Get your API key from{' '}
                <a href="https://libretranslate.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  LibreTranslate
                </a>
              </p>
            </div>
            
            <div>
              <label className="block mb-2 font-semibold">OpenAI API Key (for Crop Advisory)</label>
              <input
                type="password"
                placeholder="Enter your OpenAI API key"
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Get your API key from{' '}
                <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  OpenAI Platform
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600"
          >
            {t('signOut')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 