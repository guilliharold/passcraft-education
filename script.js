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
  'Keen','Lofty','Mystic','Nifty','Outgoing','Prickly','Regal','Spirited',
  // Added 32 more
  'Cheery','Cosy','Dandy','Frosty','Giddy','Humble','Speedy','Kind',
  'Lazy','Misty','Noisy','Playful','Quick','Rapid','Rustic','Shiny',
  'Sturdy','Sleepy','Tidy','Trusty','Upbeat','Vibrant','Warm','Windy',
  'Breezy','Chirpy','Dusty','Dreamy','Cuddly','Thrifty','Zany','Glowing'
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
  'Lagoon','Mosaic','Nomad','Oasis','Prism','Ripple','Summit','Tundra',
  // Added 32 more
  'Pencil','Window','Garden','Basket','Bucket','Button','Teapot','Ladder',
  'Magnet','Marble','Mirror','Paddle','Pillow','Pocket','Puzzle','Rainbow',
  'Ribbon','Saddle','Sailboat','Satchel','Shell','Spoon','Sunbeam','Thunder',
  'Trumpet','Tunnel','Umbrella','Whistle','Windmill','Biscuit','Campfire','Harbour'
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
  'Quetzal','Reindeer','Stingray','Tapir','Uakari','Viper','Weasel','Xerus',
  'Yak','Zebrafish','Basilisk','Condor','Dragonfly',
  // Added 32 more
  'Tiger','Lion','Bear','Wolf','Fox','Rabbit','Turtle','Giraffe',
  'Zebra','Elephant','Hedgehog','Badger','Beaver','Squirrel','Owl','Swan',
  'Heron','Robin','Sparrow','Cockatoo','Emu','Lizard','Frog','Crab',
  'Lobster','Shark','Whale','Seal','Moose','Bison','Llama','Alpaca'
];

const COLOURS = [
  // Original 30
  'Blue','Red','Green','Purple','Orange','Yellow','Silver','Golden',
  'Pink','Violet','Coral','Amber','Indigo','Teal','Crimson','Jade',
  'Scarlet','Azure','Ivory','Olive','Maroon','Cobalt','Magenta','Bronze',
  'Russet','Cerulean','Vermillion','Chartreuse','Ochre','Lavender',
  // Added 30
  'Turquoise','Periwinkle','Burgundy','Tangerine','Fuchsia','Slate','Sage',
  'Copper','Sapphire','Emerald','Ruby','Onyx','Pearl','Champagne','Topaz',
  'Mahogany','Saffron','Lilac','Mint','Denim','Claret','Apricot','Flaxen',
  'Obsidian','Pewter','Sienna','Taupe','Umber','Viridian','Wisteria',
  // Added 32 more
  'Black','White','Grey','Brown','Cream','Beige','Blush','Peach',
  'Plum','Rose','Lime','Navy','Aqua','Cyan','Rust','Sand',
  'Charcoal','Cherry','Chocolate','Lemon','Mustard','Cinnamon','Honey','Ginger',
  'Raspberry','Berry','Hazel','Cocoa','Mulberry','Seafoam','Moss','Sky'
];

/* ─────────────────────────────────────────────
   PASSWORD PATTERN DEFINITIONS
   Each pattern picks one word from each bank,
   then appends a 2-digit number + special char.
   Structure: Word + Word + Number + Symbol
   The first pattern listed is selected by default.
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
/* Duplicates removed (e.g. "Sapphire" is both a noun and a colour), so every
   word is exactly as likely as any other. */
const ALL_WORDS = Array.from(
  new Map([...ADJECTIVES, ...NOUNS, ...ANIMALS, ...COLOURS].map(w => [w.toLowerCase(), w])).values()
);

/* ─────────────────────────────────────────────
   CHARACTER SETS
   Ambiguous chars (0/O, 1/l/I) excluded
───────────────────────────────────────────── */
const CHARS = {
  num: '23456789',
  sym: '!@#$%&*?'
};

/* ─────────────────────────────────────────────
   SESSION HISTORY
───────────────────────────────────────────── */
let generationHistory = [];

/* ─────────────────────────────────────────────
   CRYPTO UTILITIES
───────────────────────────────────────────── */

/* randInt(): cryptographically secure random integer, from shared.js */

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
    const on = b === btn;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  document.getElementById('panel-' + name).classList.add('active');
}

/** Click + arrow-key / Home / End navigation for the tab bar */
function wireTabs() {
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));
  tabs.forEach((btn, i) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
    btn.addEventListener('keydown', e => {
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); next.focus(); switchTab(next.dataset.tab, next); }
    });
  });
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
function generatePassphrase(saveToHistory = true) {
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
  if (saveToHistory) addHistory(phrase, 'passphrase', '💬 Passphrase');
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
  generationHistory.unshift({ text, type, patternLabel, ts: Date.now() });
  if (generationHistory.length > 12) generationHistory.pop();
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;

  if (generationHistory.length === 0) {
    list.innerHTML = `
      <div class="empty-history">
        Nothing generated yet.<br>
        Head to <strong>Password</strong> or <strong>Passphrase</strong> to get started!
      </div>`;
    return;
  }

  list.innerHTML = generationHistory.map((item, i) => `
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
  generationHistory = [];
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
  writeClipboard(text, 'Copied to clipboard! ✓');
}

function copyRaw(text) {
  writeClipboard(text, 'Copied! ✓');
}

/** Copy text, with a fallback for browsers/contexts where the Clipboard API is unavailable */
async function writeClipboard(text, okMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(okMessage);
    return;
  } catch (err) { /* fall through to the legacy method */ }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(ok ? okMessage : "Couldn't copy. Please select the text and copy it.");
  } catch (err) {
    showToast("Couldn't copy. Please select the text and copy it.");
  }
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
  return escapeHtml(s)
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

  /* Don't leave the printed password sitting in the hidden slip */
  document.getElementById('print-pw-display').textContent = '';
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
  /* Other pages (such as Bulk Passwords) load this file only for the word banks and helpers */
  if (!document.getElementById('btn-generate-password')) return;

  wireTabs();

  /* Buttons (previously inline onclick handlers) */
  document.getElementById('btn-generate-password').addEventListener('click', generatePassword);
  document.getElementById('btn-generate-passphrase').addEventListener('click', () => generatePassphrase());
  document.getElementById('btn-clear-history').addEventListener('click', clearHistory);
  document.querySelectorAll('[data-copy]').forEach(b =>
    b.addEventListener('click', () => copyText(b.dataset.copy)));
  document.querySelectorAll('[data-print]').forEach(b =>
    b.addEventListener('click', () => printPassword(b.dataset.print)));

  /* Word-count slider: regenerate live while dragging (no History spam),
     then save the passphrase being shown to History once the slider is released */
  const words = document.getElementById('pp-words');
  const wordVal = document.getElementById('pp-word-val');
  words.addEventListener('input', () => {
    wordVal.textContent = words.value;
    generatePassphrase(false);
  });
  words.addEventListener('change', () => {
    const shown = document.getElementById('pp-output').textContent.trim();
    if (shown) addHistory(shown, 'passphrase', '💬 Passphrase');
  });

  wirePassphraseSeparators();
  wireCheckboxes();
  wirePatternCards();

  /* Separator style and number/symbol options regenerate immediately and are saved to History */
  document.querySelectorAll('input[name=sep], #pp-num, #pp-sym').forEach(el =>
    el.addEventListener('change', () => generatePassphrase()));

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

  /* Auto-generate a password and passphrase immediately on page load */
  generatePassword();
  generatePassphrase();
});