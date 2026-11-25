/* PASSCRAFT EDUCATION: shared site script (site.js)
   Keeps the footer copyright year current on every page. */
(function () {
  var el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* Tip boxes: text marked data-tip-more is tucked behind an inline "Read more"
   button at the end of the sentence. Without JavaScript it just shows in full. */
(function () {
  document.querySelectorAll('[data-tip-more]').forEach(function (extra, i) {
    extra.id = 'tip-more-' + i;
    extra.hidden = true;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tip-more-btn';
    btn.textContent = 'Read more';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', extra.id);
    btn.addEventListener('click', function () {
      var opening = extra.hidden;
      extra.hidden = !opening;
      btn.textContent = opening ? 'Show less' : 'Read more';
      btn.setAttribute('aria-expanded', String(opening));
    });

    extra.after(document.createTextNode(' '), btn);
  });
})();
