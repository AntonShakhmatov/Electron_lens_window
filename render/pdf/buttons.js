const btn = document.getElementById('toggleLens')

export default class Buttons {
    async  refreshBtn() {
        const { on } = await window.api.isTranslateOn();
        btn.textContent = on ? 'Translator: ON' : 'Translator: OFF';
        return on;
    }
}