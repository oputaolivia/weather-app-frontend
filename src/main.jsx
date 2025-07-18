import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './index.css';
import { WeatherProvider } from './contexts/WeatherContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <LanguageProvider>         {/* LanguageProvider must wrap WeatherProvider */}
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </LanguageProvider>
  </UserProvider>
</StrictMode>
)
