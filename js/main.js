/* ============================================================
   AG8NTIFY — Core interactions
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- NAV + scroll progress ---- */
  var nav = document.getElementById('nav');
  var prog = document.getElementById('scrollProgress');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('scrolled', y > 30);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    // hero chip parallax
    chips.forEach(function (c, i) {
      var d = (i % 2 ? 1 : -1) * (i + 1) * 0.04;
      c.el.style.transform = 'translateY(' + (y * d) + 'px)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- floating chips ---- */
  var chips = [].slice.call(document.querySelectorAll('[data-float]')).map(function (el) { return { el: el }; });
  // gentle idle drift
  if (!reduce) {
    chips.forEach(function (c, i) {
      c.el.animate(
        [{ marginTop: '0px' }, { marginTop: (i % 2 ? 12 : -12) + 'px' }, { marginTop: '0px' }],
        { duration: 5000 + i * 700, iterations: Infinity, easing: 'ease-in-out' }
      );
    });
  }

  /* ---- AMBIENT NETWORK BACKGROUND ---- */
  (function ambient() {
    var cv = document.getElementById('starfield');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var nodes = [], blobs = [], W = 0, H = 0, t = 0;
    var mouse = { x: -999, y: -999 };

    function size() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      var n = Math.min(78, Math.floor(W * H / 24000));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.3 + 0.5, tw: Math.random() * 6.28
        });
      }
      blobs = [
        { x: W * 0.2, y: H * 0.3, r: Math.max(W, H) * 0.42, a: 0.05, sx: 0.00006, sy: 0.00009, ph: 0 },
        { x: W * 0.8, y: H * 0.6, r: Math.max(W, H) * 0.36, a: 0.045, sx: 0.00008, sy: 0.00005, ph: 2 },
        { x: W * 0.5, y: H * 0.9, r: Math.max(W, H) * 0.3, a: 0.04, sx: 0.00005, sy: 0.00007, ph: 4 }
      ];
    }

    function draw() {
      t += 1;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      // drifting gold glow blobs
      for (var b = 0; b < blobs.length; b++) {
        var bl = blobs[b];
        var bx = bl.x + Math.sin(t * bl.sx * 1000 + bl.ph) * W * 0.12;
        var by = bl.y + Math.cos(t * bl.sy * 1000 + bl.ph) * H * 0.12;
        var g = ctx.createRadialGradient(bx, by, 0, bx, by, bl.r);
        g.addColorStop(0, 'rgba(217,164,65,' + bl.a + ')');
        g.addColorStop(1, 'rgba(217,164,65,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      // connecting lines
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var c = nodes[j];
          var dx = a.x - c.x, dy = a.y - c.y, d2 = dx * dx + dy * dy;
          if (d2 < 21000) {
            var al = (1 - d2 / 21000) * 0.16;
            ctx.strokeStyle = 'rgba(217,164,65,' + al + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
          }
        }
        // line to mouse (interactive)
        var mdx = a.x - mouse.x, mdy = a.y - mouse.y, md2 = mdx * mdx + mdy * mdy;
        if (md2 < 30000) {
          ctx.strokeStyle = 'rgba(239,198,119,' + (1 - md2 / 30000) * 0.35 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      // nodes
      for (var k = 0; k < nodes.length; k++) {
        var nd = nodes[k];
        nd.x += nd.vx; nd.y += nd.vy; nd.tw += 0.02;
        if (nd.x < -20) nd.x = W + 20; if (nd.x > W + 20) nd.x = -20;
        if (nd.y < -20) nd.y = H + 20; if (nd.y > H + 20) nd.y = -20;
        var tw = 0.4 + 0.35 * Math.sin(nd.tw);
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r, 0, 6.28);
        ctx.fillStyle = 'rgba(239,198,119,' + tw + ')'; ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    var raf;
    size();
    if (reduce) { draw(); } else { raf = requestAnimationFrame(draw); }
    window.addEventListener('resize', size);
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', function () { mouse.x = -999; mouse.y = -999; });
  })();

  /* ---- shared "on view" activation (scroll-based, IO-independent) ---- */
  var watchers = [];
  function registerView(el, cb, frac) {
    watchers.push({ el: el, cb: cb, frac: frac == null ? 0.86 : frac, done: false });
  }
  function checkViews() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var pending = false;
    for (var i = 0; i < watchers.length; i++) {
      var w = watchers[i];
      if (w.done) continue;
      var r = w.el.getBoundingClientRect();
      if (r.top < vh * w.frac && r.bottom > 0) { w.done = true; try { w.cb(); } catch (e) {} }
      else pending = true;
    }
    return pending;
  }
  window.AG8onView = registerView;
  window.addEventListener('scroll', checkViews, { passive: true });
  window.addEventListener('resize', checkViews);
  // initial sweeps to catch above-the-fold + settle after layout/fonts
  [0, 120, 400, 900, 1600].forEach(function (t) { setTimeout(checkViews, t); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(checkViews);

  /* ---- REVEAL on scroll ---- */
  document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
    registerView(el, function () { el.classList.add('in'); }, 0.92);
  });

  /* ---- COUNT-UP ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    var dur = 1500, t0 = null;
    function fmt(v) {
      var s = dec ? v.toFixed(dec) : Math.round(v).toLocaleString();
      return pre + s + suf;
    }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(step);
    }
    if (reduce) { el.textContent = fmt(target); return; }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('[data-count]').forEach(function (el) {
    registerView(el, function () { countUp(el); }, 0.95);
  });

  /* ---- MARQUEE ---- */
  var track = document.getElementById('marqueeTrack');
  if (track && window.AG8) {
    var html = '';
    function chip(a) {
      return '<div class="fn-chip"><span class="tag">' + a.tag + '</span><span class="nm">' + a.nm + '</span><span class="ds">' + a.ds + '</span></div>';
    }
    // duplicate set for seamless loop
    AG8.agents.forEach(function (a) { html += chip(a); });
    AG8.agents.forEach(function (a) { html += chip(a); });
    track.innerHTML = html;
  }

  /* ---- CAPABILITIES ---- */
  var cg = document.getElementById('capGrid');
  if (cg && window.AG8) {
    var ch = '';
    AG8.capabilities.forEach(function (c) {
      var icon = (window.AG8_ICONS[c.i] || '');
      ch += '<div class="cap"><div class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' + icon + '</svg></div><h4>' + c.nm + '</h4><p>' + c.ds + '</p></div>';
    });
    cg.innerHTML = ch;
  }

  /* ---- smooth anchor offset for fixed nav ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  onScroll();
})();
