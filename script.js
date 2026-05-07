/* ═══════════════════════════════════════════════
   PASSCRAFT EDUCATION — Main Script
   script.js
═══════════════════════════════════════════════ */

/* ── Word banks ── */
const COLOURS = [
  'Blue','Red','Green','Purple','Orange','Yellow','Silver','Golden',
  'Pink','Violet','Coral','Amber','Indigo','Teal','Crimson','Jade'
];

const ANIMALS = [
  'Dingo','Kangaroo','Koala','Wombat','Platypus','Echidna','Quokka',
  'Wallaby','Possum','Bilby','Kookaburra','Emu','Magpie','Numbat',
  'Gecko','Eagle','Parrot','Dolphin','Shark','Dragon'
];

const NOUNS = [
  'Mountain','Rocket','Castle','Comet','Storm','Forest','River','Galaxy',
  'Lantern','Shield','Compass','Anchor','Sunrise','Shadow','Crystal','Flame'
];

const ALL_WORDS = [
  ...COLOURS, ...ANIMALS, ...NOUNS,
  'Brave','Clever','Swift','Mighty','Calm','Bright',
  'Maple','Cedar','Tide','Cloud','Stone','Ember'
];

/* ── Banned / common passwords ── */
const BANNED = new Set([
  'password','123456','qwerty','abc123','monkey','letmein','iloveyou',
  'admin','login','welcome','111111','123123','dragon','master','sunshine',
  'princess','football','shadow','superman','batman','starwars'
]);

/* ── Character sets ── */
const CHARS = {
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  lower: 'abcdefghjkmnpqrstuvwxyz',
  num:   '23456789',
  sym:   '!@#$%&*?'
};

/* ── Strength metadata ── */
const STRENGTH_COLOURS = ['', '#c0392b', '#e67e22', '#f1c40f', '#27ae60', '#1e8449'];
const STRENGTH_LABELS  = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

/* ── Session history ── */
let history = [];

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
   CRYPTO UTILITIES
───────────────────────────────────────────── */

/** Returns a cryptographically secure random integer in [0, max) */
function randInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

/** Pick a random element from an array or string */
function pick(arr) {
  return arr[randInt(arr.length)];
}

/** Fisher-Yates shuffle using crypto randomness */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ─────────────────────────────────────────────
   PASSWORD GENERATOR
───────────────────────────────────────────── */
function generatePassword() {
  const len    = parseInt(document.getElementById('pw-length').value);
  const useUpp = document.getElementById('chk-upper').checked;
  const useLow = document.getElementById('chk-lower').checked;
  const useNum = document.getElementById('chk-num').checked;
  const useSym = document.getElementById('chk-sym').checked;

  if (!useUpp && !useLow && !useNum && !useSym) {
    showToast('Please select at least one character type!');
    return;
  }

  let pool = '';
  let guaranteed = [];

  if (useUpp) { pool += CHARS.upper; guaranteed.push(pick(CHARS.upper)); }
  if (useLow) { pool += CHARS.lower; guaranteed.push(pick(CHARS.lower)); }
  if (useNum) { pool += CHARS.num;   guaranteed.push(pick(CHARS.num));   }
  if (useSym) { pool += CHARS.sym;   guaranteed.push(pick(CHARS.sym));   }

  let attempts = 0;
  let pw;

  do {
    const remaining = len - guaranteed.length;
    const extra = Array.from({ length: remaining }, () => pick(pool));
    pw = shuffle([...guaranteed, ...extra]).join('');
    attempts++;
  } while (BANNED.has(pw.toLowerCase()) && attempts < 50);

  displayOutput('pw-output', pw);
  updateStrength('bar', 'strength-label', pw);
  addHistory(pw, 'password');
}

/* ─────────────────────────────────────────────
   PASSPHRASE GENERATOR
───────────────────────────────────────────── */
function generatePassphrase() {
  const wordCount = parseInt(document.getElementById('pp-words').value);
  const addNum    = document.getElementById('pp-num').checked;
  const addSym    = document.getElementById('pp-sym').checked;
  const sepStyle  = document.querySelector('input[name=sep]:checked').value;

  const words = Array.from({ length: wordCount }, () => pick(ALL_WORDS));

  let phrase;
  if (sepStyle === 'cap') {
    phrase = words.map(w => w[0].toUpperCase() + w.slice(1)).join('');
  } else if (sepStyle === 'dash') {
    phrase = words.map(w => w.toLowerCase()).join('-');
  } else {
    phrase = words.map(w => w.toLowerCase()).join('.');
  }

  if (addNum) {
    const decade = 20 + randInt(10);
    const digit  = randInt(10);
    phrase += (decade * 10 + digit);
  }

  if (addSym) {
    phrase += pick(CHARS.sym);
  }

  displayOutput('pp-output', phrase);
  updateStrength('pp-bar', 'pp-strength-label', phrase);
  addHistory(phrase, 'passphrase');
}

/* ─────────────────────────────────────────────
   STRENGTH METER
───────────────────────────────────────────── */
function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8)          score++;
  if (pw.length >= 12)         score++;
  if (pw.length >= 16)         score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[a-z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(5, Math.round(score / 7 * 5));
}

function updateStrength(barPrefix, labelId, pw) {
  const score = calcStrength(pw);

  for (let i = 1; i <= 5; i++) {
    const bar = document.getElementById(barPrefix + i);
    bar.style.background = i <= score ? STRENGTH_COLOURS[score] : 'var(--cream-dark)';
    bar.style.transition  = `background .4s ease ${(i - 1) * 0.07}s`;
  }

  const lbl = document.getElementById(labelId);
  lbl.textContent = STRENGTH_LABELS[score];
  lbl.style.color = STRENGTH_COLOURS[score];
}

/* ─────────────────────────────────────────────
   OUTPUT DISPLAY
───────────────────────────────────────────── */
function displayOutput(id, text) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.classList.remove('pulse');
  void el.offsetWidth; // force reflow to re-trigger animation
  el.classList.add('pulse');
}

/* ─────────────────────────────────────────────
   HISTORY
───────────────────────────────────────────── */
function addHistory(text, type) {
  history.unshift({ text, type, ts: Date.now() });
  if (history.length > 12) history.pop();
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');

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
      <span>${item.type === 'passphrase' ? '💬' : '🔑'} ${escapeHtml(item.text)}</span>
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
  const text = document.getElementById(id).textContent.trim();
  if (!text || text.includes('Click Generate')) {
    showToast('Nothing to copy yet!');
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
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ─────────────────────────────────────────────
   SAFE HTML HELPERS
───────────────────────────────────────────── */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return s
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────
   CUSTOM CONTROL WIRING
───────────────────────────────────────────── */

// Sync radio button visual state when changed
document.querySelectorAll('input[name=sep]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('input[name=sep]').forEach(r => {
      document.getElementById('sepbox-' + r.value).textContent = r.checked ? '✓' : '';
    });
  });
});

// Sync checkbox visual state when changed
document.querySelectorAll('.check-item input[type=checkbox]').forEach(cb => {
  cb.addEventListener('change', () => {
    cb.nextElementSibling.textContent = cb.checked ? '✓' : '';
  });
});

/* ─────────────────────────────────────────────
   INITIALISE ON LOAD
───────────────────────────────────────────── */
window.addEventListener('load', () => {
  // Set initial radio visual
  document.getElementById('sepbox-cap').textContent = '✓';
  // Auto-generate a password on first load
  generatePassword();
});
