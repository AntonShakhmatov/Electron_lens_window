console.log('pdfjsLib exists?', typeof pdfjsLib !== 'undefined')
console.log('workerSrc:', pdfjsLib?.GlobalWorkerOptions?.workerSrc)
import Reader from './reader.js'

const reader = new Reader();

const btn = document.getElementById('toggleLens')
const filePick = document.getElementById('filePick')
const read = document.getElementById('read')
const viewer = document.getElementById('viewer')

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL('../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs', window.location.href).toString()


async function refreshBtn() {
  const { on } = await window.api.isLensOn()
  btn.textContent = on ? 'Translator: ON' : 'Translator: OFF'
}

async function renderPdfFromArrayBuffer(buf) {
  viewer.innerHTML = ''

  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  const scale = 1.5

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    canvas.style.margin = '0 auto 16px'
    canvas.style.display = 'block'

    viewer.appendChild(canvas)

    await page.render({ canvasContext: ctx, viewport }).promise
  }
}

async function openAndRenderPdf({ file = null, enableLens = false } = {}) {
  // ON/OFF the LENS
  if (enableLens) {
    const { on } = await window.api.isLensOn()
    if (!on) await window.api.toggleLens()
    await refreshBtn()
  }

  // File from input
  const pickedFile = file ?? filePick.files?.[0]
  if (!pickedFile) {
    console.warn('PDF file not selected')
    return
  }

  // Read and render
  const buf = await pickedFile.arrayBuffer()
  await renderPdfFromArrayBuffer(buf)
}

// --- 1) Lens toggle
btn.addEventListener('click', async () => {
  await window.api.toggleLens()
  await refreshBtn()
})

// Choose the file --- open and render
filePick.addEventListener('change', async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  const buf = await file.arrayBuffer()

  await openAndRenderPdf({ file })
  const items = await reader.getItems(buf)

  console.log('PDF TEXT:', items.join(' '))
})

// Read button
read.addEventListener('click', async () => {
  await openAndRenderPdf({ enableLens: true })
})

// init
refreshBtn()
