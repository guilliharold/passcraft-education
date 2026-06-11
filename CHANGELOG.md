# 🛠️ Changelog — PassCraft Education

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
