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
}
