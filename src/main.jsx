import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './index.css';
import { WeatherProvider } from './contexts/WeatherContext';
import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WeatherProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </WeatherProvider>
  </StrictMode>,
)
