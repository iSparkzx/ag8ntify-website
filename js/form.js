/* ============================================================
   AG8NTIFY — Multi-step qualifier + live feed
   ============================================================ */
(function () {
  'use strict';
  var A = window.AG8 || {};

  /* ===================== LIVE FEED ===================== */
  (function feed() {
    var body = document.getElementById('termBody');
    if (!body || !A.feed) return;
    var idx = 0, max = 6;
    function line(item) {
      var d = document.createElement('div');
      d.className = 'term-line';
      var now = new Date();
      var ts = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);
      d.innerHTML = '<span class="ts">' + ts + '</span>' +
        '<span class="atag ' + item.tag + '">' + item.tt + '</span>' +
        '<span class="msg"><b>' + item.b + '</b> <span class="dim">' + item.dim + '</span></span>';
      return d;
    }
    function push() {
      var item = A.feed[idx % A.feed.length];
      idx++;
      body.appendChild(line(item));
      while (body.children.length > max) body.removeChild(body.firstChild);
    }
    // seed
    for (var i = 0; i < 5; i++) push();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      setInterval(push, 2600);
    }
  })();

  /* ===================== QUALIFIER FORM ===================== */
  (function qual() {
    var root = document.getElementById('qual');
    if (!root) return;
    var steps = [].slice.call(root.querySelectorAll('.qual-step'));
    var done = document.getElementById('qualDone');
    var prog = document.getElementById('qualProg');
    var fills = [].slice.call(prog.querySelectorAll('.qpf'));
    var stepN = document.getElementById('qualStepN');
    var cur = 0;
    var answers = {};

    function setStep(n) {
      cur = n;
      steps.forEach(function (s, i) { s.classList.toggle('active', i === n); });
      fills.forEach(function (f, i) { f.style.width = i <= n ? '100%' : '0%'; });
      stepN.textContent = 'Step ' + (n + 1) + ' of ' + steps.length;
    }

    // option selection — groups marked [data-multi] allow several picks,
    // others stay single-select. answers[q] is an array for multi groups,
    // a string for single ones.
    root.querySelectorAll('.qopts').forEach(function (group) {
      var multi = group.hasAttribute('data-multi');
      var q = group.getAttribute('data-q');
      group.addEventListener('click', function (e) {
        var b = e.target.closest('.qopt'); if (!b) return;
        if (multi) { b.classList.toggle('sel'); }
        else { [].forEach.call(group.children, function (c) { c.classList.toggle('sel', c === b); }); }
        var sel = [].map.call(group.querySelectorAll('.qopt.sel'), function (c) {
          return c.textContent.replace(/✓/g, '').replace(/\s+/g, ' ').trim();
        });
        answers[q] = multi ? sel : (sel[0] || '');
      });
    });

    function answered(v) { return Array.isArray(v) ? v.length > 0 : !!v; }
    function validate(n) {
      if (n === 0) return answered(answers.bottleneck);
      if (n === 1) return answered(answers.size);
      return true;
    }
    function nudge() {
      var active = steps[cur];
      active.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }], { duration: 300 });
    }

    root.querySelectorAll('[data-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!validate(cur)) { nudge(); return; }
        setStep(Math.min(cur + 1, steps.length - 1));
      });
    });
    root.querySelectorAll('[data-back]').forEach(function (btn) {
      btn.addEventListener('click', function () { setStep(Math.max(cur - 1, 0)); });
    });

    var submit = root.querySelector('[data-submit]');
    submit.addEventListener('click', function () {
      // final step needs a team-size answer before handing off
      if (!validate(cur)) { nudge(); return; }
      try { console.log('[AG8NTIFY qualifier]', answers); } catch (e) {}

      // Hand off to the Cal.com booking modal with the qualifier answers
      // (biggest bottleneck + team size) bundled into the booking notes.
      // The visitor enters their name/email once, in the Cal booking form.
      // Falls back to the static confirmation screen if booking isn't available.
      if (window.AG8Booking && window.AG8Booking.open({ fresh: true })) return;

      steps.forEach(function (s) { s.classList.remove('active'); });
      prog.style.display = 'none';
      done.classList.add('show');
    });

    setStep(0);
  })();
})();
