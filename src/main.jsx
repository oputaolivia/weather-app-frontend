import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WeatherProvider } from './contexts/WeatherContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <LanguageProvider>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </LanguageProvider>
  </UserProvider>
</StrictMode>
)
