/* ═══════════════════════════════════════════════
   PASSCRAFT EDUCATION — Main Script
   script.js
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   WORD BANKS
───────────────────────────────────────────── */
const ADJECTIVES = [
  'Brave','Clever','Swift','Mighty','Calm','Bright','Gentle','Bold',
  'Fierce','Lucky','Jolly','Proud','Witty','Eager','Loyal','Vivid',
  'Sunny','Crisp','Daring','Noble','Honest','Quirky','Zesty','Lively',
  'Fluffy','Grumpy','Bouncy','Sparky','Fuzzy','Snappy','Peppy','Wobbly'
];

const NOUNS = [
  'Mountain','Rocket','Castle','Comet','Storm','Forest','River','Galaxy',
  'Lantern','Shield','Compass','Anchor','Sunrise','Crystal','Flame','Tower',
  'Bridge','Cloud','Stone','Ember','Breeze','Canyon','Meadow','Crater',
  'Candle','Barrel','Feather','Pebble','Wagon','Kettle','Blanket','Hammer'
];

const ANIMALS = [
  'Dingo','Kangaroo','Koala','Wombat','Platypus','Echidna','Quokka',
  'Wallaby','Possum','Bilby','Kookaburra','Magpie','Numbat','Gecko',
  'Eagle','Parrot','Dolphin','Penguin','Falcon','Otter','Panda','Jaguar',
  'Meerkat','Lemur','Narwhal','Axolotl','Capybara','Flamingo','Hamster'
];

const FOODS = [
  'Pizza','Mango','Waffle','Taco','Sushi','Pasta','Donut','Melon',
  'Brownie','Pretzel','Noodle','Burrito','Muffin','Dumpling','Falafel',
  'Churro','Scone','Ramen','Biscuit','Pancake','Gelato','Kebab','Bagel',
  'Nacho','Pudding','Biscotti','Crumpet','Nougat','Cannoli','Fritter'
];

const COLOURS = [
  'Blue','Red','Green','Purple','Orange','Yellow','Silver','Golden',
  'Pink','Violet','Coral','Amber','Indigo','Teal','Crimson','Jade',
  'Scarlet','Azure','Ivory','Olive','Maroon','Cobalt','Magenta','Bronze',
  'Russet','Cerulean','Vermillion','Chartreuse','Ochre','Lavender'
];

/* ─────────────────────────────────────────────
   PASSWORD PATTERN DEFINITIONS
   Each pattern picks one word from each bank,
   then appends a 2-digit number + special char.
   Structure: Word + Word + Number + Symbol
───────────────────────────────────────────── */
const PATTERNS = [
  {
    id:    'adj-noun',
    label: '✏️ Adjective + Noun',
    desc:  'e.g. CleverRocket83@',
    banks: ['ADJECTIVES', 'NOUNS']
  },
  {
    id:    'colour-animal',
    label: '🎨 Colour + Animal',
    desc:  'e.g. BlueDingo47!',
    banks: ['COLOURS', 'ANIMALS']
  }
];

/* Maps bank name strings → actual arrays */
const BANK_MAP = { ADJECTIVES, NOUNS, ANIMALS, FOODS, COLOURS };

/* Human-readable labels for the formula hint */
const BANK_LABELS = {
  ADJECTIVES: 'Adjective',
  NOUNS:      'Noun',
  ANIMALS:    'Animal',
  FOODS:      'Food',
  COLOURS:    'Colour'
};

/* ─────────────────────────────────────────────
   PASSPHRASE — uses all word types combined
───────────────────────────────────────────── */
const ALL_WORDS = [
  ...ADJECTIVES, ...NOUNS, ...ANIMALS, ...COLOURS
];

/* ─────────────────────────────────────────────
   CHARACTER SETS
   Ambiguous chars (0/O, 1/l/I) excluded
───────────────────────────────────────────── */
const CHARS = {
  num: '23456789',
  sym: '!@#$%&*?'
};

/* ─────────────────────────────────────────────
   STRENGTH METADATA
───────────────────────────────────────────── */
const STRENGTH_COLOURS = ['', '#c0392b', '#e67e22', '#f1c40f', '#27ae60', '#1e8449'];
const STRENGTH_LABELS  = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

/* ─────────────────────────────────────────────
   SESSION HISTORY
───────────────────────────────────────────── */
let history = [];

/* ─────────────────────────────────────────────
   CRYPTO UTILITIES
───────────────────────────────────────────── */

/** Cryptographically secure random integer in [0, max) */
function randInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

/** Pick a random element from an array or string */
function pick(collection) {
  return collection[randInt(collection.length)];
}

/** Generate a random 2-digit number string (10–99) */
function randTwoDigit() {
  return String(10 + randInt(90));
}

/* ─────────────────────────────────────────────
   TAB SWITCHING
───────────────────────────────────────────── */
function switchTab(name, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  btn.classList.add('active');
}

/* ─────────────────────────────────────────────
   PASSWORD GENERATOR
   Formula: Word + Word + Number + Symbol
   e.g.  BlueDingo47!  |  KoalaPizza83@
───────────────────────────────────────────── */
function generatePassword() {
  /* Identify the selected pattern */
  const selectedRadio = document.querySelector('input[name=pw-pattern]:checked');
  if (!selectedRadio) {
    showToast('Please select a password pattern first!');
    return;
  }

  const pattern = PATTERNS.find(p => p.id === selectedRadio.value);
  if (!pattern) return;

  /* Pick one Title-Cased word from each bank */
  const words = pattern.banks.map(bankName => titleCase(pick(BANK_MAP[bankName])));

  /* Assemble: Word1 + Word2 + 2-digit number + symbol */
  const number = randTwoDigit();
  const symbol = pick(CHARS.sym);
  const pw     = words.join('') + number + symbol;

  displayOutput('pw-output', pw);
  updateStrength('bar', 'strength-label', pw);
  updateFormulaHint(pattern);
  addHistory(pw, 'password', pattern.label);
}

/** Capitalise first letter, lowercase the rest */
function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/** Render the formula pill row beneath the output box */
function updateFormulaHint(pattern) {
  const hint = document.getElementById('pw-pattern-hint');
  if (!hint) return;

  const parts = [
    ...pattern.banks.map(b => BANK_LABELS[b]),
    'Number',
    'Symbol'
  ];

  hint.innerHTML = parts
    .map(p => `<span class="formula-part">${p}</span>`)
    .join('<span class="formula-sep">+</span>');
}

/* ─────────────────────────────────────────────
   PASSPHRASE GENERATOR
   Formula: Word(s) + optional number + optional symbol
   Uses the same 4 word banks, mixed together
───────────────────────────────────────────── */
function generatePassphrase() {
  const wordCount = parseInt(document.getElementById('pp-words').value);
  const addNum    = document.getElementById('pp-num').checked;
  const addSym    = document.getElementById('pp-sym').checked;
  const sepStyle  = document.querySelector('input[name=sep]:checked').value;

  /* Build the word segment */
  const words = Array.from({ length: wordCount }, () => pick(ALL_WORDS));

  let phrase;
  if (sepStyle === 'cap') {
    phrase = words.map(w => titleCase(w)).join('');
  } else if (sepStyle === 'dash') {
    phrase = words.map(w => w.toLowerCase()).join('-');
  } else {
    phrase = words.map(w => w.toLowerCase()).join('.');
  }

  if (addNum) phrase += randTwoDigit();
  if (addSym) phrase += pick(CHARS.sym);

  displayOutput('pp-output', phrase);
  updateStrength('pp-bar', 'pp-strength-label', phrase);
  addHistory(phrase, 'passphrase', '💬 Passphrase');
}

/* ─────────────────────────────────────────────
   STRENGTH METER
───────────────────────────────────────────── */
function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8)           score++;
  if (pw.length >= 12)          score++;
  if (pw.length >= 16)          score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[a-z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  return Math.min(5, Math.round((score / 7) * 5));
}

function updateStrength(barPrefix, labelId, pw) {
  const score = calcStrength(pw);

  for (let i = 1; i <= 5; i++) {
    const bar = document.getElementById(barPrefix + i);
    if (!bar) continue;
    bar.style.background = i <= score ? STRENGTH_COLOURS[score] : 'var(--cream-dark)';
    bar.style.transition  = `background .4s ease ${(i - 1) * 0.07}s`;
  }

  const lbl = document.getElementById(labelId);
  if (!lbl) return;
  lbl.textContent = STRENGTH_LABELS[score];
  lbl.style.color = STRENGTH_COLOURS[score];
}

/* ─────────────────────────────────────────────
   OUTPUT DISPLAY
───────────────────────────────────────────── */
function displayOutput(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.classList.remove('pulse');
  void el.offsetWidth; /* force reflow to restart animation */
  el.classList.add('pulse');
}

/* ─────────────────────────────────────────────
   HISTORY
───────────────────────────────────────────── */
function addHistory(text, type, patternLabel) {
  history.unshift({ text, type, patternLabel, ts: Date.now() });
  if (history.length > 12) history.pop();
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;

  if (history.length === 0) {
    list.innerHTML = `
      <div class="empty-history">
        Nothing generated yet.<br>
        Head to <strong>Password</strong> or <strong>Passphrase</strong> to get started!
      </div>`;
    return;
  }

  list.innerHTML = history.map((item, i) => `
    <div class="history-item" style="animation-delay:${i * 0.04}s">
      <div class="history-item-inner">
        <span class="history-label">${escapeHtml(item.patternLabel || (item.type === 'passphrase' ? '💬 Passphrase' : '🔑 Password'))}</span>
        <span class="history-pw">${escapeHtml(item.text)}</span>
      </div>
      <button class="history-copy" onclick="copyRaw('${escapeAttr(item.text)}')">Copy</button>
    </div>
  `).join('');
}

function clearHistory() {
  history = [];
  renderHistory();
  showToast('History cleared!');
}

/* ─────────────────────────────────────────────
   CLIPBOARD
───────────────────────────────────────────── */
function copyText(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.textContent.trim();
  if (!text || text.startsWith('Select a pattern') || text.startsWith('Click Generate')) {
    showToast('Generate something first!');
    return;
  }
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! ✓'));
}

function copyRaw(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied! ✓'));
}

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────────── */
let toastTimer;

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ─────────────────────────────────────────────
   SAFE HTML HELPERS
───────────────────────────────────────────── */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return String(s)
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────
   PRINT PASSWORD SLIP
───────────────────────────────────────────── */
function printPassword(outputId) {
  const el = document.getElementById(outputId);
  if (!el) return;

  const pw = el.textContent.trim();
  const placeholder = outputId === 'pw-output'
    ? 'Select a pattern above, then click Generate ✨'
    : 'Click Generate to start ✨';

  if (!pw || pw === placeholder) {
    showToast('Generate a password first!');
    return;
  }

  /* Populate the print slip */
  document.getElementById('print-pw-display').textContent = pw;
  document.getElementById('print-date').textContent =
    new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  /* Show slip, print, hide slip */
  const slip = document.getElementById('print-slip');
  slip.style.display = 'flex';
  window.print();
  slip.style.display = 'none';
}

/* ─────────────────────────────────────────────
   CONTROL WIRING
───────────────────────────────────────────── */

/** Sync the custom radio box visuals for passphrase separator */
function wirePassphraseSeparators() {
  document.querySelectorAll('input[name=sep]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('input[name=sep]').forEach(r => {
        const box = document.getElementById('sepbox-' + r.value);
        if (box) box.textContent = r.checked ? '✓' : '';
      });
    });
  });
}

/** Sync custom checkbox visuals */
function wireCheckboxes() {
  document.querySelectorAll('.check-item input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      const box = cb.nextElementSibling;
      if (box && box.classList.contains('check-box')) {
        box.textContent = cb.checked ? '✓' : '';
      }
    });
  });
}

/** Highlight the selected pattern card and immediately generate a password */
function wirePatternCards() {
  document.querySelectorAll('input[name=pw-pattern]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.pattern-card').forEach(card => {
        card.classList.remove('selected');
      });
      const card = radio.closest('.pattern-card');
      if (card) card.classList.add('selected');
      generatePassword();
    });
  });
}

/* ─────────────────────────────────────────────
   INITIALISE ON LOAD
───────────────────────────────────────────── */
window.addEventListener('load', () => {
  wirePassphraseSeparators();
  wireCheckboxes();
  wirePatternCards();

  /* Set initial passphrase separator visual */
  const sepCapBox = document.getElementById('sepbox-cap');
  if (sepCapBox) sepCapBox.textContent = '✓';

  /* Select and highlight the first pattern card by default */
  const firstRadio = document.querySelector('input[name=pw-pattern]');
  if (firstRadio) {
    firstRadio.checked = true;
    const firstCard = firstRadio.closest('.pattern-card');
    if (firstCard) firstCard.classList.add('selected');
  }

  /* Auto-generate a password immediately on page load */
  generatePassword();
});
