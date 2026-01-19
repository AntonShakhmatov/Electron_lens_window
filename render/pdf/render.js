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
const nextButton = document.getElementById('nextButton');
const allLangs =  document.getElementById('language');
const ru = document.getElementById('ru')
const en = document.getElementById('en')
const cz = document.getElementById('cz')

const active = buttons.checkActive();

if (!active) {
  input.style.visibility = 'hidden';
  next.style.visibility = 'hidden';
} 

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL('../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs', window.location.href).toString()

// Choose the file --- open and render
let lastFile = null;
// let sourceText = ''; 
// let cache = { ru: '', en: '', cz: '' };
let pdfDoc = null;
let currentPage = 1;
const PAGE_SIZE = 10;

let arr_cache = {
  ru: [],
  en: [],
  cz: []
};

filePick.addEventListener('change', async (e) => {
  lastFile = e.target.files?.[0];
  if (!lastFile) return;

  // cache = { ru: '', en: '', cz: '' };
  currentPage = 1;
  arr_cache = { ru: [], en: [], cz: [] };
  // sourceText = '';
  pdfDoc = null;

  const buf = await lastFile.arrayBuffer();

  pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;

  await reader.openAndRenderPdf({ file: lastFile });

  // sourceText = await reader.getItems(buf);
});

async function translateNextBatch(lang) {
  if (!arr_cache[lang]) arr_cache[lang] = [];

  const batchText = await getNextPageBatchText();
  if (!batchText.trim()) return '';

  loading.setLoading(true);

  try {
    let translated;
    if (lang === 'ru') translated = await window.api.translatePdf(batchText);
    if (lang === 'en') translated = await window.api.translateEnPdf(batchText);
    if (lang === 'cz') translated = await window.api.translateCzPdf(batchText);

    arr_cache[lang].push(translated);
    return translated;
  } finally {
    loading.setLoading(false);
  }
}

// async function ensureTranslation(lang) {
//   if (cache[lang]) return cache[lang];
//   if (!sourceText) throw new Error('No PDF text loaded');

//   loading.setLoading(true);

//   try {
//     if (lang === 'ru') cache.ru = await window.api.translatePdf(sourceText);
//     if (lang === 'en') cache.en = await window.api.translateEnPdf(sourceText);
//     if (lang === 'cz') cache.cz = await window.api.translateCzPdf(sourceText);
//     return cache[lang];
//   } finally {
//     loading.setLoading(false);
//   }
// }

async function getNextPageBatchText() {
  if (!pdfDoc) throw new Error('PDF not loaded');

  const endPage = Math.min(currentPage + PAGE_SIZE - 1, pdfDoc.numPages);
  let text = '';

  for (let pageNum = currentPage; pageNum <= endPage; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const pageText = await reader.getPageTextSimple(page); 
    text += pageText + '\n\n---\n\n';
  }

  currentPage = endPage + 1;
  return text;
}

// btn.addEventListener('click', async () => {
//   const lang = buttons.getActive();
//   if (!lang) return alert('Choose language');

//   const { on } = await window.api.toggleTranslate();
//   await buttons.refreshBtn();

//   if (!on) {
//     input.style.visibility = 'visible';
//     allLangs.style.visibility = 'visible';
//     // next.style.display = 'none';
//     if (lastFile) return reader.openAndRenderPdf({ file: lastFile });
//     return;
//   }

//   input.style.visibility = 'hidden';
//   allLangs.style.visibility = 'hidden';
//   // next.style.display = 'block';

//   try {
//     const translated = await ensureTranslation(lang);
//     translator.renderTranslatedText(translated);
//   } catch (e) {
//     console.error(e);
//     alert('Choose a file first');
//   }
// });

nextButton.addEventListener('click', async () => {
  const lang = buttons.getActive();
  if (!lang) return alert('Choose language');
  if (!pdfDoc) return alert('Choose a file first');

  try {
    const translated = await translateNextBatch(lang);

    if (!translated) {
      alert('No more pages');
      return;
    }

    translator.appendTranslatedText(translated); 
    
  } catch (e) {
    console.error(e);
    alert('Translation failed');
  }
});

ru.addEventListener('click', async () => {
  const active = buttons.checkActive();

  if (active) {
    input.style.visibility = 'visible';
    next.style.visibility = 'visible';
  } else {
    input.style.visibility = 'hidden';
    next.style.visibility = 'hidden';
  }
});

en.addEventListener('click', async () => {
  const active = buttons.checkActive();

  if (active) {
    input.style.visibility = 'visible';
    next.style.visibility = 'visible';
  } else {
    input.style.visibility = 'hidden';
    next.style.visibility = 'hidden';
  }
});

cz.addEventListener('click', async () => {
  const active = buttons.checkActive();

  if (active) {
    input.style.visibility = 'visible';
    next.style.visibility = 'visible';
  } else {
    input.style.visibility = 'hidden';
    next.style.visibility = 'hidden';
  }
})