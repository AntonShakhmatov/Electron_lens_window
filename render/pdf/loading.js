const statusEl = document.getElementById('status');
// const btn = document.getElementById('toggleLens');
const filePick = document.getElementById('filePick');
const language = document.getElementById('language');
const next = document.getElementById('nextButton');

export default class Loading {
    async setLoading(isLoading) {
        statusEl.textContent = isLoading ? 'Translating…' : '';
        filePick.disabled = isLoading;
        // btn.disabled = isLoading;
        language.disabled = isLoading;
        next.disabled = isLoading;
        language.classList.toggle('is-disabled', isLoading);
        // btn.classList.toggle('is-loading-disabled', isLoading);
        next.classList.toggle('is-loading-disabled', isLoading);
    }
}
