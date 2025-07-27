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
    if (!apiKey) {
      console.error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables.');
    }
    
    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Only use this in development
    });
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

  // Translate text to target language using OpenAI API
  async translateText(text, targetLang, sourceLang = 'en') {
    if (!text || targetLang === sourceLang) return text;
    if (!apiKey) {
      console.warn('OpenAI API key not available, returning original text');
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
      
      const translatedText = response.choices[0].message.content.trim();
      return this.cleanTranslatedText(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  // Translate multiple texts
  async translateMultiple(texts, targetLang, sourceLang = 'en') {
    if (!texts || texts.length === 0) return [];
    if (!apiKey) {
      console.warn('OpenAI API key not available, returning original texts');
      return texts;
    }
    
    try {
      // If only one text, use translateText
      if (texts.length === 1) {
        return [await this.translateText(texts[0], targetLang, sourceLang)];
      }
      
      // For multiple texts, batch them in one request
      const joined = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');
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
      if (cleanedLines.length !== texts.length) {
        console.warn('Batch parsing failed, falling back to individual requests');
        return await Promise.all(texts.map(t => this.translateText(t, targetLang, sourceLang)));
      }
      
      return cleanedLines;
    } catch (error) {
      console.error('Batch translation error:', error);
      // Fallback to sequential translation
      return await Promise.all(texts.map(t => this.translateText(t, targetLang, sourceLang)));
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