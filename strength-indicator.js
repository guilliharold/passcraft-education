/* ═══════════════════════════════════════════════
   PASSCRAFT EDUCATION — Strength Indicator
   strength-indicator.js

   Runs entirely in the browser. The password is never
   stored, logged, or sent anywhere.

   How scoring works (a small "zxcvbn-style" estimator):
   • The password is scanned left to right.
   • Recognised chunks (common passwords, dictionary words,
     keyboard runs, sequences, repeats, years) are charged a
     small fixed number of "bits" because attackers guess
     them first.
   • Every other character is charged log2(character pool).
   • Total bits → strength score + crack-time estimate.
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

/* Lowercase. Matched as substrings (4+ chars). */
const COMMON_PASSWORDS = [
  'password','123456','1234567','12345678','123456789','1234567890','654321',
  '987654321','111111','000000','123123','121212','112233','qwerty','qwerty123',
  'qwertyuiop','abc123','letmein','welcome','iloveyou','admin','administrator',
  'monkey','dragon','football','baseball','master','shadow','sunshine','princess',
  'superman','batman','trustno1','starwars','login','changeme','default','school',
  'student','teacher','hello123','freedom','whatever','michael','jessica','charlie',
  'jennifer','access','flower','loveme','mustang','ninja','pokemon','minecraft',
  'fortnite','roblox','snoopy','soccer','hockey','cookie','secret','summer',
  'winter','1q2w3e4r','zaq12wsx','passw0rd','p@ssword','guest','computer','internet'
];

/* Lowercase, letters only, 4+ chars. A starter list: extend it any time. */
const COMMON_WORDS = [
  'love','life','home','family','friend','friends','happy','lucky','angel','baby',
  'sweet','honey','sugar','cutie','pretty','beauty','smile','dream','magic','music',
  'party','crazy','super','mega','ultra','cool','awesome','amazing','great','best',
  'king','queen','prince','hero','legend','champion','winner','tiger','lion','bear',
  'wolf','eagle','shark','horse','puppy','kitten','bunny','monkey','panda','koala',
  'kangaroo','dingo','wombat','parrot','dolphin','penguin','falcon','otter','jaguar',
  'cheetah','gorilla','octopus','turtle','spider','snake','dragon','unicorn','phoenix',
  'red','blue','green','black','white','yellow','orange','purple','pink','silver',
  'golden','gold','brown','grey','gray','coral','violet','crimson','scarlet','indigo',
  'sun','moon','star','stars','sky','cloud','rain','storm','snow','fire','water','earth',
  'ocean','river','mountain','forest','island','beach','desert','garden','flower','rose',
  'house','castle','tower','bridge','rocket','planet','galaxy','comet','space','robot',
  'pizza','burger','chocolate','cookie','candy','banana','apple','cherry','lemon','mango',
  'coffee','pasta','cheese','bacon','donut','cake','pancake','sandwich',
  'monday','tuesday','wednesday','thursday','friday','saturday','sunday',
  'january','february','march','april','june','july','august','september','october',
  'november','december','spring','autumn',
  'australia','victoria','melbourne','sydney','brisbane','perth','adelaide','canberra',
  'geelong','ballarat','bendigo','shepparton','numurkah','nathalia',
  'collingwood','carlton','richmond','essendon','hawthorn','sydney','swans','cats',
  'magpies','tigers','bombers','demons','saints','dockers','lions','eagles',
  'football','soccer','cricket','tennis','basketball','netball','rugby','swimming',
  'game','gamer','gaming','player','minecraft','roblox','fortnite','pokemon','mario',
  'zelda','sonic','xbox','playstation','nintendo','youtube','tiktok','snapchat','discord',
  'google','apple','samsung','phone','laptop','computer','keyboard','school','college',
  'student','teacher','class','books','study','learn','hello','welcome','please','thanks',
  'secret','private','access','login','admin','user','guest','master','shadow','ninja',
  'pirate','knight','wizard','warrior','soldier','captain','doctor','nurse','police',
  'james','john','robert','michael','william','david','joseph','thomas','daniel','matthew',
  'jack','oliver','noah','liam','ethan','lucas','mason','logan','harry','henry','harold',
  'mary','sarah','emma','olivia','sophia','isabella','charlotte','amelia','chloe','jessica',
  'jennifer','ashley','emily','lily','grace','hannah','sophie','ruby','mia','zoe'
];

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890', 'qazwsxedcrfv', '1q2w3e4r5t'];
const KEYBOARD_STRINGS = KEYBOARD_ROWS.concat(
  KEYBOARD_ROWS.map(r => r.split('').reverse().join(''))
);

/* Look-alike substitutions attackers already know about */
const LEET = {
  '@': 'a', '4': 'a', '3': 'e', '1': 'i', '!': 'i',
  '0': 'o', '$': 's', '5': 's', '7': 't', '+': 't', '8': 'b'
};

/* Cost (in bits) of guessing each kind of recognised chunk */
const COST = { common: 8, word: 14, year: 7, keyboard: 9 };

/* GUESSES_PER_SECOND, STRENGTH_COLOURS, STRENGTH_LABELS, scoreFromBits() and
   formatCrackTime() come from shared.js, which must load before this file. */

/* ─────────────────────────────────────────────
   ANALYSIS
───────────────────────────────────────────── */

function normaliseLeet(s) {
  let out = '';
  for (const ch of s) out += LEET[ch] || ch;
  return out;
}

function poolSize(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw))        pool += 26;
  if (/[A-Z]/.test(pw))        pool += 26;
  if (/[0-9]/.test(pw))        pool += 10;
  if (/[ -/:-@[-`{-~]/.test(pw)) pool += 33;
  if (/[^\x00-\x7F]/.test(pw)) pool += 100;
  return Math.max(pool, 10);
}

function keyboardLength(s, i) {
  const maxLen = Math.min(12, s.length - i);
  for (let k = maxLen; k >= 4; k--) {
    const sub = s.substr(i, k);
    if (KEYBOARD_STRINGS.some(row => row.includes(sub))) return k;
  }
  return 0;
}

function sequenceLength(s, i) {
  if (i + 2 >= s.length) return 0;
  const alnum = /^[a-z0-9]$/;
  if (!alnum.test(s[i])) return 0;
  const d = s.charCodeAt(i + 1) - s.charCodeAt(i);
  if (Math.abs(d) !== 1) return 0;
  let k = 1;
  while (
    i + k < s.length &&
    alnum.test(s[i + k]) &&
    s.charCodeAt(i + k) - s.charCodeAt(i + k - 1) === d
  ) k++;
  return k >= 3 ? k : 0;
}

function repeatLength(s, i) {
  let k = 1;
  while (i + k < s.length && s[i + k] === s[i]) k++;
  return k >= 3 ? k : 0;
}

/** Find the best recognised chunk starting at position i (or null) */
function bestMatchAt(s, n, i, charBits) {
  const candidates = [];

  /* Common passwords (checked on raw and leet-normalised text) */
  for (const cp of COMMON_PASSWORDS) {
    if (s.startsWith(cp, i)) {
      candidates.push({ len: cp.length, bits: COST.common, type: 'common', leet: false });
    } else if (n.startsWith(normaliseLeet(cp), i)) {
      candidates.push({ len: cp.length, bits: COST.common + 2, type: 'common', leet: true });
    }
  }

  /* Dictionary words (leet-normalised) */
  for (const w of COMMON_WORDS) {
    if (n.startsWith(w, i)) {
      const usedLeet = s.substr(i, w.length) !== w;
      candidates.push({ len: w.length, bits: COST.word + (usedLeet ? 2 : 0), type: 'word', leet: usedLeet });
    }
  }

  /* Years 1900–2099 */
  if (/^(19|20)\d\d/.test(s.substr(i, 4))) {
    candidates.push({ len: 4, bits: COST.year, type: 'year', leet: false });
  }

  /* Keyboard runs, sequences, repeats */
  const kb = keyboardLength(s, i);
  if (kb) candidates.push({ len: kb, bits: COST.keyboard, type: 'keyboard', leet: false });

  const sq = sequenceLength(s, i);
  if (sq) candidates.push({ len: sq, bits: charBits + Math.log2(sq) + 1, type: 'sequence', leet: false });

  const rp = repeatLength(s, i);
  if (rp) candidates.push({ len: rp, bits: charBits + Math.log2(rp), type: 'repeat', leet: false });

  if (!candidates.length) return null;

  /* Prefer the longest chunk; break ties with the cheapest */
  candidates.sort((a, b) => b.len - a.len || a.bits - b.bits);
  return candidates[0];
}

function analyse(pw) {
  const s = pw.toLowerCase();
  let n = normaliseLeet(s);
  if (n.length !== s.length) n = s; /* safety for unusual unicode */

  const charBits = Math.log2(poolSize(pw));
  const found = {
    common: false, word: false, year: false,
    keyboard: false, sequence: false, repeat: false, leet: false
  };

  let bits = 0;
  let i = 0;
  while (i < s.length) {
    const m = bestMatchAt(s, n, i, charBits);
    if (m) {
      found[m.type] = true;
      if (m.leet) found.leet = true;
      bits += m.bits;
      i += m.len;
    } else {
      bits += charBits;
      i += 1;
    }
  }

  const classes = {
    upper:  /[A-Z]/.test(pw),
    lower:  /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw)
  };

  /* Score 1–5 from estimated bits (same scale as the Generator) */
  let score = scoreFromBits(bits);

  if (pw.length < 8) score = Math.min(score, 2);
  if (found.common && pw.length < 12) score = 1;

  return { bits, score, found, classes, length: pw.length };
}

/* ─────────────────────────────────────────────
   FEEDBACK
───────────────────────────────────────────── */

function buildFeedback(a) {
  const f = a.found;
  const items = [];
  const add = (type, text) => items.push({ type, text });

  if (f.common)   add('bad',  'This contains a very commonly used password. Attackers try these first, so avoid them completely.');
  if (f.keyboard) add('bad',  'Keyboard patterns like "qwerty" or "asdf" are some of the first things attackers try.');
  if (f.sequence) add('warn', 'Sequences such as "abc" or "1234" are easy to guess.');
  if (f.repeat)   add('warn', 'Repeated characters (like "aaa" or "111") add very little strength.');
  if (f.year)     add('warn', 'Years and birth dates are easy for attackers to guess. Try leaving them out.');
  if (f.leet)     add('warn', 'Swapping letters for look-alike symbols (like @ for "a" or 0 for "o") is a well-known trick and adds very little protection.');
  if (f.word)     add('warn', 'Ordinary words are fine in a passphrase, but only if they are random and unrelated to each other, and to you.');

  if (a.length < 12) {
    add('warn', `Longer is stronger: aim for at least 12 characters. Yours has ${a.length}.`);
  }

  const classCount = Object.values(a.classes).filter(Boolean).length;
  if (classCount < 3) {
    add('warn', 'Mix it up: try combining uppercase letters, lowercase letters, numbers and symbols.');
  }

  /* Suggestions */
  if (f.common) {
    add('tip', 'Start fresh with something completely different instead of tweaking a common password.');
  } else if (a.score < 4) {
    add('tip', 'Try a passphrase of 4 or more random, unrelated words, plus a number and a symbol.');
  }

  const hasIssues = items.some(i => i.type === 'bad' || i.type === 'warn');
  if (!hasIssues && a.score >= 4) {
    items.unshift({ type: 'good', text: 'Great work! No common words or patterns found, and it has good length.' });
  } else if (!hasIssues) {
    items.unshift({ type: 'good', text: 'No common words or patterns found. A little extra length would make it stronger.' });
  }

  return items;
}

/* ─────────────────────────────────────────────
   UI
───────────────────────────────────────────── */

const els = {
  input:    document.getElementById('c-input'),
  toggle:   document.getElementById('c-toggle'),
  label:    document.getElementById('c-label'),
  results:  document.getElementById('c-results'),
  crack:    document.getElementById('c-crack'),
  feedback: document.getElementById('c-feedback'),
  clear:    document.getElementById('c-clear'),
  criteria: document.querySelectorAll('#c-criteria li')
};

function setBars(score) {
  for (let i = 1; i <= 5; i++) {
    const bar = document.getElementById('c-bar' + i);
    if (!bar) continue;
    bar.style.background = i <= score ? STRENGTH_COLOURS[score] : 'var(--cream-dark)';
    bar.style.transition = `background .4s ease ${(i - 1) * 0.07}s`;
  }
}

function setCriteria(met) {
  els.criteria.forEach(li => {
    const ok = !!met[li.dataset.key];
    li.classList.toggle('met', ok);
    li.querySelector('.criteria-icon').textContent = ok ? '✓' : '';
  });
}

function reset() {
  setBars(0);
  els.label.textContent = '–';
  els.label.style.color = 'var(--text-light)';
  setCriteria({});
  els.results.classList.add('hidden');
  els.feedback.replaceChildren();
}

function render() {
  const pw = els.input.value;
  if (!pw) { reset(); return; }

  const a = analyse(pw);

  setBars(a.score);
  els.label.textContent = STRENGTH_LABELS[a.score];
  els.label.style.color = STRENGTH_COLOURS[a.score];

  const f = a.found;
  setCriteria({
    length:   a.length >= 12,
    upper:    a.classes.upper,
    lower:    a.classes.lower,
    number:   a.classes.number,
    symbol:   a.classes.symbol,
    patterns: !(f.common || f.keyboard || f.sequence || f.repeat || f.year)
  });

  els.crack.textContent = formatCrackTime(a.bits);

  /* Build feedback with textContent only (nothing from the password is inserted) */
  els.feedback.replaceChildren(
    ...buildFeedback(a).map(item => {
      const li = document.createElement('li');
      li.className = item.type;
      li.textContent = item.text;
      return li;
    })
  );

  els.results.classList.remove('hidden');
}

function toggleVisibility() {
  const showing = els.input.type === 'text';
  els.input.type = showing ? 'password' : 'text';
  els.toggle.textContent = showing ? '👁️' : '🙈';
  els.toggle.title = showing ? 'Show password' : 'Hide password';
  els.toggle.setAttribute('aria-label', els.toggle.title);
  els.toggle.setAttribute('aria-pressed', String(!showing));
  els.input.focus();
}

function clearAll() {
  els.input.value = '';
  els.input.type = 'password';
  els.toggle.textContent = '👁️';
  els.toggle.title = 'Show password';
  els.toggle.setAttribute('aria-label', 'Show password');
  els.toggle.setAttribute('aria-pressed', 'false');
  reset();
  els.input.focus();
}

els.input.addEventListener('input', render);
els.toggle.addEventListener('click', toggleVisibility);
els.clear.addEventListener('click', clearAll);

/* Wipe the field when leaving the page or restoring it from the back/forward cache */
window.addEventListener('pagehide', () => { els.input.value = ''; });
window.addEventListener('pageshow', () => { els.input.value = ''; reset(); });

reset();