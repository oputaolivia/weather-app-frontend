import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { updateUser } from '../services/userService';
import { useWeather } from '../contexts/WeatherContext';
import { useLanguage } from '../contexts/LanguageContext';
import CropSelector from '../components/CropSelector';
import LanguageSelector from '../components/LanguageSelector';
import { getCookie } from '../services/cookies';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, setUser } = useUser();
  const token = JSON.parse(getCookie('weatherAppUser')).data.token
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const { userCrops } = useWeather();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.data) {
      const { location, ...rest } = user.data;
      setFormData({ ...rest, ...location });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const original = {
        ...user.data,
        ...user.data.location,
      };

      const changedFields = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== original[key]) acc[key] = value;
        return acc;
      }, {});

      const locationKeys = ['address', 'lga', 'city', 'state'];
      const location = {};

      locationKeys.forEach(key => {
        if (key in changedFields) {
          location[key] = changedFields[key];
          delete changedFields[key];
        }
      });

      const payload = {
        ...changedFields,
        ...(Object.keys(location).length ? { location } : {}),
      };

      if (Object.keys(payload).length === 0) {
        setSaveSuccess('No changes detected.');
        return;
      }

      const updatedUser = await updateUser(payload, token, user.data._id);
      setUser(updatedUser);
      setSaveSuccess('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  if (!formData) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{t('userInformation') || 'User Information'}</h2>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setSaveError('');
              setSaveSuccess('');
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            {isEditing ? t('cancel') : t('edit')}
          </button>
        </div>

        {isEditing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              <InputField label="Email" name="email" value={formData.email} disabled />
              <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
              <InputField label="LGA" name="lga" value={formData.lga} onChange={handleChange} />
              <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-white transition-all duration-200
                  ${isSaving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                `}
              >
                {isSaving && (
                  <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full"></span>
                )}
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              {saveSuccess && <p className="text-green-600 mt-2">{saveSuccess}</p>}
              {saveError && <p className="text-red-600 mt-2">{saveError}</p>}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div>
                <span className="font-bold text-lg">{user.data.firstName} {user.data.lastName}</span>
              </div>
              <div className="text-gray-500">{user.data.email}</div>
            </div>

            {/* Language Settings */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">{t('languageSettings') || 'Language Settings'}</h2>
              <div>
                <label className="block mb-2 font-semibold">{t('language')}</label>
                <LanguageSelector className="w-full max-w-xs" />
              </div>
            </div>

            {/* Crop Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
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

                        {/* API Configuration - Optional Section */}
            {/*
            <div className="bg-white rounded-lg shadow p-6 mb-6">
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
            */}

            {/* Sign Out */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={handleSignOut}
                className="w-full bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600"
              >
                {t('signOut')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, disabled }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className={`p-2 rounded-lg border ${disabled ? 'bg-gray-100' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
  </div>
);

export default Profile;
