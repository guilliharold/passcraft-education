# 🔐 PassCraft Education

> A safe, browser-based password and passphrase generator built for students — and the IT teams who support them.

---

## Table of Contents

- [Overview](#overview)
- [Who Is This For?](#who-is-this-for)
- [Features](#features)
- [How to Use PassCraft](#how-to-use-passcraft)
  - [Password Tab](#-password-tab)
  - [Passphrase Tab](#-passphrase-tab)
  - [History Tab](#-history-tab)
  - [Learn Tab](#-learn-tab)
  - [Printing a Password Slip](#printing-a-password-slip)
- [Benefits for IT Support Technicians](#benefits-for-it-support-technicians)
- [Benefits for Administrators](#benefits-for-administrators)
- [Privacy & Security](#privacy--security)
- [Deployment](#deployment)
- [File Structure](#file-structure)

---

## Overview

PassCraft Education is a lightweight, self-contained web tool that helps students create strong, memorable passwords and passphrases for their school accounts. It runs entirely in the browser — no server, no database, no internet connection required after the initial page load.

The tool is designed with two audiences in mind: **students** who need an easy, guided experience, and **IT staff** who need a reliable, privacy-safe workflow for managing password changes across a school.

---

## Who Is This For?

| Role | How PassCraft Helps |
|---|---|
| **IT Support Technician** | Quickly generate and print password slips during account resets or new enrolments |
| **School Administrator** | Deploy a compliant, privacy-safe tool without the overhead of third-party services |
| **Teacher** | Use the Learn tab as a classroom resource for digital literacy lessons |
| **Student** | Create strong passwords independently using guided, memorable patterns |

---

## Features

- **Four password patterns** — Word+Word, Adjective+Noun, Animal+Food, Colour+Animal
- **Passphrase generator** — configurable word count, separator style, and optional number/symbol
- **Strength meter** — live visual feedback on password strength
- **Generation history** — last 12 generated passwords kept in session, with one-click copy
- **Print password slip** — prints a formatted "Your password has been changed to..." notice
- **Safety education** — built-in Learn tab with tips, bad password examples, and good examples
- **Fully offline-capable** — no data is sent anywhere; works on isolated school networks
- **Cryptographically secure** — uses the browser's `crypto.getRandomValues()` API, not `Math.random()`

---

## How to Use PassCraft

PassCraft is a single HTML page. Open `index.html` in any modern browser to get started.

### 🔑 Password Tab

1. Select one of the four **password pattern cards**:
   - **Word + Word** — e.g. `BraveMountain47!`
   - **Adjective + Noun** — e.g. `CleverRocket83@`
   - **Animal + Food** — e.g. `KoalaPizza29$`
   - **Colour + Animal** — e.g. `BlueDingo47!`
2. Click **Generate Password** — a new password is built from large word banks using cryptographic randomness.
3. The **formula hint** beneath the output shows the building blocks used (e.g. Colour + Animal + Number + Symbol).
4. The **strength meter** rates the result from Very Weak to Very Strong.
5. Click the 📋 **copy button** to copy to clipboard.

> A password is auto-generated on page load using the first pattern, so there's always something ready to go.

---

### 💬 Passphrase Tab

1. Use the **Number of Words** slider to choose between 3–6 words.
2. Select a **Separator Style**:
   - `CapitalWords` — e.g. `CoralKoalaStorm83@`
   - `word-dash` — e.g. `coral-koala-storm83@`
   - `word.dot` — e.g. `coral.koala.storm83@`
3. Tick **Append number** and/or **Append symbol** as needed.
4. Click **Generate Passphrase**.
5. Copy using the 📋 button.

---

### 📋 History Tab

- Displays the last **12 generated** passwords and passphrases from the current session.
- Each entry shows the pattern label and the generated value, with a **Copy** button.
- Click **Clear History** to wipe the session list.

> History is session-only — it is cleared when the browser tab is closed or the page is refreshed. Nothing is persisted to storage.

---

### 📚 Learn Tab

A self-contained digital literacy resource covering:

- **Never Use These** — a list of commonly guessed passwords to avoid
- **Great Examples** — one good example from each of the four patterns
- **Don't Reuse Passwords** — why unique passwords matter
- **Keep It Secret** — reminding students that staff will never ask for their password
- **Longer = Stronger** — explaining why PassCraft always generates 12+ character passwords
- **Make It Memorable** — the cognitive benefit of visual/colour-based patterns

This tab can be used as a discussion prompt during classroom ICT sessions or new student onboarding.

---

### Printing a Password Slip

The **Print Password Slip** button appears below the Generate button on both the Password and Passphrase tabs.

1. Generate a password or passphrase.
2. Click **🖨️ Print Password Slip**.
3. The browser print dialog opens with a formatted slip containing:
   - PassCraft Education branding
   - *"Your password has been changed to: [password]"*
   - A reminder not to share the password with anyone
   - Today's date
4. Print and hand the slip directly to the student.

> This workflow replaces handwritten notes or unencrypted emails when communicating a new password to a student.

---

## Benefits for IT Support Technicians

**Faster password resets** — Generate a strong, policy-compliant password in seconds during a helpdesk visit or classroom support call. No need to think one up on the spot or reuse weak defaults.

**Printable hand-off slip** — The print slip gives you a clean, professional way to communicate a new password to a student without writing it on a sticky note or sending it in plain text over email or a messaging platform.

**Consistent password quality** — Every generated password follows the same Word + Word + Number + Symbol formula, guaranteeing a minimum length of 12+ characters with uppercase, lowercase, numeric, and special character coverage — meeting most school system password policies out of the box.

**No account or login required** — PassCraft runs as a plain HTML file. There's nothing to install, no credentials to manage, and no vendor relationship to maintain. Open it and it works.

**Works on restricted networks** — Because PassCraft runs entirely client-side, it functions on air-gapped or tightly filtered school networks where access to external tools is blocked.

**Session history for batch resets** — When resetting passwords for a whole class or year group, the History tab keeps the last 12 generated values in view so you can refer back without re-generating.

---

## Benefits for Administrators

**Privacy-safe by design** — No passwords, usernames, or personal data ever leave the browser. There is no server, no API, no analytics, and no third-party dependencies at runtime. This makes PassCraft straightforward to approve under school privacy policies and relevant data protection legislation (e.g. the Australian Privacy Act, GDPR).

**Zero infrastructure cost** — PassCraft is three static files (`index.html`, `style.css`, `script.js`). It can be hosted on an existing intranet, a shared network drive, a staff portal, or simply opened directly from a USB drive. There are no hosting fees, no SLAs, and no vendor lock-in.

**Supports digital literacy outcomes** — The built-in Learn tab aligns with digital citizenship and online safety curriculum goals. Deploying PassCraft gives teachers a ready-made, interactive resource for password safety education without requiring additional software.

**Auditable and open** — The entire codebase is plain HTML, CSS, and JavaScript with no minification or obfuscation. IT staff and administrators can read, verify, and modify every line. There are no black boxes.

**Customisable for school branding** — The word banks, patterns, colour scheme, and print slip text can all be edited directly in the source files to match school branding or local password policy requirements.

**Reduces support ticket volume** — When students understand how to create strong, memorable passwords themselves (guided by the four patterns), they are less likely to forget them — reducing the frequency of password reset requests to the helpdesk.

---

## Privacy & Security

| Property | Detail |
|---|---|
| **Data storage** | None — no localStorage, no cookies, no server |
| **Network requests** | Google Fonts on load only (can be self-hosted to remove this) |
| **Randomness** | `crypto.getRandomValues()` — cryptographically secure |
| **Session history** | In-memory only; cleared on page close or refresh |
| **Print slip** | Generated and rendered entirely in the browser |

PassCraft is safe to use in environments governed by student data privacy policies. It does not collect, transmit, or persist any information about the passwords generated or the people using the tool.

---

## Deployment

**Option 1 — Open directly**
Download the three files and open `index.html` in any modern browser. No web server needed.

**Option 2 — Host on an intranet**
Copy the three files to any static web server or intranet file share and navigate to `index.html`.

**Option 3 — Staff portal embed**
Host the files and link to `index.html` from your IT helpdesk portal or staff intranet page.

> Google Fonts (`Nunito` and `Baloo 2`) are loaded from `fonts.googleapis.com`. To make PassCraft fully offline, download both font families and update the `<link>` tags in `index.html` to point to local copies.

---

## File Structure

```
passcraft-education/
├── index.html   — Application markup and panel structure
├── style.css    — Design tokens, layout, components, print styles
└── script.js    — Word banks, generators, history, clipboard, print logic
```

All logic is contained within these three files. There are no build tools, no package managers, and no dependencies to install.

---

*PassCraft Education — Helping students stay safe online 🌿*
