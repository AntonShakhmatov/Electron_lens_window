const axios = require('axios');
const Prompt = require('./prompt.js');

class GeminiClient {
    constructor(apiKey, model = "gemini-2.0-flash") {
        this.apiKey = apiKey;
        this.model = model;
        this.promptBuilder = new Prompt();

        this.httpClient = axios.create({
            baseURL: 'https://generativelanguage.googleapis.com/v1beta',
            timeout: 30000,
            proxy: false,
        });
    }

    async generate(text) {
        const promptText = this.promptBuilder.buildPrompt(text);

        const res = await this.httpClient.post(
            `/models/${this.model}:generateContent?key=${this.apiKey}`,
            {
                contents: [
                    {
                        parts: [{ text: promptText }]
                    }
                ]
            }
        );

        return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
}

module.exports = GeminiClient;
