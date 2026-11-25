/* ═══════════════════════════════════════════════
   PASSCRAFT EDUCATION — Shared helpers
   shared.js

   Used by the Generator, the Strength Indicator and the Learn page.
   Load it BEFORE the page's own script. Everything here is
   plain browser JavaScript: nothing is stored or sent.
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   RANDOMNESS
───────────────────────────────────────────── */

/** Cryptographically secure random integer in [0, max) */
function randInt(max) {
  /* Reject values above the largest multiple of max, so every outcome is equally likely */
  const limit = Math.floor(0x100000000 / max) * max;
  const arr = new Uint32Array(1);
  do { crypto.getRandomValues(arr); } while (arr[0] >= limit);
  return arr[0] % max;
}

/* ─────────────────────────────────────────────
   STRENGTH SCALE (the Generator and the Strength Indicator share it,
   so the two pages never disagree about the same number of bits)
───────────────────────────────────────────── */

/* Attacker speed assumed for every crack-time estimate */
const GUESSES_PER_SECOND = 1e10;

/* Used for both the bars and the label text. Each shade is 4.5:1 or better on white. */
const STRENGTH_COLOURS = ['', '#c0392b', '#b85c00', '#7a5c00', '#1e8449', '#14693a'];
const STRENGTH_LABELS  = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

/** 1–5 score from estimated bits of guessing effort */
function scoreFromBits(bits) {
  if (bits < 25) return 1;
  if (bits < 35) return 2;
  if (bits < 50) return 3;
  if (bits < 65) return 4;
  return 5;
}

function plural(n, unit) {
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}

/** Average time to find a password worth `bits` bits, as friendly text */
function formatCrackTime(bits) {
  const seconds = Math.pow(2, bits) / 2 / GUESSES_PER_SECOND;

  if (seconds < 1)        return 'Instantly';
  if (seconds < 60)       return plural(Math.round(seconds), 'second');
  if (seconds < 3600)     return plural(Math.round(seconds / 60), 'minute');
  if (seconds < 86400)    return plural(Math.round(seconds / 3600), 'hour');
  if (seconds < 2592000)  return plural(Math.round(seconds / 86400), 'day');
  if (seconds < 31536000) return plural(Math.round(seconds / 2592000), 'month');

  const years = seconds / 31536000;
  if (years < 1000)  return plural(Math.round(years), 'year');
  if (years < 1e6)   return 'Thousands of years';
  if (years < 1e9)   return 'Millions of years';
  return 'Billions of years';
}