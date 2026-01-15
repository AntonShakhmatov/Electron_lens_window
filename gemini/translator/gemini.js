const GeminiClient = require('./client');

const gemini = new GeminiClient(process.env.GEMINI_API_KEY);

module.exports = {
  translate(text) {
    return gemini.generate(text);
  },
  translateEn(text) {
    return gemini.generateEn(text);
  },
  translateCz(text) {
    return gemini.generateCz(text);
  }
};