// OpenAI GPT API Configuration for GitHub Models
import OpenAI from "openai";

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', code: 'en' },
  yo: { name: 'Yoruba', code: 'yo' },
  ig: { name: 'Igbo', code: 'ig' },
  ha: { name: 'Hausa', code: 'ha' },
  pcm: { name: 'Nigerian Pidgin', code: 'pcm' }
};

const token = import.meta.env.VITE_GITHUB_GPT_API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

class TranslationService {
  constructor() {
    this.client = new OpenAI({ 
      baseURL: endpoint, 
      apiKey: token,
      dangerouslyAllowBrowser: true
    });
  }

  // Translate text to target language using GPT API
  async translateText(text, targetLang, sourceLang = 'en') {
    if (!text || targetLang === sourceLang) return text;
    try {
      const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Only return the translated text.\n\nText: "${text}"`;
      const response = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful translation assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        top_p: 1,
        model: model
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  // Translate multiple texts
  async translateMultiple(texts, targetLang, sourceLang = 'en') {
    // For efficiency, batch in one prompt if possible, else do sequentially
    try {
      // If only one text, use translateText
      if (texts.length === 1) {
        return [await this.translateText(texts[0], targetLang, sourceLang)];
      }
      // Otherwise, join texts with a separator and ask for translation as a list
      const joined = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');
      const prompt = `Translate the following list of texts from ${sourceLang} to ${targetLang}. Return only the translated texts as a numbered list, in the same order.\n\n${joined}`;
      const response = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful translation assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        top_p: 1,
        model: model
      });
      // Parse the numbered list from the response
      const content = response.choices[0].message.content.trim();
      const lines = content.split(/\r?\n/).map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
      // If the number of lines doesn't match, fallback to sequential
      if (lines.length !== texts.length) {
        return await Promise.all(texts.map(t => this.translateText(t, targetLang, sourceLang)));
      }
      return lines;
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