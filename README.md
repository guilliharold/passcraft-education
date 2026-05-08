# 🔐 PassCraft for Education - Passwords Made Simple

A student-friendly password and passphrase generator designed for school use, hosted via GitHub Pages.

---

## File Structure

```
passcraft-education/
├── index.html    ← Page structure and content (HTML)
├── style.css     ← All visual styling and animations (CSS)
├── script.js     ← Password/passphrase logic and interactivity (JavaScript)
└── README.md     ← This file
```

---

## Password Patterns

Every generated password follows the formula: **Word + Word + Number + Symbol**

Four specific patterns are available for students to choose from:

| Pattern | Formula | Example |
|---|---|---|
| 🔤 Word + Word | Adjective + Noun + Number + Symbol | `BraveMountain47!` |
| ✏️ Adjective + Noun | Adjective + Noun + Number + Symbol | `CleverRocket83@` |
| 🐨 Animal + Food | Animal + Food + Number + Symbol | `KoalaPizza29$` |
| 🎨 Colour + Animal | Colour + Animal + Number + Symbol | `BlueDingo47!` |

All words are Title Cased and drawn from large random word banks. Numbers are always 2-digit (10–99) and symbols are chosen from `!@#$%&*?`.

---

## Features

- **🔑 Password Generator** — Four memorable pattern types, all following Word + Word + Number + Symbol
- **💬 Passphrase Generator** — Multi-word phrases with customisable separators and extras
- **📊 Strength Meter** — Real-time 5-bar visual feedback with colour coding
- **📋 History Panel** — Tracks the last 12 generated items with pattern label and one-click copy
- **📚 Learn Tab** — Safety tips, good/bad password examples, and guidance for students
- **🔒 100% Private** — Everything runs in the browser; nothing is stored or transmitted

---

## Hosting on GitHub Pages

1. Create a new GitHub repository — e.g. `passcraft-education`
2. Upload all four files to the **root** of the repository:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. Go to **Settings → Pages**
4. Under **Source**, select the `main` branch and `/ (root)` folder
5. Click **Save**

Your site will be live at:
```
https://yourusername.github.io/passcraft-education/
```

> **Note:** GitHub Pages may take 1–2 minutes to publish after first enabling it.

---

## Colour Palette

| Token           | Hex       | Usage                        |
|-----------------|-----------|------------------------------|
| `--green-dark`  | `#2d6a4f` | Primary buttons, headings    |
| `--green-mid`   | `#40916c` | Hover states, copy button    |
| `--green-light` | `#74c69d` | Logo icon background         |
| `--green-pale`  | `#b7e4c7` | Tip box borders              |
| `--cream`       | `#fdf8f0` | Page background              |
| `--cream-dark`  | `#f0e8d6` | Tab bar, card inputs         |
| `--amber-dark`  | `#b67d1e` | Heading emphasis (`<em>`)    |

---

## Technology

- Pure **HTML5**, **CSS3**, and **vanilla JavaScript** — no frameworks or build tools required
- Uses the **Web Crypto API** (`crypto.getRandomValues`) for cryptographically secure randomness
- **Google Fonts:** Nunito + Baloo 2
- Fully responsive — works on desktop, tablet, and mobile

---

## Security Notes

- Ambiguous characters excluded from all sets (`0`/`O`, `1`/`l`/`I`)
- All four password patterns consistently produce 12–18 character passwords
- Passphrases support 3–6 words with optional number and symbol suffix
- No data leaves the browser at any point

---

Made with 💚 for students everywhere.
