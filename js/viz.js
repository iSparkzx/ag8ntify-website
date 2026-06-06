/* ============================================================
   AG8NTIFY — Infographics & data-viz
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var A = window.AG8 || {};

  function inView(el, cb, th) {
    if (window.AG8onView) { window.AG8onView(el, cb, 0.85); }
    else { cb(); }
  }

  /* ===================== BEFORE / AFTER ===================== */
  (function ba() {
    var wrap = document.getElementById('baViz');
    var rowsEl = document.getElementById('baRows');
    var saveEl = document.getElementById('baSave');
    if (!wrap || !rowsEl || !A.ba) return;
    var max = Math.max.apply(null, A.ba.map(function (r) { return r.m; }));
    var mode = 'manual', shown = false;

    var html = '';
    A.ba.forEach(function (r, i) {
      html += '<div class="ba-row" data-i="' + i + '"><div class="br-top"><span class="k">' + r.k + '</span><span class="v">0 hrs</span></div><div class="ba-bar"><span class="ba-fill manual"></span></div></div>';
    });
    rowsEl.innerHTML = html;

    function render(animate) {
      A.ba.forEach(function (r, i) {
        var row = rowsEl.querySelector('[data-i="' + i + '"]');
        var fill = row.querySelector('.ba-fill');
        var v = mode === 'manual' ? r.m : r.a;
        fill.className = 'ba-fill ' + mode;
        var w = (v / max) * 100;
        fill.style.width = (animate ? w : w) + '%';
        row.querySelector('.v').textContent = v + ' hrs';
      });
      var saved = A.ba.reduce(function (s, r) { return s + (r.m - r.a); }, 0);
      saveEl.textContent = mode === 'manual' ? saved + ' hrs' : saved + ' hrs';
    }

    document.getElementById('baToggle').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      mode = b.getAttribute('data-mode');
      [].forEach.call(this.children, function (c) {
        c.classList.toggle('on', c === b);
      });
      render(true);
    });

    inView(wrap, function () {
      shown = true;
      // start empty then fill
      A.ba.forEach(function (r, i) { rowsEl.querySelector('[data-i="' + i + '"] .ba-fill').style.width = '0%'; });
      setTimeout(function () { render(true); }, 80);
    }, 0.35);
  })();

  /* ===================== 4-LAYER OS (static panel — no JS needed) ===================== */

  /* ===================== AGENT NETWORK CANVAS ===================== */
  (function net() {
    var cv = document.getElementById('netCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    var cx = W / 2, cy = H / 2;
    var R = Math.min(W, H) * 0.36;
    var labels = ['lead', 'crm', 'sales', 'support', 'data', 'ops', 'growth', 'finance'];
    var nodes = labels.map(function (l, i) {
      var a = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, l: l, ph: Math.random() * 6.28 };
    });
    var pulses = [];
    function spawn() {
      var n = Math.floor(Math.random() * nodes.length);
      var dir = Math.random() > 0.5;
      pulses.push({ n: n, t: 0, dir: dir, sp: 0.012 + Math.random() * 0.01 });
    }
    var spawnTimer = 0;

    function frame(ts) {
      ctx.clearRect(0, 0, W, H);
      // edges
      ctx.lineWidth = 1;
      nodes.forEach(function (nd) {
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nd.x, nd.y);
        ctx.strokeStyle = 'rgba(217,164,65,0.14)'; ctx.stroke();
      });
      // pulses
      spawnTimer++;
      if (!reduce && spawnTimer > 26) { spawn(); spawnTimer = 0; }
      pulses = pulses.filter(function (p) { return p.t <= 1; });
      pulses.forEach(function (p) {
        p.t += p.sp;
        var nd = nodes[p.n];
        var tt = p.dir ? p.t : 1 - p.t;
        var x = cx + (nd.x - cx) * tt;
        var y = cy + (nd.y - cy) * tt;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, 'rgba(239,198,119,0.95)'); g.addColorStop(1, 'rgba(239,198,119,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.28); ctx.fill();
      });
      // outer nodes
      nodes.forEach(function (nd) {
        nd.ph += 0.03;
        var pr = 5 + Math.sin(nd.ph) * 0.8;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, pr + 6, 0, 6.28);
        ctx.fillStyle = 'rgba(217,164,65,0.06)'; ctx.fill();
        ctx.beginPath(); ctx.arc(nd.x, nd.y, pr, 0, 6.28);
        ctx.fillStyle = '#0d0d11'; ctx.fill();
        ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(217,164,65,0.7)'; ctx.stroke();
        ctx.font = '11px "Geist Mono", monospace';
        ctx.fillStyle = 'rgba(155,150,140,0.9)'; ctx.textAlign = 'center';
        var ly = nd.y > cy ? nd.y + 20 : nd.y - 14;
        ctx.fillText(nd.l, nd.x, ly);
      });
      // central core
      var coreR = 26 + Math.sin(ts / 600) * 2;
      var cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR + 24);
      cg.addColorStop(0, 'rgba(239,198,119,0.4)'); cg.addColorStop(1, 'rgba(239,198,119,0)');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, coreR + 24, 0, 6.28); ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, 6.28);
      ctx.fillStyle = '#0a0a0d'; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(239,198,119,0.9)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 0.46, 0, 6.28);
      ctx.fillStyle = 'rgba(239,198,119,0.85)'; ctx.fill();
      ctx.font = '600 10px "Geist Mono", monospace'; ctx.fillStyle = 'rgba(155,150,140,0.85)';
      ctx.textAlign = 'center'; ctx.fillText('CORE', cx, cy + coreR + 18);

      if (!reduce) raf = requestAnimationFrame(frame);
    }
    var raf;
    inView(cv, function () { raf = requestAnimationFrame(frame); }, 0.2);
    if (reduce) { frame(0); }
  })();

  /* ===================== RESULTS BAR CHART ===================== */
  (function bars() {
    var el = document.getElementById('barsChart');
    if (!el || !A.bars) return;
    var max = Math.max.apply(null, A.bars.map(function (b) { return b.m; }));
    var html = '';
    A.bars.forEach(function (b) {
      html += '<div class="bar-col" data-m="' + b.m + '" data-a="' + b.a + '">' +
        '<span class="bval">' + b.a + 'h</span>' +
        '<div class="bk"><span class="bf hot"></span></div>' +
        '<span class="blab">' + b.k + '</span></div>';
    });
    el.innerHTML = html;
    inView(el, function () {
      [].forEach.call(el.querySelectorAll('.bar-col'), function (col, i) {
        var a = parseFloat(col.getAttribute('data-a'));
        setTimeout(function () {
          col.querySelector('.bf').style.height = ((a / max) * 100) + '%';
        }, i * 110);
      });
    }, 0.4);
  })();

  /* ===================== DONUT ===================== */
  (function donut() {
    var arc = document.getElementById('donutArc');
    if (!arc) return;
    var C = 314, pct = 0.94;
    inView(arc, function () {
      setTimeout(function () { arc.style.strokeDashoffset = (C * (1 - pct)) + ''; }, 120);
    }, 0.4);
  })();

  /* ===================== GROWTH TRAJECTORY ===================== */
  (function traj() {
    var svg = document.getElementById('trajChart');
    if (!svg) return;
    var man = document.getElementById('trajManual');
    var ai = document.getElementById('trajAi');
    var area = document.getElementById('trajArea');
    var dot = document.getElementById('trajDot');
    var lenA = ai.getTotalLength ? ai.getTotalLength() : 400;
    var lenM = man.getTotalLength ? man.getTotalLength() : 340;
    ai.style.strokeDasharray = lenA; ai.style.strokeDashoffset = lenA;
    man.style.strokeDasharray = lenM; man.style.strokeDashoffset = lenM;
    inView(svg, function () {
      if (reduce) {
        ai.style.strokeDashoffset = 0; man.style.strokeDashoffset = 0;
        area.style.opacity = 1; dot.setAttribute('opacity', 1); return;
      }
      man.style.transition = 'stroke-dashoffset 1.3s var(--ease)';
      ai.style.transition = 'stroke-dashoffset 1.8s var(--ease)';
      area.style.transition = 'opacity 1.4s var(--ease) 0.5s';
      setTimeout(function () {
        man.style.strokeDashoffset = 0;
        ai.style.strokeDashoffset = 0;
        area.style.opacity = 1;
      }, 80);
      setTimeout(function () { dot.setAttribute('opacity', 1); }, 1700);
    }, 0.4);
  })();

  /* ===================== ROI CALCULATOR ===================== */
  (function roi() {
    var team = document.getElementById('roiTeam');
    var hours = document.getElementById('roiHours');
    var rate = document.getElementById('roiRate');
    if (!team) return;
    var tV = document.getElementById('roiTeamV');
    var hV = document.getElementById('roiHoursV');
    var rV = document.getElementById('roiRateV');
    var big = document.getElementById('roiBig');
    var hrsYr = document.getElementById('roiHrsYr');
    var fte = document.getElementById('roiFte');
    var AUTO = 0.7;

    function money(n) {
      if (n >= 1000000) return '$' + (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + 'M';
      if (n >= 1000) return '$' + Math.round(n / 1000) + 'k';
      return '$' + Math.round(n);
    }
    function calc() {
      var t = +team.value, h = +hours.value, r = +rate.value;
      tV.textContent = t;
      hV.textContent = h;
      rV.textContent = '$' + r;
      var hrsWeek = t * h * AUTO;
      var hrsYear = Math.round(hrsWeek * 48);
      var dollars = hrsYear * r;
      big.textContent = money(dollars);
      hrsYr.textContent = hrsYear.toLocaleString();
      fte.textContent = (hrsYear / 1840).toFixed(1);
    }
    [team, hours, rate].forEach(function (s) { s.addEventListener('input', calc); });
    calc();
  })();

  /* ===================== PROCESS TIMELINE ===================== */
  (function timeline() {
    var tl = document.getElementById('timeline');
    var fill = document.getElementById('tlFill');
    if (!tl) return;
    var steps = [].slice.call(tl.querySelectorAll('.tl-step'));
    inView(tl, function () {
      if (fill) fill.style.width = '100%';
      steps.forEach(function (s, i) {
        setTimeout(function () { s.classList.add('on'); }, 300 + i * 320);
      });
    }, 0.35);
  })();
})();
