# 🔐 PassCraft Education

**A safe, student-friendly password and passphrase generator built for schools.**

PassCraft Education helps students at secondary colleges and other educational institutions create strong, memorable passwords for their school accounts — entirely within the browser, with nothing stored or transmitted.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How to Use](#how-to-use)
- [Benefits for Schools](#benefits-for-schools)
- [Privacy & Security](#privacy--security)
- [File Structure](#file-structure)
- [Deployment](#deployment)
- [Changelog](#changelog)

---

## Overview

Weak and reused passwords are one of the most common security risks in school environments. Students often default to easily guessed credentials like their name, birthday, or `password123` — leaving their accounts vulnerable.

PassCraft Education addresses this by making strong password creation simple, visual, and engaging. It guides students through generating a password or passphrase using memorable word combinations, then reinforces good habits through the built-in Tips tab.

The tool is designed to be used directly in the classroom during account setup, password reset sessions, or as part of a digital literacy lesson.

---

## Features

- 🔑 **Password Generator** — two distinct patterns (Adjective + Noun, Colour + Animal), each producing a Word + Word + Number + Symbol combination that is both strong and easy to remember
- 💬 **Passphrase Generator** — chains multiple random words with a choice of separator styles, with optional number and symbol suffixes
- 📊 **Strength Meter** — live visual feedback on password strength after every generation
- 📋 **History Tab** — keeps the last 12 generated passwords and passphrases within the session for easy reference
- 🖨️ **Print Password Slip** — prints a formatted slip with the password, a privacy reminder, and today's date — ready to hand to a student
- 📚 **Tips Tab** — age-appropriate password safety advice covering common mistakes, reuse risks, and what makes a password strong
- 🔒 **Cryptographically secure** — uses the Web Crypto API (`crypto.getRandomValues`) for all random generation

---

## How to Use

### For Students

1. Open PassCraft Education in any modern browser
2. On the **Password** tab, select a pattern card — a password is generated immediately
3. Click **Generate Password** to shuffle a new one at any time
4. Use the **Copy** button to copy it to your clipboard, then paste it into the password field of your school account
5. Switch to the **Passphrase** tab if you prefer a longer, word-based credential
6. Visit the **Tips** tab to learn what makes a password strong and how to keep it safe

### For Staff

1. Open PassCraft Education on a classroom device or shared screen
2. Walk students through selecting a pattern and generating a password during account setup or a password reset session
3. Use the **Print Password Slip** button to print a physical copy for each student to take home — the slip includes a reminder not to share their password
4. Use the **Tips** tab as a discussion prompt during digital literacy lessons

---

## Benefits for Schools

### For Students
- Removes the guesswork from creating a strong password — the tool does the hard part
- Produces passwords that follow a visual pattern (e.g. `BlueDingo47!`) that are genuinely easier to remember than random strings
- Builds awareness of what makes a password strong through the strength meter and Tips tab
- Safe to use on any school device — nothing leaves the browser

### For IT Staff
- Reduces the volume of weak or reused passwords that need to be reset
- The Print Password Slip feature streamlines bulk password resets — no more writing passwords on sticky notes
- No installation, no accounts, no backend — deploy once to GitHub Pages and share the link
- Works on any device with a modern browser, including Chromebooks, iPads, and shared lab computers

### For Teachers
- Ready-made resource for digital literacy and cybersecurity lessons
- The Tips tab covers curriculum-aligned concepts: password length, reuse risks, and social engineering (never share your password)
- Engaging enough to hold student attention without being a distraction

---

## Privacy & Security

- **Nothing is stored.** No passwords, passphrases, or session data are saved to a database, server, or local storage
- **Nothing is transmitted.** All generation happens locally in the browser — the tool works with no internet connection once loaded
- **Cryptographically secure randomness.** The Web Crypto API (`crypto.getRandomValues`) is used for all random number generation — not `Math.random()`
- **No accounts required.** Students and staff can use the tool without signing in or providing any personal information
- **History is session-only.** The History tab clears automatically when the browser tab is closed

---

## File Structure

```
passcraft-education/
├── index.html              # Main application — markup and structure
├── style.css               # All styles and design tokens
├── script.js               # Password logic, word banks, UI behaviour
├── manifest.json           # PWA manifest for installability
├── README.md               # This file
├── CHANGELOG.md            # Version history
└── assets/
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    └── android-chrome-512x512.png
```

---

## Deployment

PassCraft Education is a static site — no build step or server required.

### GitHub Pages (recommended)

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set the source to the `main` branch, root folder
4. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`

### Local Use

Open `index.html` directly in any modern browser. No web server needed.

### Intranet / School Network

Copy the project files to any web server or intranet host and serve `index.html` as the entry point. No server-side configuration is required.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

*PassCraft Education — Helping students stay safe online 🌿*
