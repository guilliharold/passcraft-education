/* ═══════════════════════════════════════════════
   PASSCRAFT EDUCATION — Main Script
   script.js
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   WORD BANKS
───────────────────────────────────────────── */
const ADJECTIVES = [
  // Original 32
  'Brave','Clever','Swift','Mighty','Calm','Bright','Gentle','Bold',
  'Fierce','Lucky','Jolly','Proud','Witty','Eager','Loyal','Vivid',
  'Sunny','Crisp','Daring','Noble','Honest','Quirky','Zesty','Lively',
  'Fluffy','Grumpy','Bouncy','Sparky','Fuzzy','Snappy','Peppy','Wobbly',
  // Added 32
  'Radiant','Nimble','Sleek','Grand','Merry','Sharp','Tender','Wild',
  'Plucky','Serene','Gusty','Valiant','Silky','Zippy','Mellow','Stormy',
  'Brisk','Crafty','Dazzling','Fearless','Graceful','Hardy','Inventive','Jazzy',
  'Keen','Lofty','Mystic','Nifty','Outgoing','Prickly','Regal','Spirited'
];

const NOUNS = [
  // Original 32
  'Mountain','Rocket','Castle','Comet','Storm','Forest','River','Galaxy',
  'Lantern','Shield','Compass','Anchor','Sunrise','Crystal','Flame','Tower',
  'Bridge','Cloud','Stone','Ember','Breeze','Canyon','Meadow','Crater',
  'Candle','Barrel','Feather','Pebble','Wagon','Kettle','Blanket','Hammer',
  // Added 32
  'Glacier','Horizon','Lighthouse','Nebula','Orchard','Pinnacle','Quartz','Ravine',
  'Sapphire','Tide','Volcano','Waterfall','Zenith','Acorn','Beacon','Cavern',
  'Dewdrop','Eclipse','Fossil','Geyser','Haven','Iceberg','Jungle','Keystone',
  'Lagoon','Mosaic','Nomad','Oasis','Prism','Ripple','Summit','Tundra'
];

const ANIMALS = [
  // Original 29
  'Dingo','Kangaroo','Koala','Wombat','Platypus','Echidna','Quokka',
  'Wallaby','Possum','Bilby','Kookaburra','Magpie','Numbat','Gecko',
  'Eagle','Parrot','Dolphin','Penguin','Falcon','Otter','Panda','Jaguar',
  'Meerkat','Lemur','Narwhal','Axolotl','Capybara','Flamingo','Hamster',
  // Added 29
  'Cheetah','Gorilla','Octopus','Peacock','Raccoon','Seahorse','Toucan',
  'Vulture','Walrus','Wolverine','Lynx','Mantis','Newt','Ocelot','Pelican',
  'Alpaca','Reindeer','Stingray','Tapir','Marmot','Viper','Weasel','Ferret',
  'Yak','Salmon','Iguana','Condor','Dragonfly'
];

const COLOURS = [
  // Original 30
  'Blue','Red','Green','Purple','Orange','Yellow','Silver','Golden',
  'Pink','Violet','Coral','Amber','Indigo','Teal','Crimson','Jade',
  'Scarlet','Azure','Ivory','Olive','Maroon','Cobalt','Magenta','Bronze',
  'Russet','Cerulean','Vermillion','Chartreuse','Ochre','Lavender',
  // Added 30
  'Turquoise','Periwinkle','Burgundy','Tangerine','Fuchsia','Slate','Sage',
  'Copper','Rose','Emerald','Ruby','Onyx','Pearl','Champagne','Topaz',
  'Mahogany','Saffron','Lilac','Mint','Denim','Claret','Apricot','Flaxen',
  'Obsidian','Pewter','Sienna','Taupe','Umber','Viridian','Wisteria'
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
    label: '✏️ Adjective + Colour + Noun',
    desc:  'e.g. CleverTealRocket83@',
    banks: ['ADJECTIVES', 'COLOURS', 'NOUNS']
  },
  {
    id:    'colour-animal',
    label: '🎨 Adjective + Colour + Animal',
    desc:  'e.g. BraveBlueDingo47!',
    banks: ['ADJECTIVES', 'COLOURS', 'ANIMALS']
  }
];

/* Maps bank name strings → actual arrays */
const BANK_MAP = { ADJECTIVES, NOUNS, ANIMALS, COLOURS };

/* Human-readable labels for the formula hint */
const BANK_LABELS = {
  ADJECTIVES: 'Adjective',
  NOUNS:      'Noun',
  ANIMALS:    'Animal',
  COLOURS:    'Colour'
};

/* ─────────────────────────────────────────────
   PASSPHRASE — uses all word types combined
───────────────────────────────────────────── */
/* De-duplicated so no word is over-weighted */
const ALL_WORDS = [...new Set(
  [...ADJECTIVES, ...NOUNS, ...ANIMALS, ...COLOURS].map(w => w.toLowerCase())
)];

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
const STRENGTH_COLOURS = ['', '#c0392b', '#e67e22', '#f1c40f', '#27ae60', '#1e8449']; /* bars */
const STRENGTH_TEXT    = ['', '#a93226', '#b9570a', '#7a5f00', '#1e7a46', '#14532d']; /* label (AA contrast) */
const STRENGTH_LABELS  = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const STRENGTH_NOTES   = ['', 'Easy to guess', 'Add more words', 'Protects against online guessing',
                          'Strong for most school accounts', 'Excellent for important accounts'];

/* ─────────────────────────────────────────────
   SESSION HISTORY
───────────────────────────────────────────── */
let history = [];

/* The password / passphrase currently on screen (kept in memory only) */
const current = { pw: '', pp: '' };

/* ─────────────────────────────────────────────
   CRYPTO UTILITIES
───────────────────────────────────────────── */

/** Cryptographically secure random integer in [0, max) */
function randInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  /* Rejection sampling avoids modulo bias */
  const limit = Math.floor(0x100000000 / max) * max;
  while (arr[0] >= limit) crypto.getRandomValues(arr);
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
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    b.tabIndex = -1;
  });
  document.getElementById('panel-' + name).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.tabIndex = 0;
}

/** Arrow-key / Home / End navigation between tabs */
function wireTabs() {
  const tabs = [...document.querySelectorAll('.tab-btn')];
  tabs.forEach((t, i) => t.addEventListener('keydown', e => {
    const target = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    const next = tabs[(target + tabs.length) % tabs.length];
    next.focus();
    next.click();
  }));
}

/* ─────────────────────────────────────────────
   PASSWORD GENERATOR
   Formula: Word + Word + Number + Symbol
   e.g.  BlueDingo47!  |  KoalaPizza83@
───────────────────────────────────────────── */
function generatePassword(silent) {
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
  updateStrength('bar', 'strength-label', patternBits(pattern.banks));
  updateFormulaHint(pattern);
  current.pw = pw;
  resetPractice('pw');
  if (!silent) addHistory(pw, 'password', pattern.label);
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
function generatePassphrase(silent) {
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
  const bits = wordCount * Math.log2(ALL_WORDS.length)
             + (addNum ? Math.log2(90) : 0)
             + (addSym ? Math.log2(CHARS.sym.length) : 0);
  updateStrength('pp-bar', 'pp-strength-label', bits);
  current.pp = phrase;
  resetPractice('pp');
  if (!silent) addHistory(phrase, 'passphrase', '💬 Passphrase');
}

/* ─────────────────────────────────────────────
   STRENGTH METER
───────────────────────────────────────────── */
/** Bits of randomness for a word pattern: words + 2-digit number + symbol */
function patternBits(banks) {
  return banks.reduce((t, b) => t + Math.log2(BANK_MAP[b].length), 0)
       + Math.log2(90) + Math.log2(CHARS.sym.length);
}

/* Thresholds follow common guess-count tiers (about 10^6, 10^8, 10^10 guesses) */
function bitsToScore(bits) {
  return bits < 20 ? 1 : bits < 27 ? 2 : bits < 33 ? 3 : bits < 45 ? 4 : 5;
}

function updateStrength(barPrefix, labelId, bits) {
  const score = bitsToScore(bits);

  for (let i = 1; i <= 5; i++) {
    const bar = document.getElementById(barPrefix + i);
    if (!bar) continue;
    bar.style.background = i <= score ? STRENGTH_COLOURS[score] : 'var(--surface-dark)';
    bar.style.transition  = `background .4s ease ${(i - 1) * 0.07}s`;
  }

  const lbl = document.getElementById(labelId);
  if (lbl) {
    lbl.textContent = STRENGTH_LABELS[score];
    lbl.style.color = STRENGTH_TEXT[score];
  }
  const note = document.getElementById(labelId.replace('label', 'note'));
  if (note) note.textContent = `About ${Math.round(bits)} bits of randomness · ${STRENGTH_NOTES[score]}`;
}

/* ─────────────────────────────────────────────
   PRACTISE TYPING + HIDE/SHOW
───────────────────────────────────────────── */
function checkPractice(which) {
  const input = document.getElementById(which + '-practice');
  const msg   = document.getElementById(which + '-practice-msg');
  if (!input || !msg) return;
  const v = input.value, target = current[which];
  let text = '', cls = 'practice-msg';
  if (v) {
    if (v === target)            { text = '✓ Match! Now try again without looking.'; cls += ' ok'; }
    else if (target.startsWith(v)) text = 'Looking good… keep going';
    else                         { text = 'Not a match yet – check capital letters and symbols.'; cls += ' bad'; }
  }
  msg.textContent = text;
  msg.className = cls;
}

function resetPractice(which) {
  const input = document.getElementById(which + '-practice');
  if (input) { input.value = ''; checkPractice(which); }
}

function toggleMask(id, btn) {
  const hidden = document.getElementById(id).classList.toggle('masked');
  btn.setAttribute('aria-pressed', String(hidden));
  btn.setAttribute('aria-label', hidden ? 'Show password' : 'Hide password');
  btn.textContent = hidden ? '🙈' : '👁️';
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
      <button class="history-copy" data-action="copy" data-text="${escapeAttr(item.text)}">Copy</button>
      <button class="history-print" data-action="print" data-text="${escapeAttr(item.text)}" title="Print password slip">🖨️</button>
    </div>
  `).join('');
}

/** Handles Copy and Print clicks for any history item (delegated) */
function handleHistoryListClick(e) {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const text = btn.dataset.text;
  if (btn.dataset.action === 'copy') {
    copyRaw(text);
  } else if (btn.dataset.action === 'print') {
    printRaw(text);
  }
}

function clearHistory() {
  history = [];
  renderHistory();
  showToast('History cleared!');
}

/* ─────────────────────────────────────────────
   CLIPBOARD
───────────────────────────────────────────── */
function legacyCopy(text) {
  const t = document.createElement('textarea');
  t.value = text;
  t.setAttribute('readonly', '');
  t.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(t);
  t.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { /* ignore */ }
  t.remove();
  return ok;
}

function copyToClipboard(text, okMsg) {
  const done = () => showToast(okMsg);
  const fail = () => showToast("Couldn't copy – select the text and copy it manually.");
  const fallback = () => (legacyCopy(text) ? done() : fail());
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, fallback);
  } else {
    fallback();
  }
}

function copyText(id) {
  const text = id === 'pw-output' ? current.pw : current.pp;
  if (!text) { showToast('Generate something first!'); return; }
  copyToClipboard(text, 'Copied to clipboard! ✓');
}

function copyRaw(text) {
  copyToClipboard(text, 'Copied! ✓');
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
  const pw = outputId === 'pw-output' ? current.pw : current.pp;
  if (!pw) { showToast('Generate a password first!'); return; }
  printRaw(pw);
}

/** Print a slip for a raw password/passphrase string (used by History tab) */
function printRaw(pw) {
  if (!pw) return;

  /* Populate the print slip */
  document.getElementById('print-pw-display').textContent = pw;
  document.getElementById('print-date').textContent =
    new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  /* Show slip, print, hide slip */
  const slip = document.getElementById('print-slip');
  slip.style.display = 'flex';
  window.print();
  slip.style.display = 'none';
  document.getElementById('print-pw-display').textContent = ''; /* don't leave it in the page */
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
  wireTabs();
  ['pw', 'pp'].forEach(k => {
    const el = document.getElementById(k + '-practice');
    if (el) el.addEventListener('input', () => checkPractice(k));
  });
  wirePassphraseSeparators();
  wireCheckboxes();
  wirePatternCards();

  /* Delegate Copy/Print clicks for History items */
  const historyList = document.getElementById('history-list');
  if (historyList) historyList.addEventListener('click', handleHistoryListClick);

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

  /* Auto-generate on load (silent: not added to History until the student asks) */
  generatePassword(true);
  generatePassphrase(true);
});
