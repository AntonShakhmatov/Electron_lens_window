import Reader from '../pdf/reader.js'

const reader = new Reader();

const viewer = document.getElementById('viewer')

export default class Translator {
  async renderTranslatedText(text) {
    if (typeof text !== 'string' || !text.trim()) return;
    this.renderResult(text);
  }

  clearLens() {
    viewer.textContent = '';
  }

  renderResult(result) {
    viewer.textContent = result;
  }
}