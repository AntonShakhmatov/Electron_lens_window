class Prompt {
    buildPrompt(text) {
        return `Translate the following text into Russian. Return only the translated text, without explanations:\n\n${text}`;
    }
}

module.exports = Prompt;
