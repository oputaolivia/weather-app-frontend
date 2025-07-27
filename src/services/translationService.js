// OpenAI API Configuration
import OpenAI from "openai";

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', code: 'en' },
  yo: { name: 'Yoruba', code: 'yo' },
  ig: { name: 'Igbo', code: 'ig' },
  ha: { name: 'Hausa', code: 'ha' },
  pcm: { name: 'Nigerian Pidgin', code: 'pcm' }
};

// Use OpenAI API key from environment variable
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

class TranslationService {
  constructor() {
    this.client = null;
    this.cache = new Map(); // Translation cache
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (apiKey) {
      try {
        this.client = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true // Only use this in development
        });
      } catch (error) {
        console.error('Failed to initialize OpenAI client:', error);
        this.client = null;
      }
    } else {
      console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables. Using fallback translations.');
    }

    // Load cache from localStorage on initialization
    this.loadCacheFromStorage();
    
    // Preload common translations
    this.preloadCommonTranslations();
  }

  // Preload common translations for faster initial load
  preloadCommonTranslations() {
    const commonPhrases = [
      'Good Morning', 'Good Afternoon', 'Good Evening',
      "Today's Weather", '7-Day Forecast', 'Crop Advisory',
      'Weather Alert', 'Rain Alert', 'Wind Alert',
      'High Priority', 'Medium Priority', 'Low Priority',
      'Loading...', 'Guest', 'Audio Alerts', 'Feels like',
      'Sunrise', 'Sunset', 'Visibility', 'Community Updates',
      'from', 'hoursAgo', 'share'
    ];
    
    const languages = ['yo', 'ig', 'ha', 'pcm'];
    
    // Preload fallback translations
    commonPhrases.forEach(phrase => {
      languages.forEach(lang => {
        const fallback = this.getFallbackTranslation(phrase, lang);
        if (fallback !== phrase) {
          this.setCache(phrase, lang, 'en', fallback);
        }
      });
    });
  }

  // Cache management methods
  getCacheKey(text, targetLang, sourceLang) {
    return `${sourceLang}_${targetLang}_${text}`;
  }

  getFromCache(text, targetLang, sourceLang) {
    const key = this.getCacheKey(text, targetLang, sourceLang);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.translation;
    }
    
    // Remove expired cache entry
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  setCache(text, targetLang, sourceLang, translation) {
    const key = this.getCacheKey(text, targetLang, sourceLang);
    this.cache.set(key, {
      translation,
      timestamp: Date.now()
    });
    
    // Save to localStorage
    this.saveCacheToStorage();
  }

  saveCacheToStorage() {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem('translationCache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save translation cache to localStorage:', error);
    }
  }

  loadCacheFromStorage() {
    try {
      const cached = localStorage.getItem('translationCache');
      if (cached) {
        const cacheData = JSON.parse(cached);
        this.cache = new Map(cacheData);
      }
    } catch (error) {
      console.warn('Failed to load translation cache from localStorage:', error);
    }
  }

  // Clear cache (useful for debugging or when cache gets too large)
  clearCache() {
    this.cache.clear();
    localStorage.removeItem('translationCache');
  }

  // Clean translated text by removing quotes and extra formatting
  cleanTranslatedText(text) {
    if (!text) return text;
    
    // Remove surrounding quotes (both single and double)
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^["']|["']$/g, ''); // Remove quotes at start/end
    cleaned = cleaned.replace(/^["']|["']$/g, ''); // Remove any remaining quotes
    
    // Remove extra whitespace
    cleaned = cleaned.trim();
    
    return cleaned;
  }

  // Simple fallback translations for common phrases
  getFallbackTranslation(text, targetLang) {
    if (targetLang === 'en') return text;
    
    const fallbackTranslations = {
      'Good Morning': {
        'yo': 'E kaaro',
        'ig': 'Ụtụtụ ọma',
        'ha': 'Ina kwana',
        'pcm': 'Gud morning'
      },
      'Good Afternoon': {
        'yo': 'E kaasan',
        'ig': 'Ehihie ọma',
        'ha': 'Barka da rana',
        'pcm': 'Gud afternoon'
      },
      'Good Evening': {
        'yo': 'E kaale',
        'ig': 'Mgbede ọma',
        'ha': 'Barka da yamma',
        'pcm': 'Gud evening'
      },
      "Today's Weather": {
        'yo': 'Oju ojo ti oni',
        'ig': 'Ihu igwe taa',
        'ha': 'Yanayin yau',
        'pcm': 'Weda for today'
      },
      '7-Day Forecast': {
        'yo': 'Ipeju ojo 7',
        'ig': 'Amụma ụbọchị 7',
        'ha': 'Hasashen kwana 7',
        'pcm': '7 days forecast'
      },
      'Crop Advisory': {
        'yo': 'Imọran ọgbọ',
        'ig': 'Ndụmọdụ ọka',
        'ha': 'Shawarar amfanin gona',
        'pcm': 'Crop advice'
      },
      'Weather Alert': {
        'yo': 'Ikilo oju ojo',
        'ig': 'Ịdọ aka ná ntị ihu igwe',
        'ha': 'Faɗakarwar yanayi',
        'pcm': 'Weda alert'
      },
      'Rain Alert': {
        'yo': 'Ikilo ojo',
        'ig': 'Ịdọ aka ná ntị mmiri ozuzo',
        'ha': 'Faɗakarwar ruwa',
        'pcm': 'Rain alert'
      },
      'Wind Alert': {
        'yo': 'Ikilo afẹfẹ',
        'ig': 'Ịdọ aka ná ntị ifufe',
        'ha': 'Faɗakarwar iska',
        'pcm': 'Wind alert'
      },
      'High Priority': {
        'yo': 'Ipele giga',
        'ig': 'Ihe dị mkpa',
        'ha': 'Babban fifiko',
        'pcm': 'High priority'
      },
      'Medium Priority': {
        'yo': 'Ipele aarin',
        'ig': 'Ihe dị mkpa nke ọkara',
        'ha': 'Matsakaicin fifiko',
        'pcm': 'Medium priority'
      },
      'Low Priority': {
        'yo': 'Ipele kekere',
        'ig': 'Ihe dị mkpa dị ala',
        'ha': 'Ƙananan fifiko',
        'pcm': 'Low priority'
      },
      'Loading...': {
        'yo': 'N gbaa...',
        'ig': 'Na-ebu...',
        'ha': 'Ana yin...',
        'pcm': 'Dey load...'
      },
      'Guest': {
        'yo': 'Alejo',
        'ig': 'Onye ọbịa',
        'ha': 'Baƙo',
        'pcm': 'Guest'
      },
      'Audio Alerts': {
        'yo': 'Ikilo orin',
        'ig': 'Ịdọ aka ná ntị ụda',
        'ha': 'Faɗakarwar sauti',
        'pcm': 'Audio alerts'
      },
      'Feels like': {
        'yo': 'O ri bi',
        'ig': 'Ọ dị ka',
        'ha': 'Yana kamar',
        'pcm': 'Feel like'
      },
      'Sunrise': {
        'yo': 'Ile oju ojo',
        'ig': 'Ọpụpụ anyanwụ',
        'ha': 'Fitar da rana',
        'pcm': 'Sunrise'
      },
      'Sunset': {
        'yo': 'Ibojú oju ojo',
        'ig': 'Ọdịda anyanwụ',
        'ha': 'Faɗuwar rana',
        'pcm': 'Sunset'
      },
      'Visibility': {
        'yo': 'Iri ri',
        'ig': 'Ịhụ ụzọ',
        'ha': 'Ganewa',
        'pcm': 'Visibility'
      },
      'Community Updates': {
        'yo': 'Imudojuiwọn agbegbe',
        'ig': 'Mmelite obodo',
        'ha': 'Sabbin labarai na al\'umma',
        'pcm': 'Community updates'
      },
      'from': {
        'yo': 'lati',
        'ig': 'site na',
        'ha': 'daga',
        'pcm': 'from'
      },
      'hoursAgo': {
        'yo': 'wakati sẹhin',
        'ig': 'awa gara aga',
        'ha': 'sa\'o\'i da suka wuce',
        'pcm': 'hours ago'
      },
      'share': {
        'yo': 'pin',
        'ig': 'kesaa',
        'ha': 'raba',
        'pcm': 'share'
      }
    };

    return fallbackTranslations[text]?.[targetLang] || text;
  }

  // Translate text to target language using OpenAI API or fallback
  async translateText(text, targetLang, sourceLang = 'en') {
    if (!text || targetLang === sourceLang) return text;
    
    // Check cache first
    const cachedTranslation = this.getFromCache(text, targetLang, sourceLang);
    if (cachedTranslation) {
      return cachedTranslation;
    }
    
    // Try fallback translation first
    const fallbackTranslation = this.getFallbackTranslation(text, targetLang);
    if (fallbackTranslation !== text) {
      // Cache the fallback translation
      this.setCache(text, targetLang, sourceLang, fallbackTranslation);
      return fallbackTranslation;
    }
    
    // If no OpenAI client, return original text
    if (!this.client) {
      console.warn('OpenAI client not available, returning original text');
      return text;
    }
    
    try {
      const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Return ONLY the translated text without any quotes, formatting, or explanations.\n\nText: ${text}`;
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a professional translator. Translate the given text accurately and naturally to the target language. IMPORTANT: Return ONLY the translated text without any quotes, formatting, explanations, or additional text. Do not wrap the translation in quotes." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });
      
      const translatedText = this.cleanTranslatedText(response.choices[0].message.content.trim());
      
      // Cache the translation
      this.setCache(text, targetLang, sourceLang, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  // Translate multiple texts with caching
  async translateMultiple(texts, targetLang, sourceLang = 'en') {
    if (!texts || texts.length === 0) return [];
    
    // Check cache for all texts first
    const results = [];
    const textsToTranslate = [];
    const indicesToTranslate = [];
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const cachedTranslation = this.getFromCache(text, targetLang, sourceLang);
      
      if (cachedTranslation) {
        results[i] = cachedTranslation;
      } else {
        // Try fallback translation
        const fallbackTranslation = this.getFallbackTranslation(text, targetLang);
        if (fallbackTranslation !== text) {
          results[i] = fallbackTranslation;
          this.setCache(text, targetLang, sourceLang, fallbackTranslation);
        } else {
          textsToTranslate.push(text);
          indicesToTranslate.push(i);
        }
      }
    }
    
    // If no texts need translation, return results
    if (textsToTranslate.length === 0) {
      return results;
    }
    
    // If no OpenAI client, use fallback for remaining texts
    if (!this.client) {
      console.warn('OpenAI client not available, using fallback translations');
      for (let i = 0; i < textsToTranslate.length; i++) {
        const text = textsToTranslate[i];
        const fallbackTranslation = this.getFallbackTranslation(text, targetLang);
        results[indicesToTranslate[i]] = fallbackTranslation;
        this.setCache(text, targetLang, sourceLang, fallbackTranslation);
      }
      return results;
    }
    
    try {
      // If only one text needs translation, use translateText
      if (textsToTranslate.length === 1) {
        const translatedText = await this.translateText(textsToTranslate[0], targetLang, sourceLang);
        results[indicesToTranslate[0]] = translatedText;
        return results;
      }
      
      // For multiple texts, batch them in one request
      const joined = textsToTranslate.map((t, i) => `${i + 1}. ${t}`).join('\n');
      const prompt = `Translate the following list of texts from ${sourceLang} to ${targetLang}. Return ONLY the translated texts as a numbered list, without any quotes or additional formatting.\n\n${joined}`;
      
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are a professional translator. Translate the given list of texts accurately and naturally to the target language. IMPORTANT: Return ONLY the translated texts as a numbered list, without any quotes, formatting, or additional text. Do not wrap any translations in quotes." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });
      
      // Parse the numbered list from the response
      const content = response.choices[0].message.content.trim();
      const lines = content.split(/\r?\n/).map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
      
      // Clean each translated line
      const cleanedLines = lines.map(line => this.cleanTranslatedText(line));
      
      // If the number of lines doesn't match, fallback to sequential
      if (cleanedLines.length !== textsToTranslate.length) {
        console.warn('Batch parsing failed, falling back to individual requests');
        for (let i = 0; i < textsToTranslate.length; i++) {
          const translatedText = await this.translateText(textsToTranslate[i], targetLang, sourceLang);
          results[indicesToTranslate[i]] = translatedText;
        }
        return results;
      }
      
      // Cache and return results
      for (let i = 0; i < cleanedLines.length; i++) {
        const text = textsToTranslate[i];
        const translation = cleanedLines[i];
        results[indicesToTranslate[i]] = translation;
        this.setCache(text, targetLang, sourceLang, translation);
      }
      
      return results;
    } catch (error) {
      console.error('Batch translation error:', error);
      // Fallback to sequential translation
      for (let i = 0; i < textsToTranslate.length; i++) {
        const translatedText = await this.translateText(textsToTranslate[i], targetLang, sourceLang);
        results[indicesToTranslate[i]] = translatedText;
      }
      return results;
    }
  }

  // Get supported languages (static)
  async getSupportedLanguages() {
    return Object.values(SUPPORTED_LANGUAGES);
  }

  // Detect language (not implemented)
  async detectLanguage(text) {
    // Optionally, use GPT for language detection
    return 'en';
  }
}

export default new TranslationService(); 