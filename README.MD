## 🚀 Getting Started

### 📦 Installation

Install project dependencies:

```bash
npm install
```

---

### ▶️ Run the Application

Before starting the application, you must provide a **Gemini API key** as an environment variable:

```bash
GEMINI_API_KEY=your_api_key_here npm start
```

---

## 🛠 How It Works

### 1️⃣ Set the Translation Language

* Select the **target language** for translation.
* The selected language is required to enable PDF loading and processing.
* The PDF reader itself **does not depend** on the selected language.

---

### 2️⃣ Open a PDF Document

* Open the PDF file you want to read or translate.

---

### 3️⃣ Translate the Document

* Click the **Translate** button.
* The document is translated **in batches of 10 pages**.

---

### Gif instruction step by step

![Application demo](images/instruction.gif)