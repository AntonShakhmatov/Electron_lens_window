const statusEl = document.getElementById('status');
const btn = document.getElementById('toggleLens')
const filePick = document.getElementById('filePick')

export default class Loading {
    async setLoading(isLoading) {
        statusEl.textContent = isLoading ? 'Translating…' : '';
        filePick.disabled = isLoading;
        btn.disabled = isLoading;
    }
}
