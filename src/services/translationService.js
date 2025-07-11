// LibreTranslate API Configuration
// Get your API key from: https://libretranslate.com/
// Alternative: Use Google Cloud Translation API or Microsoft Translator
const LIBRETRANSLATE_API_KEY = 'YOUR_LIBRETRANSLATE_API_KEY_HERE';
const LIBRETRANSLATE_URL = 'https://libretranslate.com/translate';

// Language codes for Nigerian languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', code: 'en' },
  yo: { name: 'Yoruba', code: 'yo' },
  ig: { name: 'Igbo', code: 'ig' },
  ha: { name: 'Hausa', code: 'ha' },
  pcm: { name: 'Nigerian Pidgin', code: 'pcm' }
};

class TranslationService {
  constructor() {
    this.apiKey = LIBRETRANSLATE_API_KEY;
    this.baseUrl = LIBRETRANSLATE_URL;
  }

  // Translate text to target language
  async translateText(text, targetLang, sourceLang = 'en') {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          api_key: this.apiKey
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to original text if translation fails
      return text;
    }
  }

  // Translate multiple texts
  async translateMultiple(texts, targetLang, sourceLang = 'en') {
    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLang, sourceLang))
    );
    return translations;
  }

  // Get supported languages
  async getSupportedLanguages() {
    try {
      const response = await fetch('https://libretranslate.com/languages');
      if (!response.ok) {
        return Object.values(SUPPORTED_LANGUAGES);
      }
      
      const languages = await response.json();
      return languages.filter(lang => 
        Object.keys(SUPPORTED_LANGUAGES).includes(lang.code)
      );
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      return Object.values(SUPPORTED_LANGUAGES);
    }
  }

  // Detect language of text
  async detectLanguage(text) {
    try {
      const response = await fetch('https://libretranslate.com/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          api_key: this.apiKey
        })
      });

      if (!response.ok) {
        return 'en'; // Default to English
      }

      const data = await response.json();
      return data[0]?.language || 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }
}

export default new TranslationService(); 