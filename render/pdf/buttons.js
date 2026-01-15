const btn = document.getElementById('toggleLens')
const ru = document.getElementById('ru')
const en = document.getElementById('en')
const cz = document.getElementById('cz')

export default class Buttons {
    constructor() {
        this.activeLang = null;
    }

    async refreshBtn() {
        const { on } = await window.api.isTranslateOn();
        btn.textContent = on ? 'Translator: ON' : 'Translator: OFF';
        return on;
    }

    showAll() {
        ru.style.display = '';
        en.style.display = '';
        cz.style.display = '';
    }

    checkActive() {
        return document.querySelector('div#language > button.active') !== null;
    }

    getActive() {
        const btn = document.querySelector('div#language > button.active');
        return btn ? btn.id : null; // 'ru' | 'en' | 'cz' | null
    }

    hideExcept(lang) {
        if (lang !== 'ru') ru.style.display = 'none';
        if (lang !== 'en') en.style.display = 'none';
        if (lang !== 'cz') cz.style.display = 'none';
    }

    onRuClick() {
        if (this.activeLang === 'ru') {
            ru.classList.remove('active');
            this.activeLang = null;
            this.showAll();
        } else {
            ru.classList.add('active');
            this.activeLang = 'ru';
            this.hideExcept('ru');
        }
    }

    onEnClick() {
        if (this.activeLang === 'en') {
            en.classList.remove('active');
            this.activeLang = null;
            this.showAll();
        } else {
            en.classList.add('active');
            this.activeLang = 'en';
            this.hideExcept('en');
        }
    }

    onCzClick() {
        if (this.activeLang === 'cz') {
            cz.classList.remove('active');
            this.activeLang = null;
            this.showAll();
        } else {
            cz.classList.add('active');
            this.activeLang = 'cz';
            this.hideExcept('cz');
        }
    }

    init() {
        ru.onclick = this.onRuClick.bind(this);
        en.onclick = this.onEnClick.bind(this);
        cz.onclick = this.onCzClick.bind(this);
    }
}