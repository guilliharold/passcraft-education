/* ═══════════════════════════════════════════════
   PASSCRAFT EDUCATION — Breach Check
   breach-check.js

   OPTIONAL and opt-in. This is the one place on the site where
   something leaves the browser, and only when the person ticks the
   consent box and clicks "Check for breaches".

   How it works (k-anonymity, as used by Have I Been Pwned):
   1. The password is hashed with SHA-1 inside the browser.
   2. Only the FIRST 5 characters of the hash are sent to
      https://api.pwnedpasswords.com/range/<prefix>
   3. The service returns every hash ending that shares that prefix
      (padded with decoys, so the response size reveals nothing).
   4. The browser looks for its own ending in that list locally.

   The password and the full hash are never sent. Nothing is logged,
   stored or passed to any PassCraft code beyond this file.
═══════════════════════════════════════════════ */

const RANGE_URL  = 'https://api.pwnedpasswords.com/range/';
const TIMEOUT_MS = 10000;

const els = {
  input:    document.getElementById('b-input'),
  toggle:   document.getElementById('b-toggle'),
  consent:  document.getElementById('b-consent'),
  box:      document.getElementById('b-consent-box'),
  check:    document.getElementById('b-check'),
  clear:    document.getElementById('b-clear'),
  results:  document.getElementById('b-results'),
  feedback: document.getElementById('b-feedback'),
  cta:      document.getElementById('b-cta')
};

const CHECK_LABEL = els.check.textContent;
let busy = false;

/* ─────────────────────────────────────────────
   LOOKUP
───────────────────────────────────────────── */

/** SHA-1 of the text, as 40 uppercase hex characters */
async function sha1Hex(text) {
  const bytes  = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-1', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

/** One request to the range endpoint. Padding hides how many real matches there are. */
async function fetchRange(prefix, padded, signal) {
  const options = {
    method: 'GET',
    cache: 'no-store',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    signal
  };
  if (padded) options.headers = { 'Add-Padding': 'true' };

  const res = await fetch(RANGE_URL + prefix, options);
  if (!res.ok) throw new Error('Bad response: ' + res.status);
  return res.text();
}

/** Returns how many times the password appears in known breaches (0 = not found) */
async function lookupCount(password) {
  const hash   = await sha1Hex(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    let body;
    try {
      body = await fetchRange(prefix, true, ctrl.signal);
    } catch (err) {
      /* If the padded request is blocked by the browser or network, try once without padding.
         A timeout or a server error is not retried. */
      if (err instanceof TypeError) body = await fetchRange(prefix, false, ctrl.signal);
      else throw err;
    }

    for (const line of body.split('\n')) {
      const [ending, count] = line.trim().split(':');
      if (ending === suffix) return parseInt(count, 10) || 0; /* padded decoys report 0 */
    }
    return 0;
  } finally {
    clearTimeout(timer);
  }
}

/* ─────────────────────────────────────────────
   UI
───────────────────────────────────────────── */

function updateButton() {
  els.check.disabled = busy || !els.consent.checked || !els.input.value;
}

function showResult(items, withCta = false) {
  els.feedback.replaceChildren(
    ...items.map(item => {
      const li = document.createElement('li');
      li.className = item.type;
      li.textContent = item.text;
      return li;
    })
  );
  els.cta.classList.toggle('hidden', !withCta);
  els.results.classList.remove('hidden');
}

function hideResult() {
  els.results.classList.add('hidden');
  els.cta.classList.add('hidden');
  els.feedback.replaceChildren();
}

/** Consent is needed again for every check */
function resetConsent() {
  els.consent.checked = false;
  els.box.textContent = '';
}

function foundItems(count) {
  const times = count.toLocaleString('en-AU');
  return [
    { type: 'bad',  text: `Found ${times} ${count === 1 ? 'time' : 'times'} in known data breaches. Attackers have lists of passwords like this, so it isn't safe to use.` },
    { type: 'warn', text: 'If you use it anywhere, change it there, and never reuse it on another account.' }
  ];
}

function notFoundItems() {
  return [
    { type: 'good', text: 'Not found in the breached passwords this service knows about.' },
    { type: 'tip',  text: 'That doesn\'t mean it\'s safe. Keep it unique, and test its strength too.' }
  ];
}

function errorItems(kind) {
  if (kind === 'unsupported') {
    return [{ type: 'warn', text: 'This browser can\'t run the check here. Try a recent version of Chrome, Edge, Firefox or Safari on a secure (https) page.' }];
  }
  return [
    { type: 'warn', text: 'The check couldn\'t be completed, so there is no result. This can happen if you are offline, or if a school or work network blocks the service. Try again later or on another network.' },
    { type: 'tip',  text: 'No result is not the same as "not found". Don\'t treat this password as checked.' }
  ];
}

async function runCheck() {
  if (busy) return;
  const pw = els.input.value;

  /* Both conditions are also enforced by the disabled button; check again for safety */
  if (!pw || !els.consent.checked) return;

  if (!(window.crypto && crypto.subtle)) {
    showResult(errorItems('unsupported'));
    return;
  }

  busy = true;
  els.check.textContent = 'Checking…';
  updateButton();
  hideResult();

  try {
    const count = await lookupCount(pw);
    showResult(count > 0 ? foundItems(count) : notFoundItems(), count > 0);
  } catch (err) {
    showResult(errorItems('network'));
  } finally {
    busy = false;
    els.check.textContent = CHECK_LABEL;
    resetConsent();      /* ask again next time */
    updateButton();
  }
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
  resetConsent();
  hideResult();
  updateButton();
  els.input.focus();
}

/* Nothing is checked as the person types: only the button starts a check */
els.input.addEventListener('input', () => { hideResult(); updateButton(); });
els.input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !els.check.disabled) { e.preventDefault(); runCheck(); }
});
els.consent.addEventListener('change', () => {
  els.box.textContent = els.consent.checked ? '✓' : '';
  updateButton();
});
els.check.addEventListener('click', runCheck);
els.toggle.addEventListener('click', toggleVisibility);
els.clear.addEventListener('click', clearAll);

/* Wipe the field when leaving the page or restoring it from the back/forward cache */
window.addEventListener('pagehide', () => { els.input.value = ''; });
window.addEventListener('pageshow', () => {
  els.input.value = '';
  resetConsent();
  hideResult();
  updateButton();
});

updateButton();
