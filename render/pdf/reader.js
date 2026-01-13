
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
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let full = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = textContent.items
        .filter(i => i.str && i.str.trim().length > 0)
        .map(i => {
          const y = i.transform?.[5] ?? 0;
          const x = i.transform?.[4] ?? 0;
          const fontSize = Math.abs(i.transform?.[3] ?? 0) || 10;
          return { str: i.str, x, y, fontSize };
        });

      items.sort((a, b) => (b.y - a.y) || (a.x - b.x));

      let pageText = '';
      let lastY = null;

      for (const it of items) {
        if (lastY === null) {
          pageText += it.str;
          lastY = it.y;
          continue;
        }

        const dy = Math.abs(it.y - lastY);

        if (dy >= it.fontSize * 1.6) {
          pageText += '\n\n' + it.str;
        } else if (dy >= it.fontSize * 0.6) {
          pageText += '\n' + it.str;
        } else {
          const needSpace =
            pageText.length > 0 &&
            !pageText.endsWith(' ') &&
            !it.str.startsWith(' ') &&
            !/[\-–—]$/.test(pageText);
          pageText += (needSpace ? ' ' : '') + it.str;
        }

        lastY = it.y;
      }

      full.push(pageText.trim());
    }

    return full.join('\n\n---\n\n');
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