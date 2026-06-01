<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PassCraft Education – Strong Passwords for Students</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <!-- Stylesheet -->
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<div class="wrapper">

  <!-- ══ HEADER ══ -->
  <header>
    <div class="logo-badge">
      <div class="logo-icon">🔐</div>
      <div class="logo-text">PassCraft <span>Education</span></div>
    </div>
    <h1>Create <em>Strong</em>, Memorable<br>Passwords &amp; Passphrases</h1>
    <p>A safe, student-friendly tool for learning how to craft secure credentials for your school accounts.</p>
  </header>

  <!-- ══ TAB BAR ══ -->
  <div class="tab-bar" role="tablist">
    <button class="tab-btn active" onclick="switchTab('password', this)"    role="tab">🔑 Password</button>
    <button class="tab-btn"        onclick="switchTab('passphrase', this)"  role="tab">💬 Passphrase</button>
    <button class="tab-btn"        onclick="switchTab('history', this)"     role="tab">📋 History</button>
    <button class="tab-btn"        onclick="switchTab('learn', this)"       role="tab">📚 Learn</button>
  </div>

  <!-- ══ MAIN CARD ══ -->
  <div class="card">

    <!-- ══════════════════════════════════════
         PASSWORD PANEL
    ═══════════════════════════════════════ -->
    <div class="panel active" id="panel-password">

      <div class="section-label">Choose a Password Pattern</div>

      <!--
        Four pattern cards — one per required formula.
        Selecting a card picks the matching word banks.
        All patterns always append:  Number + Special Character
      -->
      <div class="pattern-grid">

        <!-- Pattern 1: Word + Word + Number + Symbol -->
        <label class="pattern-card">
          <input type="radio" name="pw-pattern" value="word-word" />
          <div class="pattern-card-label">🔤 Word + Word</div>
          <div class="pattern-card-desc">e.g. BraveMountain47!</div>
        </label>

        <!-- Pattern 2: Adjective + Noun + Number + Symbol -->
        <label class="pattern-card">
          <input type="radio" name="pw-pattern" value="adj-noun" />
          <div class="pattern-card-label">✏️ Adjective + Noun</div>
          <div class="pattern-card-desc">e.g. CleverRocket83@</div>
        </label>

        <!-- Pattern 3: Animal + Food + Number + Symbol -->
        <label class="pattern-card">
          <input type="radio" name="pw-pattern" value="animal-food" />
          <div class="pattern-card-label">🐨 Animal + Food</div>
          <div class="pattern-card-desc">e.g. KoalaPizza29$</div>
        </label>

        <!-- Pattern 4: Colour + Animal + Number + Symbol -->
        <label class="pattern-card">
          <input type="radio" name="pw-pattern" value="colour-animal" />
          <div class="pattern-card-label">🎨 Colour + Animal</div>
          <div class="pattern-card-desc">e.g. BlueDingo47!</div>
        </label>

      </div><!-- /pattern-grid -->

      <!-- Formula hint — filled dynamically by JS after generation -->
      <div class="formula-row" id="pw-pattern-hint"></div>

      <div class="section-label" style="margin-top: 20px;">Generated Password</div>

      <div class="output-wrap">
        <div class="output-box" id="pw-output">Select a pattern above, then click Generate ✨</div>
        <button class="copy-btn" onclick="copyText('pw-output')" title="Copy password">📋</button>
      </div>

      <!-- Strength meter -->
      <div class="strength-row">
        <div class="strength-bars">
          <div class="bar" id="bar1"></div>
          <div class="bar" id="bar2"></div>
          <div class="bar" id="bar3"></div>
          <div class="bar" id="bar4"></div>
          <div class="bar" id="bar5"></div>
        </div>
        <div class="strength-label" id="strength-label" style="color: var(--text-light)">–</div>
      </div>

      <button class="generate-btn" onclick="generatePassword()">
        🎲 Generate Password
      </button>

      <button class="print-btn" onclick="printPassword('pw-output')">
        🖨️ Print Password Slip
      </button>

      <div class="tip-box">
        <strong>💡 How it works:</strong> Every password follows a
        <em>Word + Word + Number + Symbol</em> formula — easy to remember, but hard to guess.
        Words are randomly chosen from large lists each time you generate!
      </div>

    </div><!-- /panel-password -->

    <!-- ══════════════════════════════════════
         PASSPHRASE PANEL
    ═══════════════════════════════════════ -->
    <div class="panel" id="panel-passphrase">

      <div class="section-label">Generated Passphrase</div>

      <div class="output-wrap">
        <div class="output-box" id="pp-output">Click Generate to start ✨</div>
        <button class="copy-btn" onclick="copyText('pp-output')" title="Copy passphrase">📋</button>
      </div>

      <!-- Strength meter -->
      <div class="strength-row">
        <div class="strength-bars">
          <div class="bar" id="pp-bar1"></div>
          <div class="bar" id="pp-bar2"></div>
          <div class="bar" id="pp-bar3"></div>
          <div class="bar" id="pp-bar4"></div>
          <div class="bar" id="pp-bar5"></div>
        </div>
        <div class="strength-label" id="pp-strength-label" style="color: var(--text-light)">–</div>
      </div>

      <!-- Number of words slider -->
      <div class="word-count-row control-group">
        <label>Number of Words</label>
        <div class="slider-row">
          <input type="range" id="pp-words" min="3" max="6" value="3"
                 oninput="document.getElementById('pp-word-val').textContent = this.value" />
          <span class="range-val" id="pp-word-val">3</span>
        </div>
      </div>

      <!-- Separator + extras -->
      <div class="controls-grid" style="margin-top: 6px;">
        <div class="control-group">
          <label>Separator Style</label>
          <div class="checkbox-group">
            <label class="check-item">
              <input type="radio" name="sep" id="sep-cap"  value="cap"  checked style="display:none" />
              <span class="check-box" id="sepbox-cap"></span> CapitalWords
            </label>
            <label class="check-item">
              <input type="radio" name="sep" id="sep-dash" value="dash" style="display:none" />
              <span class="check-box" id="sepbox-dash"></span> word-dash
            </label>
            <label class="check-item">
              <input type="radio" name="sep" id="sep-dot"  value="dot"  style="display:none" />
              <span class="check-box" id="sepbox-dot"></span> word.dot
            </label>
          </div>
        </div>

        <div class="control-group">
          <label>Add Extras</label>
          <div class="checkbox-group">
            <label class="check-item">
              <input type="checkbox" id="pp-num" checked />
              <span class="check-box">✓</span> Append number (e.g. 47)
            </label>
            <label class="check-item">
              <input type="checkbox" id="pp-sym" checked />
              <span class="check-box">✓</span> Append symbol (e.g. !)
            </label>
          </div>
        </div>
      </div>

      <button class="generate-btn" onclick="generatePassphrase()">
        🌿 Generate Passphrase
      </button>

      <button class="print-btn" onclick="printPassword('pp-output')">
        🖨️ Print Password Slip
      </button>

      <div class="tip-box">
        <strong>💡 Example:</strong> <em>BlueDingo47!</em> or <em>CoralKoalaStorm83@</em> —
        easy to picture, hard to guess! Passphrases chain random words from all categories.
      </div>

    </div><!-- /panel-passphrase -->

    <!-- ══════════════════════════════════════
         HISTORY PANEL
    ═══════════════════════════════════════ -->
    <div class="panel" id="panel-history">

      <div class="section-label">Recent Generations</div>

      <div class="history-list" id="history-list">
        <div class="empty-history">
          Nothing generated yet.<br>
          Head to <strong>Password</strong> or <strong>Passphrase</strong> to get started!
        </div>
      </div>

      <br>
      <button class="generate-btn" onclick="clearHistory()"
              style="background: var(--text-light); margin-bottom: 0;">
        🗑️ Clear History
      </button>

    </div><!-- /panel-history -->

    <!-- ══════════════════════════════════════
         LEARN PANEL
    ═══════════════════════════════════════ -->
    <div class="panel" id="panel-learn">

      <div class="section-label">Password Safety Tips</div>

      <div class="tips-grid">

        <div class="tip-card">
          <div class="tip-card-icon">🚫</div>
          <h3>Never Use These</h3>
          <p>These are the most commonly guessed passwords — avoid them completely!</p>
          <div class="bad-list">
            <span class="bad-tag">password</span>
            <span class="bad-tag">123456</span>
            <span class="bad-tag">qwerty</span>
            <span class="bad-tag">abc123</span>
            <span class="bad-tag">monkey</span>
            <span class="bad-tag">letmein</span>
            <span class="bad-tag">iloveyou</span>
            <span class="bad-tag">admin</span>
          </div>
        </div>

        <div class="tip-card">
          <div class="tip-card-icon">✅</div>
          <h3>Great Examples</h3>
          <p>Memorable, colourful, and secure — one from each of the four patterns!</p>
          <div class="bad-list">
            <span class="good-tag">BraveMountain47!</span>
            <span class="good-tag">CleverRocket83@</span>
            <span class="good-tag">KoalaPizza29$</span>
            <span class="good-tag">BlueDingo47!</span>
          </div>
        </div>

        <div class="tip-card">
          <div class="tip-card-icon">🔁</div>
          <h3>Don't Reuse Passwords</h3>
          <p>If one account gets hacked and you reuse the same password, ALL your accounts are at risk. Use a unique password for each site or app.</p>
        </div>

        <div class="tip-card">
          <div class="tip-card-icon">🤫</div>
          <h3>Keep It Secret</h3>
          <p>Never share your password — not even with friends! Your teacher or school IT team will <em>never</em> ask for your password.</p>
        </div>

        <div class="tip-card">
          <div class="tip-card-icon">📏</div>
          <h3>Longer = Stronger</h3>
          <p>Every extra character makes your password exponentially harder to crack. PassCraft's patterns always produce passwords of <strong>12+ characters</strong>.</p>
        </div>

        <div class="tip-card">
          <div class="tip-card-icon">🎨</div>
          <h3>Make It Memorable</h3>
          <p>The <strong>Colour + Animal</strong> and <strong>Animal + Food</strong> patterns create a vivid mental image — like a picture in your head — that's easy to recall later!</p>
        </div>

      </div><!-- /tips-grid -->

      <div class="tip-box">
        <strong>🌐 Using PassCraft:</strong> This tool runs entirely in your browser —
        no passwords are stored, sent, or saved anywhere. It is completely private!
      </div>

    </div><!-- /panel-learn -->

  </div><!-- /card -->

  <!-- ══ FOOTER ══ -->
  <footer>
    <p>PassCraft Education &mdash; Helping students stay safe online 🌿</p>
    <p style="margin-top: 4px;">All generation happens locally in your browser. Nothing is stored or transmitted.</p>
  </footer>

<!-- ══ PRINT SLIP (hidden, print-only) ══ -->
<div id="print-slip" style="display:none;">
  <div style="
    font-family: 'Nunito', sans-serif;
    background: #fff;
    border: 2px solid #2d6a4f;
    border-radius: 14px;
    padding: 36px 44px;
    max-width: 460px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 24px rgba(0,0,0,.1);
  ">
    <!-- Logo row -->
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px;">
      <div style="
        background:#2d6a4f;color:#fff;border-radius:50%;
        width:40px;height:40px;display:flex;align-items:center;
        justify-content:center;font-size:20px;flex-shrink:0;
      ">🔐</div>
      <div style="font-size:1.1rem;font-weight:800;color:#2d6a4f;letter-spacing:.3px;">
        PassCraft <span style="color:#74c69d;">Education</span>
      </div>
    </div>

    <hr style="border:none;border-top:1.5px solid #ddd0b8;margin-bottom:22px;" />

    <p style="font-size:.85rem;font-weight:700;color:#6a8a77;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
      Password Change Notice
    </p>

    <p style="font-size:1rem;color:#3d5c4a;line-height:1.65;margin-bottom:20px;">
      Your password has been changed to:
    </p>

    <div style="
      background:#f0faf4;
      border:2px dashed #74c69d;
      border-radius:10px;
      padding:16px 20px;
      font-family:'Baloo 2',sans-serif;
      font-size:1.45rem;
      font-weight:800;
      color:#2d6a4f;
      letter-spacing:.5px;
      word-break:break-all;
      margin-bottom:22px;
    " id="print-pw-display"></div>

    <p style="font-size:.82rem;color:#6a8a77;line-height:1.6;margin-bottom:18px;">
      Keep this slip somewhere safe and secret.<br>
      <strong style="color:#2d6a4f;">Do not share your password</strong> with anyone,<br>
      including teachers or friends.
    </p>

    <hr style="border:none;border-top:1.5px solid #ddd0b8;margin-bottom:14px;" />

    <p style="font-size:.75rem;color:#aaa;margin:0;">
      Generated by PassCraft Education &mdash; <span id="print-date"></span>
    </p>
  </div>
</div>

</div><!-- /wrapper -->

<!-- Toast notification -->
<div class="toast" id="toast">Copied to clipboard! ✓</div>

<!-- Main script -->
<script src="script.js"></script>

</body>
</html>
