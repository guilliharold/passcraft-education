<div align="center">

<img src="assets/images/passcraft-edu-logo.png" alt="PassCraft Education logo" width="220" />

# PassCraft Education

**Strong, memorable passwords and passphrases — built for students and schools.**

![HTML5](https://img.shields.io/badge/HTML5-1F3A5F?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-2F5D8C?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-6B9AC4?style=flat-square&logo=javascript&logoColor=white)
![No backend](https://img.shields.io/badge/backend-none-E8A33D?style=flat-square)
![Privacy](https://img.shields.io/badge/data%20stored-none-1F3A5F?style=flat-square)

[Overview](#overview) ·
[Features](#features) ·
[Getting Started](#getting-started) ·
[Usage](#usage) ·
[Privacy & Security](#privacy--security) ·
[Deployment](#deployment) ·
[Project Structure](#project-structure) ·
[Changelog](#changelog)

</div>

---

## Overview

Weak and reused passwords are among the most common security risks in school environments. Students often fall back on easily guessed credentials such as a name, a birthday or `password123`, which leaves their accounts exposed.

**PassCraft Education** makes strong password creation simple, visual and engaging. It generates credentials from memorable word combinations, shows how strong each one is, and reinforces good habits through a built-in Learn tab.

It is designed for use in the classroom during account setup, password reset sessions, or as part of a digital literacy lesson. It is also useful to anyone who wants a strong but memorable password or phrase.

---

## Features

| Feature | Description |
| --- | --- |
| 🔑 **Password Generator** | Two patterns — *Adjective + Noun* and *Colour + Animal* — each producing a `Word + Word + Number + Symbol` password, e.g. `CleverRocket83@` or `BlueDingo47!`. Selecting a pattern generates a password immediately. |
| 💬 **Passphrase Generator** | Chains 3–6 random words with a choice of separator (`CapitalWords`, `word-dash`, `word.dot`) and optional number and symbol suffixes. |
| 📊 **Strength Meter** | Live five-level visual feedback after every generation. |
| 📋 **History** | Keeps the last 12 generated credentials for the current session, with **Copy** and **Print** buttons on every item. |
| 🖨️ **Print Password Slip** | Prints a formatted slip containing the password, a "do not share" reminder and today's date. Available from the Password, Passphrase and History tabs. |
| 📚 **Learn Tab** | Age-appropriate password safety advice: commonly guessed passwords, reuse risks, keeping passwords secret, length and memorability. |
| 🔒 **Secure Randomness** | All random selection uses the Web Crypto API (`crypto.getRandomValues`), never `Math.random()`. |
| 📱 **Installable** | PWA manifest and a full favicon set for use on phones, tablets and Chromebooks. |

---

## Getting Started

PassCraft Education is a static site with **no build step, dependencies or backend**.

**Run locally**

```bash
git clone <your-repository-url>
cd passcraft-education

# Option 1: open index.html directly in a browser
# Option 2: serve it locally
python3 -m http.server 8000
# then visit http://localhost:8000
```

**Requirements:** any modern browser (Chrome, Edge, Firefox, Safari), including Chromebooks, iPads and shared lab computers.

---

## Usage

### Students

1. Open PassCraft Education in your browser.
2. On the **Password** tab, choose a pattern. A password is generated straight away.
3. Select **Generate Password** to shuffle a new one at any time.
4. Use the **Copy** button, then paste it into your school account's password field.
5. Prefer something longer? Switch to the **Passphrase** tab.
6. Visit the **Learn** tab to find out what makes a password strong and how to keep it safe.

### Staff

1. Open PassCraft Education on a classroom device or shared screen.
2. Walk students through choosing a pattern and generating a password during account setup or a reset session.
3. Use **Print Password Slip** to give each student a physical copy. The slip reminds them not to share it.
4. Use the **Learn** tab as a discussion prompt in digital literacy lessons.

---

## Benefits for Schools

**Students**
- Removes the guesswork from creating a strong password.
- Produces vivid, pattern-based passwords (e.g. `BlueDingo47!`) that are easier to remember than random strings.
- Builds awareness of password strength through the meter and Learn tab.

**IT Staff**
- Reduces the number of weak or reused passwords that need resetting.
- Print slips streamline bulk password resets and replace sticky notes.
- Deploy once and share a link; no installation, accounts or backend.

**Teachers**
- A ready-made resource for digital literacy and cybersecurity lessons.
- Covers password length, reuse risks and never sharing credentials.

---

## Privacy & Security

- **Nothing is stored.** No passwords, passphrases or session data are saved to a server, database or local storage.
- **Nothing is transmitted.** Generation happens entirely in the browser.
- **Secure randomness.** The Web Crypto API is used for all random selection.
- **No accounts.** No sign-in and no personal information required.
- **Session-only history.** The History tab clears when the browser tab is closed.
- **External resources.** The only network request is for Google Fonts (Nunito and Baloo 2). If fonts cannot load, the browser falls back to a default font and everything still works.

---

## Deployment

The site can be hosted on any static host.

**GitHub Pages**

1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select your main branch and the `/ (root)` folder.
4. Save, and share the published link.

Netlify, Cloudflare Pages and school web servers also work; just upload the files as they are.

---

## Project Structure

```
passcraft-education/
├── index.html                 # Application markup and structure
├── style.css                  # Styles and design tokens (Navy & Slate palette)
├── script.js                  # Word banks, generators, UI behaviour
├── manifest.json              # PWA manifest
├── README.md                  # Project documentation
├── CHANGELOG.md               # Version history
└── assets/
    └── images/
        ├── passcraft-edu-logo.png
        └── favicons/
            ├── favicon.ico
            ├── favicon-16x16.png
            ├── favicon-32x32.png
            ├── apple-touch-icon.png
            ├── android-chrome-192x192.png
            └── android-chrome-512x512.png
```

---

## Design

| Token | Colour | Hex |
| --- | --- | --- |
| Primary | Navy | `#1F3A5F` |
| Secondary | Blue | `#2F5D8C` |
| Light accent | Sky | `#6B9AC4` |
| Pale tint | Mist | `#CFE0F1` |
| Highlight | Amber | `#E8A33D` |

Typography uses **Nunito** for body text and **Baloo 2** for headings and generated output.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

<div align="center">

**PassCraft Education** — Helping students stay safe online 🌿

</div>
