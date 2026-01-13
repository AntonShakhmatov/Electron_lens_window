
import Buttons from './buttons.js';

const buttons = new Buttons();

export default class Reader {
  async getContent(buffer) {
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
    const pages = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      pages.push(textContent)
    }

    return pages
  }

  async getItems(buffer) {
    const pages = await this.getContent(buffer)
    const items = []

    pages.forEach(page => {
      page.items.forEach(item => {
        items.push(item.str)
      })
    })

    return items
  }

  //pdf in buffer
  async renderPdfFromArrayBuffer(buf) {
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

  async openAndRenderPdf({ file = null, enableLens = false } = {}) {
    // ON/OFF the LENS
    if (enableLens) {
      const { on } = await window.api.isTranslateOn()
      if (!on) await window.api.toggleTranslate()
      await buttons.refreshBtn()
    }

    // File from input
    const pickedFile = file ?? filePick.files?.[0]
    if (!pickedFile) {
      console.warn('PDF file not selected')
      return
    }

    // Read and render
    const buf = await pickedFile.arrayBuffer()
    await this.renderPdfFromArrayBuffer(buf)
  }
}