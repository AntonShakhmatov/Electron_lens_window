import Reader from './reader.js'
import Translator from './translator.js'
import Buttons from './buttons.js';
import Loading from './loading.js';

const reader = new Reader();
const translator = new Translator();
const buttons = new Buttons();
buttons.init();
const loading = new Loading();

const btn = document.getElementById('toggleLens')
const filePick = document.getElementById('filePick')
const input = document.getElementById('filePick');
const next = document.getElementById('next');
const allLangs =  document.getElementById('language');
const ru = document.getElementById('ru')
const en = document.getElementById('en')
const cz = document.getElementById('cz')

const active = buttons.checkActive();

if (!active) {
  input.style.visibility = 'hidden';
} 

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL('../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs', window.location.href).toString()

// Choose the file --- open and render
let lastFile = null;
let sourceText = ''; 
let cache = { ru: '', en: '', cz: '' };

filePick.addEventListener('change', async (e) => {
  lastFile = e.target.files?.[0];
  if (!lastFile) return;

  cache = { ru: '', en: '', cz: '' };
  sourceText = '';

  const buf = await lastFile.arrayBuffer();

  await reader.openAndRenderPdf({ file: lastFile });

  sourceText = await reader.getItems(buf);
});

async function ensureTranslation(lang) {
  if (cache[lang]) return cache[lang];
  if (!sourceText) throw new Error('No PDF text loaded');

  loading.setLoading(true);

  try {
    if (lang === 'ru') cache.ru = await window.api.translatePdf(sourceText);
    if (lang === 'en') cache.en = await window.api.translateEnPdf(sourceText);
    if (lang === 'cz') cache.cz = await window.api.translateCzPdf(sourceText);
    return cache[lang];
  } finally {
    loading.setLoading(false);
  }
}

btn.addEventListener('click', async () => {
  const lang = buttons.getActive();
  if (!lang) return alert('Choose language');

  const { on } = await window.api.toggleTranslate();
  await buttons.refreshBtn();

  if (!on) {
    input.style.visibility = 'visible';
    allLangs.style.visibility = 'visible';
    next.style.display = 'none';
    if (lastFile) return reader.openAndRenderPdf({ file: lastFile });
    return;
  }

  input.style.visibility = 'hidden';
  allLangs.style.visibility = 'hidden';
  next.style.display = 'block';

  try {
    const translated = await ensureTranslation(lang);
    translator.renderTranslatedText(translated);
  } catch (e) {
    console.error(e);
    alert('Choose a file first');
  }
});

ru.addEventListener('click', async () => {
  const active = buttons.checkActive();

  if (active) {
    input.style.visibility = 'visible';
  } else {
    input.style.visibility = 'hidden';
  }
});

en.addEventListener('click', async () => {
  const active = buttons.checkActive();

  if (active) {
    input.style.visibility = 'visible';
  } else {
    input.style.visibility = 'hidden';
  }
});

cz.addEventListener('click', async () => {
  const active = buttons.checkActive();

  if (active) {
    input.style.visibility = 'visible';
  } else {
    input.style.visibility = 'hidden';
  }
})