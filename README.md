<div align="center">

<img src="assets/images/logos/passcraft.png" alt="PassCraft Education" width="200" />

# PassCraft Education

### Better password habits, one memorable password at a time.

A free, open-source toolkit that helps school ICT staff create, test and manage strong passwords, and helps students and teachers understand them. Everything runs in the browser, with no accounts, cookies or tracking.

**[Open the live site](https://guilliharold.github.io/passcraft-education/)**

`v26.12.0` · `HTML + CSS + JavaScript` · `No frameworks` · `MIT licensed`

</div>

---

## Contents

1. [Why PassCraft exists](#why-passcraft-exists)
2. [The five tools](#the-five-tools)
3. [Privacy by design](#privacy-by-design)
4. [How the maths works](#how-the-maths-works)
5. [Accessibility](#accessibility)
6. [Customise it](#customise-it)
7. [Project layout](#project-layout)
8. [Built in collaboration with Claude AI](#built-in-collaboration-with-claude-ai)
9. [Limits and disclaimer](#limits-and-disclaimer)
10. [Licence](#licence)

---

## Why PassCraft exists

Most school account breaches don't involve clever hacking. They involve a guessable password, or one that was reused somewhere that later leaked.

Students tend to reach for names, birthdates or something like `password123`. PassCraft makes the better option the easy one: passwords that are memorable and still follow good habits, plus honest feedback on why a password is strong or weak.

**Made for**

- **ICT support technicians and staff** creating, resetting and checking school accounts, one at a time or in bulk.
- **Teachers** running digital literacy lessons with the Learn page.
- **Students** learning why some passwords are stronger than others, and setting up or resetting a school account.
- **Anyone** who wants a memorable password or passphrase and a quick lesson in using it well.

---

## The five tools

| | Tool | What you get |
|---|------|--------------|
| 🔐 | **Generator** | Passwords from an **Adjective + Noun** or **Colour + Animal** pattern, each ending in a number and a symbol (for example `CleverRocket83@` or `BlueDingo47!`). Or passphrases of 3 to 6 words with a CapitalWords, dash or dot separator and an optional number and symbol. Includes one-click copy, a session-only history and printable password slips. |
| 📋 | **Bulk Passwords** | For ICT staff and technicians. Choose a `.csv` or `.xlsx` account list with a column titled Password and fill it with a different generated password for each person, using a Generator pattern, a 4-word passphrase or 12 random characters. Preview, then download a new file named like `Year 9 accounts with Passwords 2026-11-25.xlsx`. The file is read in the browser and never uploaded. |
| 📊 | **Strength Indicator** | Type an example password and see a checklist, an estimated time to crack and plain-English feedback. It spots common passwords, dictionary words, keyboard runs, sequences, repeats, years and look-alike swaps such as `@` for `a`. |
| 🛡️ | **Breach Check** *(optional)* | Find out whether a password has appeared in a known data breach, using Have I Been Pwned. Nothing happens until you tick a consent box and click Check, and consent is asked for again every time. |
| 📚 | **Learn** | Six habits that matter: make it long, avoid commonly guessed passwords, one password per account, keep it secret, use a password manager and turn on multi-factor authentication. Plus a "reuse domino" demo (see how one leaked password can open other accounts) and a "Which is stronger?" quiz (5 rounds picked at random from 10 pairs of made-up passwords). |

Also included: Privacy Policy, Terms of Use, Disclaimer, a dedicated MIT License page and a Changelog, all linked from every footer.

### Printable password slips

Any generated password or passphrase can be printed on a slip with a blank line for writing the account name by hand, plus reminders to keep it secret and to destroy the slip securely when it is no longer needed.

---

## Privacy by design

| Question | Answer |
|----------|--------|
| Are generated passwords stored or sent? | No. They are created and shown in the browser only. |
| Are bulk files uploaded? | No. The file is read and the new one is created in the browser. The download holds passwords in plain text, so look after it. |
| Are tested passwords stored or sent? | No. The Strength Indicator analyses them locally and clears the field when you leave. |
| Does anything ever leave the browser? | Only the optional Breach Check, and only after you tick the consent box and click Check. |
| What does the Breach Check send? | The first 5 characters of a SHA-1 hash. Never the password, never the full hash. |
| Does PassCraft see the result? | No. The comparison happens on your device. |
| Accounts, ads, analytics or cookies? | None. Nothing is stored on the device. |
| Is the History list saved? | No. It lives in the open tab and clears on close or reload. |

Fonts are hosted on the site itself, so no request goes to Google. The web host (and Have I Been Pwned, if you use the Breach Check) can see technical details such as an IP address, as with any website. Students under 18 are asked to check with a parent, guardian or teacher before using the Breach Check.

Full details are in the [Privacy Policy](privacy.html). Privacy questions and requests can go to [support@passcraft-edu.com](mailto:support@passcraft-edu.com).

---

## How the maths works

### Random selection

- Randomness comes from `crypto.getRandomValues`, the browser's cryptographic generator.
- Choices use rejection sampling, so every word, digit and symbol is equally likely, with no modulo bias.
- Numbers run from 10 to 99. Symbols come from `! @ # $ % & * ?`.
- Word banks are grouped into adjectives, nouns, animals and colours, with Australian touches such as dingo, quokka and bilby. Passphrases draw from all four banks combined, with duplicate words removed so every word is equally likely.

### What that is worth

These figures are approximate and assume an attacker knows the exact pattern and word lists.

| Type | Roughly |
|------|---------|
| Adjective + Noun + number + symbol | about 22 to 23 bits |
| Colour + Animal + number + symbol | about 22 to 23 bits |
| Passphrase, 4 words | about 34 bits (plus about 9 more with number and symbol) |

That is the point of the Disclaimer's honesty: word-and-pattern passwords are easier to remember but weaker than long random ones. For important accounts such as email or banking, use a password manager and turn on multi-factor authentication.

### Strength Indicator

The Strength Indicator uses a small estimator in the style of zxcvbn:

1. Scan the password from left to right.
2. Charge a small, fixed number of bits for recognised chunks (common passwords, words, keyboard runs, sequences, repeats, years), because attackers try these first.
3. Charge every other character by the size of its character pool.
4. Turn the total into a 1 to 5 score and a crack-time estimate, assuming 10 billion guesses per second against a stolen password database.

These are teaching estimates, not real-world predictions.

### Breach Check (k-anonymity)

1. The browser hashes the password with SHA-1.
2. Only the first 5 characters of the hash go to the Pwned Passwords range API.
3. The service returns every matching hash ending, padded with decoys so the response size reveals nothing.
4. The browser looks for its own ending in that list, on the device.

If the check can't be completed, the page says so clearly, because no result is not the same as "not found".

---

## Accessibility

- Keyboard-navigable tabs with arrow, Home and End keys
- Visible focus styles throughout
- Screen-reader announcements for generated passwords, strength results and breach results
- Reduced-motion support
- A high-contrast Navy and Slate colour scheme
- A web app manifest, so the site can be installed like an app

---

## Customise it

| To change | Edit |
|-----------|------|
| Word banks, patterns, symbols | `script.js` (`ADJECTIVES`, `NOUNS`, `ANIMALS`, `COLOURS`, `PATTERNS`, `CHARS`). A new pattern also needs a card in `index.html`. |
| Words and passwords the Strength Indicator flags | `strength-indicator.js` (`COMMON_PASSWORDS`, `COMMON_WORDS`) |
| Crack-time speed assumption and Strength Indicator score bands | `shared.js` (`GUESSES_PER_SECOND`, `scoreFromBits`) |
| Bulk Passwords limits and random-character length | `bulk.js` (`MAX_BYTES`, `MAX_ROWS`, `RANDOM_LENGTH`) |
| Quiz pairs and how many rounds are played | `learn.js` (`ROUNDS`, `QUIZ_LENGTH`) |
| Colours, spacing | `style.css` (design tokens under `:root`) |
| Fonts | `style.css` (`@font-face` rules) and `assets/fonts/` |

If you adapt PassCraft for your own school, please also review the legal pages and contact details so they describe your own setup.

---

## Project layout

```
index.html                Generator (Password / Passphrase / History)
bulk.html                 Bulk Passwords
strength-indicator.html   Strength Indicator
breach-check.html         Breach Check (optional)
learn.html                Learn
privacy.html              Privacy Policy
terms.html                Terms of Use
disclaimer.html           Disclaimer
license.html              MIT License page
changelog.html            Changelog
style.css                 Shared styles
shared.js                 Helpers shared by several pages (random numbers, strength scale, crack time)
script.js                 Generator logic
strength-indicator.js     Strength analysis
breach-check.js           Breach check logic
bulk.js                   Bulk Passwords logic (CSV and XLSX)
learn.js                  Learn page quiz and reuse demo
site.js                   Shared footer script (copyright year)
manifest.json             Web app manifest
LICENSE.txt               MIT License
assets/fonts/              Self-hosted Nunito and Baloo 2 (woff2) and their licences
assets/vendor/            Bundled spreadsheet libraries for Bulk Passwords, one folder each with its own LICENSE.txt
                          (read-excel-file/, write-excel-file/)
assets/images/favicons/   Favicons and app icons
assets/images/logos/      Logo (passcraft.png)
```

Plain HTML, CSS and JavaScript. No frameworks. The only bundled libraries are two small spreadsheet readers and writers used by Bulk Passwords.

---

## Built in collaboration with Claude AI

PassCraft Education is designed and maintained by [Harold Guilline](https://github.com/guilliharold) and **built in collaboration with Claude, an AI assistant made by [Anthropic](https://www.anthropic.com/)**.

Claude helped with drafting and refining code, copy, documentation and the legal pages. Harold sets the direction, makes the decisions, reviews the output and is responsible for what is published.

AI-assisted work can contain mistakes. If you spot an error, an unclear explanation or a security concern, please [open an issue](https://github.com/guilliharold/passcraft-education/issues) or email [support@passcraft-edu.com](mailto:support@passcraft-edu.com).

---

## Limits and disclaimer

PassCraft is an **educational tool, not a security product**. No password is ever guaranteed to be safe. Strength results and crack-time figures are rough estimates, and a "Not found" result from the Breach Check does not mean a password is safe. Please don't enter your real passwords into the Strength Indicator, and test an example in a similar style instead. The optional Breach Check is the one exception, because it only works on a real password. It sends only part of a scrambled hash, and only after you consent (see [Breach Check](#breach-check-k-anonymity)).

See the full [Disclaimer](disclaimer.html), [Terms of Use](terms.html) and [Privacy Policy](privacy.html).

---

## Licence

The source code is released under the [MIT License](LICENSE.txt). It covers the code only, not third-party fonts, libraries or assets, or the PassCraft name and logo. The bundled Nunito and Baloo 2 fonts are licensed separately under the [SIL Open Font License](https://openfontlicense.org); keep the `OFL.txt` in each font folder. The spreadsheet libraries in `assets/vendor/` keep their own licences; keep the `LICENSE.txt` in each library folder.

Copyright &copy; 2026 [Harold Guilline](https://github.com/guilliharold)

<div align="center">

**PassCraft Education** · Helping schools stay safe online 🌿

</div>
