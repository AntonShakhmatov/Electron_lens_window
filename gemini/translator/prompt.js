class Prompt {
  buildPrompt(text) {
    return `Переведи текст ниже на русский.

        Требования к оформлению:
        - Сохраняй исходную структуру документа: заголовки, нумерацию, пункты, подпункты, списки.
        - Разбивай текст на логические абзацы (пустая строка между абзацами).
        - Не склеивай всё в одну строку.
        - Не добавляй комментариев/пояснений — верни только перевод.
        - Числа, даты, ссылки, номера статей/параграфов и сокращения оставляй как в оригинале.
        - Имена собственные не меняй (только транслитерация если это явно нужно).

        Текст для перевода:
        ${text}`;
    }

    buildEnPrompt(text) {
        return `Translate the text below into English.

            Formatting requirements:
            - Preserve the original document structure: headings, numbering, items, sub-items, lists.
            - Split the text into logical paragraphs (leave a blank line between paragraphs).
            - Do not merge everything into a single line.
            - Do not add comments or explanations — return only the translation.
            - Keep numbers, dates, links, article/paragraph numbers, and abbreviations exactly as in the original.
            - Do not change proper names (only transliterate if it is clearly necessary).

            Text to translate:
            ${text}`;
    }

    buildCzPrompt(text) {
    return `Přeložte níže uvedený text do češtiny.

        Požadavky na formátování:
        - Zachovejte původní strukturu dokumentu: nadpisy, číslování, body, podbody, seznamy.
        - Rozdělte text do logických odstavců (prázdný řádek mezi odstavci).
        - Neslučujte celý text do jednoho řádku.
        - Nepřidávejte žádné komentáře ani vysvětlení — vraťte pouze překlad.
        - Čísla, data, odkazy, čísla článků/paragrafů a zkratky ponechte beze změny.
        - Vlastní jména neměňte (pouze transliterace, pokud je to zjevně nutné).

        Text k překladu:
        ${text}`;
    }
}
module.exports = Prompt;