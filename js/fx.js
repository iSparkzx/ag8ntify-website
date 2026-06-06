/* ============================================================
   AG8NTIFY — FX
   Tasteful text micro-interactions, adapted as general techniques:
   1. touch detection (gates hover effects, like Modernizr did)
   2. character reveal on the hero headline
   3. line-by-line reveal on section intros
   4. glitch hover on nav + footer links
   No content is hidden unless this script runs, so a JS failure
   degrades gracefully to plain visible text.
   ============================================================ */
(function () {
  'use strict';

  var docEl = document.documentElement;

  // ---- 1. touch detection -> gate hover effects ----
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  docEl.classList.add(isTouch ? 'touch' : 'no-touch');

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function whenReady(fn) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fn);
      setTimeout(fn, 700); // fallback if fonts.ready is slow/unsupported
    } else {
      setTimeout(fn, 150);
    }
  }

  /* ---- 2. character reveal (hero headline) ---- */
  function wrapChars(el) {
    var idx = { n: 0 };
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var text = child.nodeValue, frag = document.createDocumentFragment();
          for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); continue; }
            var s = document.createElement('span');
            s.className = 'fx-char';
            s.textContent = ch;
            s.style.setProperty('--cd', (idx.n * 0.026).toFixed(3) + 's');
            idx.n++;
            frag.appendChild(s);
          }
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child); // recurse into .nowrap / .gold-ink
        }
      });
    })(el);
    return [].slice.call(el.querySelectorAll('.fx-char'));
  }

  var h1 = document.querySelector('.hero h1');
  if (h1) {
    wrapChars(h1);
    if (reduce) { /* CSS reveals via !important */ }
    else {
      whenReady(function () { requestAnimationFrame(function () { h1.classList.add('fx-anim'); }); });
      // failsafe: never leave the hero headline hidden if animations don't run
      setTimeout(function () { h1.classList.add('fx-done'); }, 2800);
    }
  }

  /* ---- 3. line-by-line reveal (section intros) ---- */
  function splitWords(el) {
    var parts = el.textContent.split(/(\s+)/);
    el.textContent = '';
    var words = [];
    parts.forEach(function (p) {
      if (p === '') return;
      if (/^\s+$/.test(p)) { el.appendChild(document.createTextNode(p)); return; }
      var s = document.createElement('span');
      s.className = 'fx-word';
      s.textContent = p;
      el.appendChild(s);
      words.push(s);
    });
    return words;
  }

  function assignLineDelays(words) {
    var lineTop = null, line = -1;
    words.forEach(function (w) {
      var t = w.offsetTop;
      if (lineTop === null || Math.abs(t - lineTop) > 4) { line++; lineTop = t; }
      w.style.setProperty('--ld', (line * 0.075).toFixed(3) + 's');
    });
  }

  var leads = [].slice.call(document.querySelectorAll('.shead .lead, .hero .lead'))
    .filter(function (el) { return el.children.length === 0; });

  // split immediately so text is hidden until revealed
  var leadData = leads.map(function (el) { return { el: el, words: splitWords(el) }; });

  whenReady(function () {
    leadData.forEach(function (d) {
      assignLineDelays(d.words);
      var go = function () {
        d.el.classList.add('fx-in');
        // failsafe: force-visible shortly after, in case animations are throttled
        setTimeout(function () { d.el.classList.add('fx-done'); }, 1600);
      };
      if (reduce) { return; } // CSS makes words visible via !important
      // reuse the site's scroll-based viewport watcher (IntersectionObserver
      // is unreliable inside the preview iframe; AG8onView is scroll-driven)
      if (window.AG8onView) { window.AG8onView(d.el, go, 0.92); }
      else { go(); }
    });
    // force one sweep so above-the-fold intros reveal without a scroll
    if (!reduce) { window.dispatchEvent(new Event('scroll')); }
  });

  /* ---- 4. glitch hover (nav + footer links) ---- */
  function glitch(el) {
    var text = el.textContent;
    el.textContent = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === ' ') { el.appendChild(document.createTextNode(' ')); continue; }
      var s = document.createElement('span');
      s.className = 'fx-gchar';
      s.textContent = ch;
      s.style.setProperty('--gd', (Math.random() * 0.16).toFixed(3) + 's');
      el.appendChild(s);
    }
    el.classList.add('fx-glitch');
  }

  [].slice.call(document.querySelectorAll('.nav-links a, .footer-links a'))
    .forEach(glitch);
})();
