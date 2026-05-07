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

## Features

- **🔑 Password Generator** — Customisable length (8–24 chars), toggle uppercase, lowercase, numbers & symbols
- **💬 Passphrase Generator** — Memorable word combos like `BlueDingo2022!` with separator styles
- **📊 Strength Meter** — Real-time 5-bar visual feedback with colour coding
- **📋 History Panel** — Tracks the last 12 generated items with one-click copy
- **📚 Learn Tab** — Tips on what NOT to use, great examples, and safety advice for students
- **🔒 100% Private** — Everything runs in the browser; nothing is stored or transmitted

---

## Hosting on GitHub Pages

1. Create a new GitHub repository — e.g. `passcraft-education`
2. Upload all four files (`index.html`, `style.css`, `script.js`, `README.md`) to the repository root
3. Go to **Settings → Pages**
4. Under **Source**, select the `main` branch and `/ (root)` folder
5. Click **Save**

Your site will be live at:
```
https://yourusername.github.io/passcraft-education/
```

> **Note:** GitHub Pages may take 1–2 minutes to go live after first enabling it.

---

## Colour Palette

| Token           | Hex       | Usage                        |
|-----------------|-----------|------------------------------|
| `--green-dark`  | `#2d6a4f` | Primary buttons, headings    |
| `--green-mid`   | `#40916c` | Hover states, accents        |
| `--green-light` | `#74c69d` | Logo icon background         |
| `--green-pale`  | `#b7e4c7` | Tip box borders, tag fills   |
| `--cream`       | `#fdf8f0` | Page background              |
| `--cream-dark`  | `#f0e8d6` | Tab bar, input backgrounds   |
| `--amber-dark`  | `#b67d1e` | Heading emphasis             |

---

## Technology

- Pure **HTML5**, **CSS3**, and **vanilla JavaScript** — no frameworks or build tools required
- Uses the **Web Crypto API** (`crypto.getRandomValues`) for cryptographically secure randomness
- **Google Fonts:** Nunito + Baloo 2
- Fully responsive — works on desktop, tablet, and mobile

---

## Security Notes

- Blocked list of common/guessable passwords (`password`, `123456`, `monkey`, `qwerty`, etc.)
- Encourages passwords of **12+ characters**
- Passphrases follow a colour + animal/noun + number + symbol pattern for memorability
- All character sets exclude visually ambiguous characters (e.g. `0`/`O`, `1`/`l`)
- No data ever leaves the browser

---

Made with 💚 for students everywhere.
