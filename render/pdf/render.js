import Reader from './reader.js'
import Translator from './translator.js'
import Buttons from './buttons.js';
import Loading from './loading.js';

const reader = new Reader();
const translator = new Translator();
const buttons = new Buttons();
const loading = new Loading();

const btn = document.getElementById('toggleLens')
const filePick = document.getElementById('filePick')
const input = document.getElementById('filePick');


pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL('../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs', window.location.href).toString()

// Choose the file --- open and render
let lastTranslated = ''
filePick.addEventListener('change', async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  loading.setLoading(true);

  try {
  const buf = await file.arrayBuffer()

  await reader.openAndRenderPdf({ file })
  const items = await reader.getItems(buf)

  console.log('PDF TEXT:', items)

  lastTranslated = await window.api.translatePdf(items);
  console.log('TRANSLATED:', lastTranslated)

  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Translation failed';
  } finally {
    loading.setLoading(false);
  }

})

// --- 1) Lens toggle
btn.addEventListener('click', async (e) => {
  const file = e.target.files?.[0]
  const { on } = await window.api.toggleTranslate();
  await buttons.refreshBtn();

  if (!on) {
    input.style.visibility = 'visible';
    return reader.openAndRenderPdf({ file });
  } else {
    console.log("translation");
    input.style.visibility = 'hidden';
    return translator.renderTranslatedText(lastTranslated);
  }
});