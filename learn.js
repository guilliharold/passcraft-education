/* ═══════════════════════════════════════════════
   PASSCRAFT EDUCATION — Learn page quiz
   learn.js

   "Which is stronger?": five rounds, two made-up example
   passwords each. Everything runs in the browser. Nothing is
   stored, logged or sent, so the score resets when the page
   is reloaded. The passwords below are examples only, and no
   one should use them for a real account.
═══════════════════════════════════════════════ */

/* "stronger" is the password that is harder to guess.
   Which side it appears on is shuffled every time. */
const ROUNDS = [
  {
    stronger: 'BlueDingo-Kettle-Rain',
    weaker:   'Summer2024!',
    why: 'A season, a year and a symbol is one of the most common patterns, so attackers try it early. Four unrelated words are longer and far harder to guess.'
  },
  {
    stronger: 'plum-tractor-lantern-seven',
    weaker:   'P@ssw0rd1!',
    why: 'Swapping @ for a and 0 for o is a well-known trick. Attackers already try these swaps, so this is still just the word "password".'
  },
  {
    stronger: 'lemon-train-ocean-paper',
    weaker:   'Sophie2010!',
    why: 'A first name and a year are easy to find or guess, especially a birth year. Random words that have nothing to do with you are much safer.'
  },
  {
    stronger: 'Mf7#kP2x',
    weaker:   'Qwerty123!',
    why: 'Keyboard runs and number sequences are some of the first things attackers try. Eight random characters is still on the short side, but it beats a pattern.'
  },
  {
    stronger: 'Rj6$tNc9',
    weaker:   'abcdabcdabcdabcd',
    why: 'Sixteen characters sounds long, but repeating a short chunk adds almost nothing. Length only helps when the characters are unpredictable.'
  },
  {
    stronger: 'tundra-pencil-harbour-lime',
    weaker:   'Collingwood!1',
    why: 'A favourite team is one of the first things someone would guess about you, and the number and symbol are tacked on in the usual spot. Random words you have no link to are far safer.'
  },
  {
    stronger: 'river-biscuit-moon-ladder',
    weaker:   'Welcome1!',
    why: 'Starter passwords like "Welcome1!" are what many schools and workplaces hand out, so attackers try them on everyone. Never keep a default or starter password.'
  },
  {
    stronger: 'red-door-moss-lamp-fern',
    weaker:   'red-door',
    why: 'Both use the same trick, but two common words are over quickly. Each extra random word makes a passphrase many times harder to guess, so aim for four or more.'
  },
  {
    stronger: 'oyster-ladder-comet-plum',
    weaker:   'Minecraft123!',
    why: 'A favourite game or show plus an easy number is a very common combination. Interests are easy to guess, so keep them out of your passwords.'
  },
  {
    stronger: 'Hb4$wX9qTm2#Lc7v',
    weaker:   'Hb4$wX9q',
    why: 'Both are random, but the longer one has eight more unpredictable characters. When a password is random, every extra character multiplies the work for an attacker.'
  }
];

/* Each play picks this many rounds from the list above */
const QUIZ_LENGTH = 5;

const root = document.getElementById('quiz');

if (root) {
  const state = { order: [], index: 0, score: 0, answered: false, seen: new Set() };

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */

  /* randInt() comes from shared.js, so the quiz uses the same fair random method as the Generator */

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Small element builder. Text is always set with textContent. */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function show(...nodes) {
    root.replaceChildren(...nodes);
  }

  /* ─────────────────────────────────────────────
     SCREENS
  ───────────────────────────────────────────── */

  function renderIntro() {
    const start = el('button', 'generate-btn', '▶️ Start the quiz');
    start.type = 'button';
    start.addEventListener('click', startQuiz);

    show(
      el('p', 'quiz-question', 'Which is stronger?'),
      el('p', 'quiz-intro', 'Five quick rounds. Pick the password that is harder to guess, then see why.'),
      start,
      el('p', 'quiz-note', 'These are made-up examples. Never use a password you see in a quiz.')
    );
  }

  function startQuiz() {
    /* Pick QUIZ_LENGTH rounds, using ones not yet seen this visit first,
       so a replay doesn't repeat questions until they have all been used. */
    const all    = ROUNDS.map((_, i) => i);
    const fresh  = shuffle(all.filter(i => !state.seen.has(i)));
    const reused = shuffle(all.filter(i =>  state.seen.has(i)));
    state.order  = shuffle(fresh.concat(reused).slice(0, QUIZ_LENGTH));
    if (fresh.length < QUIZ_LENGTH) state.seen.clear();   /* every round has been used: start a new cycle */
    state.order.forEach(i => state.seen.add(i));
    state.index = 0;
    state.score = 0;
    renderRound();
  }

  function renderRound() {
    state.answered = false;
    const round = ROUNDS[state.order[state.index]];

    /* Put the stronger password on a random side */
    const strongerFirst = randInt(2) === 0;
    const choices = strongerFirst
      ? [{ text: round.stronger, isStronger: true },  { text: round.weaker, isStronger: false }]
      : [{ text: round.weaker,   isStronger: false }, { text: round.stronger, isStronger: true }];

    const meta = el('div', 'quiz-meta');
    meta.append(
      el('span', '', `Question ${state.index + 1} of ${QUIZ_LENGTH}`),
      el('span', '', `Score: ${state.score}`)
    );

    const question = el('p', 'quiz-question', 'Which password is stronger?');
    question.tabIndex = -1;

    const options = el('div', 'quiz-options');
    const buttons = choices.map((choice, i) => {
      const btn = el('button', 'quiz-option');
      btn.type = 'button';
      btn.append(
        el('span', 'quiz-option-label', `Option ${i === 0 ? 'A' : 'B'}`),
        el('span', 'quiz-pw', choice.text),
        el('span', 'quiz-tag')
      );
      btn.addEventListener('click', () => answer(btn, choice, buttons, choices, round));
      options.append(btn);
      return btn;
    });

    /* Not a live region: focus moves here after an answer so it is read once */
    const feedback = el('div', 'quiz-feedback hidden');
    feedback.id = 'quiz-feedback';
    feedback.tabIndex = -1;

    const next = el('button', 'generate-btn hidden',
      state.index === QUIZ_LENGTH - 1 ? '🏁 See my score' : 'Next question');
    next.type = 'button';
    next.id = 'quiz-next';
    next.addEventListener('click', () => {
      state.index++;
      if (state.index < QUIZ_LENGTH) renderRound(); else renderResult();
    });

    show(meta, question, options, feedback, next);
    question.focus();
  }

  function answer(btn, choice, buttons, choices, round) {
    if (state.answered) return;
    state.answered = true;

    const correct = choice.isStronger;
    if (correct) state.score++;

    /* Mark both options with words as well as colour */
    buttons.forEach((b, i) => {
      const isStronger = choices[i].isStronger;
      b.classList.add(isStronger ? 'is-stronger' : 'is-weaker');
      if (b === btn) b.classList.add('is-chosen');
      b.setAttribute('aria-disabled', 'true');
      b.querySelector('.quiz-tag').textContent = isStronger ? '✓ Stronger' : '✗ Weaker';
    });

    const feedback = document.getElementById('quiz-feedback');
    feedback.className = 'quiz-feedback ' + (correct ? 'good' : 'bad');
    feedback.replaceChildren(
      el('strong', '', correct ? 'Correct! ' : 'Not quite. '),
      document.createTextNode(round.why)
    );

    document.getElementById('quiz-next').classList.remove('hidden');
    feedback.focus();
  }

  function renderResult() {
    const total = QUIZ_LENGTH;
    let message;
    if (state.score === total)        message = 'Perfect score! You can spot a strong password.';
    else if (state.score >= total - 2) message = 'Nice work! A couple of tricky ones, but you have the idea.';
    else                               message = 'Good start. Those patterns fool a lot of people, so now you know what to look for.';

    const heading = el('p', 'quiz-question', `You got ${state.score} out of ${total}`);
    heading.tabIndex = -1;

    const again = el('button', 'generate-btn', '🔄 Play again');
    again.type = 'button';
    again.addEventListener('click', startQuiz);

    const test = el('a', 'print-btn link-btn', '📊 Test a password in the Strength Indicator');
    test.href = 'strength-indicator.html';

    show(
      heading,
      el('p', 'quiz-intro', message),
      el('div', 'quiz-feedback good', 'Long and unpredictable beats short and clever. Patterns, names, years and look-alike swaps are the first things attackers try.'),
      again,
      test
    );
    heading.focus();
  }

  renderIntro();
}

/* ═══════════════════════════════════════════════
   "Reuse domino" demo (one password per account)

   Pretend one site is hacked, then see what happens to the
   others. Compare "same password everywhere" with "a different
   password for each". Made-up accounts and passwords only.
   Nothing is stored or sent. Remove this whole block, the
   #domino markup and the .domino styles to take the demo out.
═══════════════════════════════════════════════ */
(function initDomino() {
  const root = document.getElementById('domino');
  if (!root) return;

  const SAME_PW = 'P@ssw0rd123!';
  const ACCOUNTS = [
    { icon: '🎮', name: 'Gaming forum',  unique: 'MightyPuzzle60&' },
    { icon: '🎬', name: 'Streaming',     unique: 'AzureLlama48%' },
    { icon: '🏫', name: 'School login',  unique: 'JazzyBridge47#' },
    { icon: '✉️', name: 'Email',         unique: 'DenimHedgehog37*' }
  ];

  const STEP_MS = 900;
  const state = { mode: 'same', token: 0 };

  /* Small element builder. Text is always set with textContent. */
  function mk(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ── Build the demo ── */
  const intro  = mk('p', 'quiz-intro',
    'Pretend one of these sites has just been hacked. Choose a habit, then tap a site to see what the attacker can reach.');

  const modes = mk('div', 'domino-modes');
  modes.setAttribute('role', 'group');
  modes.setAttribute('aria-label', 'Password habit');
  const modeButtons = {
    same:   mk('button', 'domino-mode', 'Same password everywhere'),
    unique: mk('button', 'domino-mode', 'A different password for each')
  };
  Object.entries(modeButtons).forEach(([key, btn]) => {
    btn.type = 'button';
    btn.addEventListener('click', () => setMode(key));
    modes.append(btn);
  });

  const grid  = mk('div', 'domino-accounts');
  const cards = ACCOUNTS.map((acc, i) => {
    const btn = mk('button', 'domino-account');
    btn.type = 'button';
    btn.append(
      mk('span', 'domino-icon', acc.icon),
      mk('span', 'domino-name', acc.name),
      mk('span', 'domino-pw'),
      mk('span', 'domino-tag')
    );
    btn.addEventListener('click', () => leak(i));
    grid.append(btn);
    return btn;
  });

  const status = mk('p', 'domino-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const again = mk('button', 'print-btn', '🔄 Start over');
  again.type = 'button';
  again.addEventListener('click', resetCards);

  const note = mk('p', 'quiz-note', 'Made-up accounts and passwords, for illustration only.');

  root.replaceChildren(intro, modes, grid, status, again, note);

  /* ── Behaviour ── */
  function setCard(i, cls, tag) {
    cards[i].className = 'domino-account' + (cls ? ' ' + cls : '');
    cards[i].querySelector('.domino-tag').textContent = tag;
  }

  function resetCards() {
    state.token++;                       /* stops any run still in progress */
    ACCOUNTS.forEach((acc, i) => {
      setCard(i, '', 'Safe');
      cards[i].querySelector('.domino-pw').textContent =
        state.mode === 'same' ? SAME_PW : acc.unique;
    });
    status.textContent = 'Tap a site to pretend it was hacked.';
  }

  function setMode(mode) {
    state.mode = mode;
    Object.entries(modeButtons).forEach(([key, btn]) =>
      btn.setAttribute('aria-pressed', String(key === mode)));
    resetCards();
  }

  async function leak(i) {
    const run  = ++state.token;
    const wait = prefersReducedMotion() ? 0 : STEP_MS;

    /* Clear any earlier run, then mark the hacked site */
    ACCOUNTS.forEach((_, j) => setCard(j, '', 'Safe'));
    setCard(i, 'is-leaked', 'Hacked');
    status.textContent =
      `${ACCOUNTS[i].name} was hacked. The attacker now tries that same password on your other accounts.`;
    await sleep(wait);

    for (let j = 0; j < ACCOUNTS.length; j++) {
      if (j === i) continue;
      if (run !== state.token) return;
      setCard(j, 'is-trying', 'Attacker trying…');
      await sleep(wait);
      if (run !== state.token) return;
      if (state.mode === 'same') {
        setCard(j, 'is-compromised', 'Compromised');
      } else {
        setCard(j, 'is-safe', 'Still safe');
      }
    }

    status.textContent = state.mode === 'same'
      ? `One hack opened all ${ACCOUNTS.length} accounts, because they share a password. Try the other habit to compare.`
      : `Only ${ACCOUNTS[i].name} was affected. The leaked password failed everywhere else. A password manager makes this easy to keep up, and MFA adds a second lock.`;
  }

  setMode('same');
})();

/* ═══════════════════════════════════════════════
   Tips accordion: only one tip open at a time

   Modern browsers do this on their own because every tip shares
   name="tips" in learn.html. This block does the same for older
   browsers that ignore that attribute. It is harmless in the
   newer ones. Nothing is stored or sent.
═══════════════════════════════════════════════ */
(function initTipsAccordion() {
  const tips = Array.from(document.querySelectorAll('details.tip-item'));
  tips.forEach(tip => {
    tip.addEventListener('toggle', () => {
      if (!tip.open) return;
      tips.forEach(other => { if (other !== tip) other.open = false; });
    });
  });
})();
