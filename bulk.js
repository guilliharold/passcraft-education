/* ═══════════════════════════════════════════════
   PASSCRAFT EDUCATION — Bulk Passwords
   bulk.js

   Choose a .csv or .xlsx file that has a column titled "Password".
   The tool fills that column with generated passwords and lets you
   download the result. Everything runs in the browser. The file is
   never uploaded, stored or sent anywhere.

   Needs, loaded BEFORE this file:
     shared.js, script.js            (word banks, randInt, pick, titleCase ...)
     assets/vendor/read-excel-file/read-excel-file.min.js    -> readXlsxFile()
     assets/vendor/write-excel-file/write-excel-file.min.js   -> writeXlsxFile()
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const MAX_BYTES    = 5 * 1024 * 1024;   /* 5 MB */
  const MAX_ROWS     = 5000;              /* people per file */
  const HEADER_SCAN  = 10;                /* how many top rows to search for the Password header */
  const TARGET       = 'password';        /* matched ignoring case and surrounding spaces */
  const PAGE_SIZE    = 10;                /* people shown per page of the preview */
  const MASK         = '••••••••';

  /* ─────────────────────────────────────────────
     CSV (no library needed)
  ───────────────────────────────────────────── */

  /** Guess the separator from the first line: comma, semicolon or tab */
  function sniffDelimiter(text) {
    const counts = { ',': 0, ';': 0, '\t': 0 };
    let inQuotes = false;
    for (const ch of text) {
      if (ch === '"') inQuotes = !inQuotes;
      else if (!inQuotes && (ch === '\n' || ch === '\r')) break;
      else if (!inQuotes && ch in counts) counts[ch]++;
    }
    return Object.keys(counts).reduce((best, d) => (counts[d] > counts[best] ? d : best), ',');
  }

  /** Text -> array of rows (arrays of strings). Handles quotes, doubled quotes and line breaks inside quotes. */
  function parseCsv(text, d) {
    const rows = [];
    let row = [], field = '', inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else if (c === '"' && field === '') {
        inQuotes = true;
      } else if (c === d) {
        row.push(field); field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); rows.push(row);
        row = []; field = '';
      } else field += c;
    }

    if (inQuotes) throw new Error('A quoted value in this CSV never closes, so the file may be damaged.');
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function isoDate(v) {
    const hasTime = v.getUTCHours() || v.getUTCMinutes() || v.getUTCSeconds();
    return hasTime ? v.toISOString().slice(0, 16).replace('T', ' ') : v.toISOString().slice(0, 10);
  }

  function cellText(v) {
    if (v == null) return '';
    if (v instanceof Date) return isoDate(v);
    return String(v);
  }

  /** Rows -> CSV text */
  function toCsv(rows, d) {
    const esc = v => {
      const s = cellText(v);
      return (s.includes(d) || /["\r\n]/.test(s) || /^\s|\s$/.test(s))
        ? '"' + s.replace(/"/g, '""') + '"'
        : s;
    };
    return rows.map(r => r.map(esc).join(d)).join('\r\n') + '\r\n';
  }

  /* ─────────────────────────────────────────────
     FINDING THE COLUMN AND FILLING IT
  ───────────────────────────────────────────── */

  function isBlank(v) {
    return v == null || (typeof v === 'string' && v.trim() === '');
  }

  /** Look in the first few rows for a cell titled "Password". Returns { headerRow, col, duplicates } or null. */
  function locate(rows) {
    const limit = Math.min(rows.length, HEADER_SCAN);
    for (let r = 0; r < limit; r++) {
      const cols = [];
      rows[r].forEach((c, i) => {
        if (typeof c === 'string' && c.trim().toLowerCase() === TARGET) cols.push(i);
      });
      if (cols.length) return { headerRow: r, col: cols[0], duplicates: cols.length > 1 };
    }
    return null;
  }

  /** Row numbers (0-based) of people: every non-empty row below the header */
  function personRows(rows, loc) {
    const out = [];
    for (let r = loc.headerRow + 1; r < rows.length; r++) {
      if (!rows[r].every(isBlank)) out.push(r);
    }
    return out;
  }

  /* Random characters: same look-alike-free sets as the Generator (no 0/O, 1/l/I) */
  const RANDOM_LENGTH = 12;
  const RANDOM_SETS = [
    'ABCDEFGHJKLMNPQRSTUVWXYZ',
    'abcdefghijkmnpqrstuvwxyz',
    '23456789',
    '!@#$%&*?'
  ];

  function randomPassword() {
    const all = RANDOM_SETS.join('');
    /* One from each set guarantees every character type, then fill the rest from all sets */
    const chars = RANDOM_SETS.map(set => set[randInt(set.length)]);
    while (chars.length < RANDOM_LENGTH) chars.push(all[randInt(all.length)]);
    /* Shuffle so the guaranteed characters aren't always in the first four places */
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  }

  /** One password-making function for the chosen style */
  function makers(format) {
    if (format === 'random') return randomPassword;
    if (format === 'passphrase') {
      return () => Array.from({ length: 4 }, () => pick(ALL_WORDS).toLowerCase()).join('-')
        + randTwoDigit() + pick(CHARS.sym);
    }
    const pattern = PATTERNS.find(p => p.id === format);
    if (!pattern) throw new Error('Unknown password style.');
    return () => pattern.banks.map(b => titleCase(pick(BANK_MAP[b]))).join('')
      + randTwoDigit() + pick(CHARS.sym);
  }

  /**
   * Returns a NEW array of rows with the Password column filled.
   * Every password in the batch is different from every other one.
   */
  function fill(rows, loc, make, overwrite) {
    const width = rows.reduce((m, r) => Math.max(m, r.length), loc.col + 1);
    const out = rows.map(r => {
      const copy = r.slice();
      while (copy.length < width) copy.push(null);
      return copy;
    });

    const people = personRows(out, loc);
    const used = new Set();
    if (!overwrite) {
      people.forEach(r => { if (!isBlank(out[r][loc.col])) used.add(String(out[r][loc.col])); });
    }

    let filled = 0, kept = 0;
    for (const r of people) {
      if (!isBlank(out[r][loc.col]) && !overwrite) { kept++; continue; }
      let pw, tries = 0;
      do {
        pw = make();
        if (++tries > 500) throw new Error('Could not make enough different passwords. Try the passphrase style.');
      } while (used.has(pw));
      used.add(pw);
      out[r][loc.col] = pw;
      filled++;
    }
    return { rows: out, people: people.length, filled, kept };
  }

  /* ─────────────────────────────────────────────
     TEST HOOK (only when a test sets the flag first)
  ───────────────────────────────────────────── */
  if (typeof window !== 'undefined' && window.__PASSCRAFT_TEST__) {
    window.PassCraftBulk = { sniffDelimiter, parseCsv, toCsv, locate, personRows, makers, fill };
  }

  const root = document.getElementById('bk-root');
  if (!root) return;

  /* ─────────────────────────────────────────────
     STATE + ELEMENTS
  ───────────────────────────────────────────── */

  const els = {
    file:      document.getElementById('bk-file'),
    sheetRow:  document.getElementById('bk-sheet-row'),
    sheet:     document.getElementById('bk-sheet'),
    status:    document.getElementById('bk-status'),
    options:   document.getElementById('bk-options'),
    formats:   document.getElementById('bk-formats'),
    overwrite: document.getElementById('bk-overwrite'),
    owBox:     document.getElementById('bk-overwrite-box'),
    generate:  document.getElementById('bk-generate'),
    result:    document.getElementById('bk-result'),
    summary:   document.getElementById('bk-summary'),
    table:     document.getElementById('bk-table'),
    pager:     document.getElementById('bk-pager'),
    prev:      document.getElementById('bk-prev'),
    next:      document.getElementById('bk-next'),
    pageInfo:  document.getElementById('bk-page-info'),
    reveal:    document.getElementById('bk-reveal'),
    revBox:    document.getElementById('bk-reveal-box'),
    dlMain:    document.getElementById('bk-dl-main'),
    dlAlt:     document.getElementById('bk-dl-alt'),
    clear:     document.getElementById('bk-clear')
  };

  const GENERATE_LABEL = els.generate.textContent;

  const FORMATS = PATTERNS
    .map(p => ({ id: p.id, label: p.label }))
    .concat([
      { id: 'passphrase', label: '💬 4-word passphrase' },
      { id: 'random',     label: '🎲 12 random characters' }
    ]);

  /* "format" is the chosen password style. fresh() leaves it out, so clearing a file keeps the style. */
  const state = Object.assign(fresh(), { format: FORMATS[0].id });

  function fresh() {
    return {
      kind: null,        /* 'csv' or 'xlsx' */
      baseName: 'passwords',
      sheets: [],        /* [{ name, rows }] */
      sheetIndex: 0,
      delim: ',',
      bom: false,
      loc: null,
      result: null,
      page: 0            /* current page of the preview (0-based) */
    };
  }

  /* ─────────────────────────────────────────────
     SMALL HELPERS
  ───────────────────────────────────────────── */

  function show(node, on) { node.classList.toggle('hidden', !on); }

  function colLetter(i) {
    let s = '';
    for (i++; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
    return s;
  }

  function setStatus(items) {
    els.status.replaceChildren(...items.map(item => {
      const li = document.createElement('li');
      li.className = item.type;
      li.textContent = item.text;
      return li;
    }));
  }

  function currentRows() { return state.sheets[state.sheetIndex].rows; }

  function setBusy(on) {
    els.generate.disabled = on || !state.loc;
    els.generate.textContent = on ? 'Working…' : GENERATE_LABEL;
  }

  function resetResult() {
    state.result = null;
    state.page = 0;
    show(els.result, false);
    show(els.pager, false);
    els.table.replaceChildren();
    els.reveal.checked = false;
    els.revBox.textContent = '';
  }

  /* ─────────────────────────────────────────────
     LOADING A FILE
  ───────────────────────────────────────────── */

  async function loadFile(file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();

    if (file.size > MAX_BYTES) throw new Error('This file is over 5 MB. Split it into smaller files.');
    if (ext === 'xls') throw new Error('Old .xls files are not supported. In Excel, choose Save As and pick .xlsx or .csv.');
    if (ext !== 'csv' && ext !== 'xlsx') throw new Error('Please choose a .csv or .xlsx file.');

    const next = fresh();
    next.baseName = file.name.replace(/\.[^.]+$/, '') || 'passwords';

    if (ext === 'csv') {
      let text = await file.text();
      next.bom = text.charCodeAt(0) === 0xFEFF;
      if (next.bom) text = text.slice(1);
      next.kind  = 'csv';
      next.delim = sniffDelimiter(text);
      next.sheets = [{ name: 'CSV', rows: parseCsv(text, next.delim) }];
    } else {
      if (typeof readXlsxFile !== 'function') throw new Error('The spreadsheet reader did not load. Check your connection and reload the page.');
      next.kind = 'xlsx';
      const sheets = await readXlsxFile(file);
      next.sheets = sheets.map(s => ({ name: s.sheet, rows: s.data }));
    }

    Object.assign(state, next);
  }

  /* ─────────────────────────────────────────────
     ANALYSE THE CHOSEN SHEET
  ───────────────────────────────────────────── */

  function analyse() {
    resetResult();
    const rows = currentRows();
    state.loc = locate(rows);

    if (!rows.length || rows.every(r => r.every(isBlank))) {
      state.loc = null;
      setStatus([{ type: 'bad', text: 'This file looks empty.' }]);
    } else if (!state.loc) {
      const headers = (rows.find(r => !r.every(isBlank)) || [])
        .map(cellText).filter(h => h.trim() !== '').slice(0, 10);
      setStatus([
        { type: 'bad', text: 'Could not find a column titled "Password" in the first ' + HEADER_SCAN + ' rows.' },
        { type: 'tip', text: headers.length
            ? 'The first row has: ' + headers.join(', ') + '. Add a column titled Password, then choose the file again.'
            : 'Add a column titled Password, then choose the file again.' }
      ]);
    } else {
      const people = personRows(rows, state.loc);
      const existing = people.filter(r => !isBlank(rows[r][state.loc.col])).length;
      const items = [];

      if (people.length > MAX_ROWS) {
        state.loc = null;
        items.push({ type: 'bad', text: `This file has ${people.length.toLocaleString('en-AU')} people. The limit is ${MAX_ROWS.toLocaleString('en-AU')} per file.` });
      } else if (people.length === 0) {
        state.loc = null;
        items.push({ type: 'warn', text: 'Found the Password column, but there are no rows below it.' });
      } else {
        items.push({ type: 'good', text:
          `Found the Password column (column ${colLetter(state.loc.col)}) and ${people.length.toLocaleString('en-AU')} ${people.length === 1 ? 'person' : 'people'}.` });
        if (existing) {
          items.push({ type: 'warn', text:
            `${existing.toLocaleString('en-AU')} already ${existing === 1 ? 'has' : 'have'} something in the Password column. These are left alone unless you tick "Replace existing passwords".` });
        }
        if (state.loc.duplicates) {
          items.push({ type: 'warn', text: 'More than one column is titled Password. Only the first one will be filled.' });
        }
        if (state.loc.headerRow > 0) {
          items.push({ type: 'tip', text: `The header is on row ${state.loc.headerRow + 1}. Rows above it are kept as they are.` });
        }
      }
      setStatus(items);
    }

    show(els.options, !!state.loc);
    setBusy(false);
  }

  /* ─────────────────────────────────────────────
     PREVIEW
  ───────────────────────────────────────────── */

  function renderPreview() {
    const r = state.result;
    const rows = r.rows;
    const head = rows[state.loc.headerRow];
    const everyone = personRows(rows, state.loc);
    const pages = Math.max(1, Math.ceil(everyone.length / PAGE_SIZE));
    state.page = Math.min(Math.max(state.page, 0), pages - 1);
    const start = state.page * PAGE_SIZE;
    const people = everyone.slice(start, start + PAGE_SIZE);
    const reveal = els.reveal.checked;

    const thead = document.createElement('thead');
    const hr = document.createElement('tr');
    head.forEach((h, i) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = cellText(h) || colLetter(i);
      if (i === state.loc.col) th.className = 'bulk-pw-col';
      hr.append(th);
    });
    thead.append(hr);

    const tbody = document.createElement('tbody');
    people.forEach(ri => {
      const tr = document.createElement('tr');
      rows[ri].forEach((v, i) => {
        const td = document.createElement('td');
        td.textContent = (i === state.loc.col && !isBlank(v) && !reveal) ? MASK : cellText(v);
        if (i === state.loc.col) td.className = 'bulk-pw-col';
        tr.append(td);
      });
      tbody.append(tr);
    });

    els.table.replaceChildren(thead, tbody);

    /* Page controls only appear when there is more than one page */
    show(els.pager, pages > 1);
    els.prev.disabled = state.page === 0;
    els.next.disabled = state.page === pages - 1;
    els.pageInfo.textContent =
      `Showing ${(start + 1).toLocaleString('en-AU')}\u2013${(start + people.length).toLocaleString('en-AU')} of ${everyone.length.toLocaleString('en-AU')}`
      + ` (page ${state.page + 1} of ${pages})`;
  }

  /** Move the preview by one page. Focus is passed on if the pressed button has just been disabled. */
  function turnPage(step, pressed, other) {
    if (!state.result) return;
    state.page += step;
    renderPreview();
    if (pressed.disabled) other.focus();
  }

  /* ─────────────────────────────────────────────
     GENERATE
  ───────────────────────────────────────────── */

  function generate() {
    if (!state.loc) return;
    setBusy(true);
    try {
      state.result = fill(currentRows(), state.loc, makers(state.format), els.overwrite.checked);
      const r = state.result;

      const parts = [`Made ${r.filled.toLocaleString('en-AU')} ${r.filled === 1 ? 'password' : 'passwords'}, all different.`];
      if (r.kept) parts.push(`${r.kept.toLocaleString('en-AU')} existing ${r.kept === 1 ? 'password was' : 'passwords were'} kept.`);
      parts.push(`Previewing ${r.people.toLocaleString('en-AU')} ${r.people === 1 ? 'person' : 'people'}, ${PAGE_SIZE} at a time.`);
      els.summary.textContent = parts.join(' ');

      /* The main button matches the file that was chosen; the other format is a small link */
      const other = state.kind === 'xlsx' ? 'csv' : 'xlsx';
      els.dlMain.textContent = '⬇️ Download .' + state.kind;
      els.dlAlt.textContent  = 'Need a .' + other + ' instead?';

      state.page = 0;
      renderPreview();
      show(els.result, true);
    } catch (err) {
      resetResult();
      setStatus([{ type: 'bad', text: err.message || 'Something went wrong while making the passwords.' }]);
    } finally {
      setBusy(false);
    }
  }

  /* ─────────────────────────────────────────────
     DOWNLOAD
  ───────────────────────────────────────────── */

  function saveBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  /* Local date, e.g. 2026-11-23 */
  function stamp(d = new Date()) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  /* Tidy the uploaded file's name, and drop any suffix a previous export added */
  function safeBase(name) {
    const cleaned = name
      .replace(/\s+with passwords \d{4}-\d{2}-\d{2}( \d{4}( [AP]M)?)?$/i, '')   /* also strips older exports that had a time */
      .replace(/-with-passwords$/i, '')
      .replace(/[\\/:*?"<>|\x00-\x1F]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 60)
      .replace(/^[.\s]+|[.\s]+$/g, '');
    return cleaned || 'Export';
  }

  /* e.g. "Year 9 class list with Passwords 2026-11-23.csv" */
  function outName(ext) { return safeBase(state.baseName) + ' with Passwords ' + stamp() + '.' + ext; }

  function downloadCsv() {
    if (!state.result) return;
    const d = state.kind === 'csv' ? state.delim : ',';
    const text = toCsv(state.result.rows, d);
    /* A byte-order mark helps Excel read names with accents correctly */
    const bom = state.bom || /[^\x00-\x7F]/.test(text);
    saveBlob(new Blob([bom ? '\uFEFF' + text : text], { type: 'text/csv;charset=utf-8' }), outName('csv'));
  }

  async function downloadXlsx() {
    if (!state.result) return;
    if (typeof writeXlsxFile !== 'function') {
      setStatus([{ type: 'bad', text: 'The spreadsheet writer did not load. Check your connection and reload the page.' }]);
      return;
    }
    try {
      const rows = state.result.rows;
      const widths = [];
      const data = rows.map((r, ri) => r.map((v, ci) => {
        const len = cellText(v).length;
        widths[ci] = Math.max(widths[ci] || 10, Math.min(len + 2, 50));
        if (isBlank(v)) return null;
        if (v instanceof Date) {
          const hasTime = v.getUTCHours() || v.getUTCMinutes() || v.getUTCSeconds();
          return { value: v, type: Date, format: hasTime ? 'yyyy-mm-dd hh:mm' : 'yyyy-mm-dd' };
        }
        if (ri === state.loc.headerRow) return { value: String(v), fontWeight: 'bold' };
        return v;
      }));
      const blob = await writeXlsxFile(data, { columns: widths.map(w => ({ width: w })) }).toBlob();
      saveBlob(blob, outName('xlsx'));
    } catch (err) {
      setStatus([{ type: 'bad', text: 'Could not create the .xlsx file. Try the .csv download instead.' }]);
    }
  }

  /* ─────────────────────────────────────────────
     WIRING
  ───────────────────────────────────────────── */

  function renderFormats() {
    els.formats.replaceChildren(...FORMATS.map(f => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'domino-mode';
      btn.textContent = f.label;
      btn.setAttribute('aria-pressed', String(f.id === state.format));
      btn.addEventListener('click', () => {
        state.format = f.id;
        els.formats.querySelectorAll('button').forEach((b, i) =>
          b.setAttribute('aria-pressed', String(FORMATS[i].id === f.id)));
        resetResult();   /* a new style means the old preview no longer matches */
      });
      return btn;
    }));
  }

  function wipe() {
    Object.assign(state, fresh());
    els.file.value = '';
    els.overwrite.checked = false;
    els.owBox.textContent = '';
    els.status.replaceChildren();
    els.sheet.replaceChildren();
    show(els.sheetRow, false);
    show(els.options, false);
    resetResult();
  }

  els.file.addEventListener('change', async () => {
    const file = els.file.files[0];
    if (!file) return;
    resetResult();
    show(els.options, false);
    try {
      await loadFile(file);

      els.sheet.replaceChildren(...state.sheets.map((s, i) => {
        const o = document.createElement('option');
        o.value = String(i);
        o.textContent = s.name;
        return o;
      }));
      show(els.sheetRow, state.sheets.length > 1);
      analyse();
    } catch (err) {
      state.loc = null;
      show(els.sheetRow, false);
      setStatus([{ type: 'bad', text: err.message || 'This file could not be read.' }]);
    }
  });

  els.sheet.addEventListener('change', () => {
    state.sheetIndex = parseInt(els.sheet.value, 10) || 0;
    analyse();
  });

  els.overwrite.addEventListener('change', () => {
    els.owBox.textContent = els.overwrite.checked ? '✓' : '';
    resetResult();
  });

  els.reveal.addEventListener('change', () => {
    els.revBox.textContent = els.reveal.checked ? '✓' : '';
    if (state.result) renderPreview();
  });

  els.generate.addEventListener('click', generate);
  els.prev.addEventListener('click', () => turnPage(-1, els.prev, els.next));
  els.next.addEventListener('click', () => turnPage(1, els.next, els.prev));
  const download = kind => (kind === 'xlsx' ? downloadXlsx() : downloadCsv());
  els.dlMain.addEventListener('click', () => download(state.kind));
  els.dlAlt.addEventListener('click',  () => download(state.kind === 'xlsx' ? 'csv' : 'xlsx'));
  els.clear.addEventListener('click', wipe);

  /* Drop the data when leaving the page or restoring it from the back/forward cache */
  window.addEventListener('pagehide', wipe);
  window.addEventListener('pageshow', wipe);

  renderFormats();
  wipe();
})();
