# 🛠️ Changelog — PassCraft Education

---

## v26.6.18 — 18 June 2026

### 🖨️ History Tab Printing
- ✅ Added a **Print** button to each item in the History tab, allowing any past password or passphrase to be printed as a slip directly from the list
- ✅ Refactored `printPassword()` in `script.js`, splitting out a reusable `printRaw()` function that powers printing from both the Password/Passphrase tabs and the History tab
- ✅ Switched History tab rendering from inline `onclick` handlers to `data-action` attributes with event delegation, improving safety and making it easy to add further per-item actions in future
- ✅ Added `.history-print` button styling in `style.css`, matching the existing `.history-copy` button look

---

## v26.6.11 — 11 June 2026

### 🐛 Bug Fixes
- ✅ Removed duplicate **Word + Word** pattern (was identical to Adjective + Noun)
- ✅ Removed **Animal + Food** pattern, leaving two clean, distinct patterns
- ✅ Fixed passphrase tip box examples — now correctly shows passphrase-style output (e.g. `clever-mountain-falcon47!`) instead of password-style examples

### ✨ Improvements
- ✅ Selecting a pattern card now **immediately generates** a password using that pattern — no need to click Generate first
- ✅ A passphrase is now **auto-generated on page load**, so the Passphrase tab always arrives with something in the box (consistent with the Password tab behaviour)
- ✅ Removed `FOODS` from the passphrase word pool since the Animal + Food pattern is no longer present
- ✅ Pattern grid now stays **two columns at all screen sizes** — no longer collapses to one column on mobile

### 🖼️ Logo & Header
- ✅ Replaced the makeshift logo badge (🔐 PassCraft Education pill) with the official **PassCraft Education logo** from `assets/images/passcraft-edu-logo.png`
- ✅ Removed the `h1` heading — the logo now serves as the primary visual identity in the header
- ✅ Updated favicon paths across `index.html` to reflect new location at `assets/images/favicon/`
- ✅ Updated file structure in `README.md` to match new favicon directory
- ✅ Tuned header and subtitle spacing for a clean, compact layout — removed excess gap between logo and subtitle
- ✅ Removed now-unused `.logo-badge`, `.logo-icon`, and `.logo-text` CSS rules from `style.css`

---

## v26.6.2 — 2 June 2026

### 🖨️ Print Password Slip
- ✅ Added a **Print Password Slip** button to the Password and Passphrase tabs
- ✅ Prints a formatted slip with the generated password, a reminder not to share it, and today's date
- ✅ Added supporting print styles to `style.css` and `printPassword()` function to `script.js`

### 📄 README
- ✅ Added `README.md` covering overview, usage guide, privacy details, deployment options, and file structure

### 🌐 Favicons
- ✅ Added full favicon set to `index.html` pointing to files in `assets/`
