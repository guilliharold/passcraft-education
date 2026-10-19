/* ═══════════════════════════════════════════════
   PASSCRAFT — Bulk generator
   bulk.js  (requires SheetJS and core.js)
═══════════════════════════════════════════════ */

let sheetRows  = [];     // array of row objects from the first sheet
let sheetName  = '';
let baseName   = '';
let isCsv      = false;
let pwHeader   = '';     // actual header text of the Password column

const fileInput = document.getElementById('bulk-file');
const genBtn    = document.getElementById('bulk-generate');
const statusBox = document.getElementById('bulk-status');
const previewEl = document.getElementById('bulk-preview');

/* ── helpers ── */
function setStatus(msg) {
  statusBox.style.display = 'block';
  statusBox.textContent = msg;
}

function setReady(ready) {
  genBtn.disabled = !ready;
  genBtn.style.opacity = ready ? '1' : '.55';
  genBtn.style.cursor  = ready ? 'pointer' : 'not-allowed';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderPreview(rows, limit = 5) {
  if (!rows.length) { previewEl.style.display = 'none'; return; }
  const cols = Object.keys(rows[0]);
  const head = cols.map(c => `<th style="text-align:left;padding:6px 10px;border-bottom:2px solid var(--cream-border);font-size:.8rem;color:var(--green-mid);">${esc(c)}</th>`).join('');
  const body = rows.slice(0, limit).map(r =>
    '<tr>' + cols.map(c => `<td style="padding:6px 10px;border-bottom:1px solid var(--cream-dark);font-size:.85rem;">${esc(r[c])}</td>`).join('') + '</tr>'
  ).join('');
  const more = rows.length > limit
    ? `<p style="font-size:.78rem;color:var(--text-light);margin-top:6px;">Showing first ${limit} of ${rows.length} rows.</p>` : '';
  previewEl.innerHTML = `<table style="border-collapse:collapse;width:100%;"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>${more}`;
  previewEl.style.display = 'block';
}

/* ── pattern card highlighting ── */
document.querySelectorAll('input[name=bulk-pattern]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.pattern-card').forEach(c => c.classList.remove('selected'));
    radio.closest('.pattern-card').classList.add('selected');
  });
});

/* ── file upload ── */
fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  setReady(false);
  previewEl.style.display = 'none';
  if (!file) return;

  isCsv    = /\.csv$/i.test(file.name);
  baseName = file.name.replace(/\.[^.]+$/, '');

  try {
    const data = await file.arrayBuffer();
    const wb   = XLSX.read(data, { type: 'array' });
    sheetName  = wb.SheetNames[0];
    sheetRows  = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });

    if (sheetRows.length === 0) {
      return setStatus('No data rows found. Make sure the first row is headings and there is at least one row beneath it.');
    }

    pwHeader = Object.keys(sheetRows[0]).find(h => h.trim().toLowerCase() === 'password');
    if (!pwHeader) {
      return setStatus('No column titled "Password" was found. Add one (the heading can be in any case) and upload again.');
    }

    const filled = sheetRows.filter(r => String(r[pwHeader]).trim() !== '').length;
    setStatus(
      `Found ${sheetRows.length} rows and a "${pwHeader}" column.` +
      (filled ? ` ⚠️ ${filled} row(s) already contain a password and will be overwritten.` : ' Ready to generate.')
    );
    renderPreview(sheetRows);
    setReady(true);
  } catch (err) {
    console.error(err);
    setStatus('Could not read that file. Please upload a valid .xlsx, .xls or .csv file.');
  }
});

/* ── generate & download ── */
genBtn.addEventListener('click', () => {
  if (!sheetRows.length) return;

  const filled = sheetRows.filter(r => String(r[pwHeader]).trim() !== '').length;
  if (filled && !confirm(`${filled} row(s) already have a password. Overwrite them all?`)) return;

  const patternId = document.querySelector('input[name=bulk-pattern]:checked').value;
  const used = new Set();

  sheetRows.forEach(row => {
    let pw;
    do { pw = buildPassword(patternId); } while (used.has(pw));
    used.add(pw);
    row[pwHeader] = pw;
  });

  const ws = XLSX.utils.json_to_sheet(sheetRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');

  const outName = `${baseName}-with-passwords.${isCsv ? 'csv' : 'xlsx'}`;
  XLSX.writeFile(wb, outName, { bookType: isCsv ? 'csv' : 'xlsx' });

  renderPreview(sheetRows);
  setStatus(`Done! ${sheetRows.length} unique passwords generated. Downloaded as ${outName}.`);
  showToast('Passwords generated ✓');
});
