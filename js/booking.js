/* ============================================================
   AG8NTIFY — Booking modal + Cal.com embed
   Any "Book Strategy Call" CTA (any link to #book) opens a modal
   where the visitor picks a 30-min or 1-hour discovery call and
   chooses a time on your embedded Cal.com calendar.
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     ⚙️  CONFIG — paste your Cal.com details here, then you're live.
     ------------------------------------------------------------
     Find these in Cal.com → Event Types. A link looks like:
         cal.com/jane-doe/discovery-30min
                  └ username ┘ └─ event slug ─┘
     Set `username` and the two event slugs below. That's it.
     ============================================================ */
  var CAL = {
    username: 'carlos-mitchell-iu2mmb',   // Cal.com username
    events: {
      '30': '30min',                      // 30-minute discovery event slug
      '60': '60-mins-discovery-call'      // 60-minute discovery event slug
    },
    brandColor: '#D9A441'                 // Singularity gold (Cal accent)
  };

  function calLink(dur) { return CAL.username + '/' + CAL.events[dur]; }
  var PLACEHOLDER = /YOUR-CALCOM/i.test(CAL.username);

  var modal = document.getElementById('bookModal');
  if (!modal) return;
  var panel = modal.querySelector('.book-modal-panel');
  var chooseView = document.getElementById('bookChoose');
  var calView = document.getElementById('bookCal');
  var mount = document.getElementById('bookCalMount');
  var calLabel = document.getElementById('bookCalLabel');
  var mounted = {};            // dur -> container (lazy-built once)
  var lastFocus = null;

  /* ---- Cal.com embed loader (official snippet) ---- */
  if (!PLACEHOLDER) {
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    Cal('init', { origin: 'https://cal.com' });
  }

  /* ---- prefill from the qualifier form, if the visitor filled it ----
     name + email prefill Cal's fields; the bottleneck / team size /
     company answers are bundled into the booking "notes" so they arrive
     attached to the booking in Cal.com (and in your confirmation email). */
  function selectedOpts(q) {
    return [].map.call(document.querySelectorAll('[data-q="' + q + '"] .qopt.sel'), function (b) {
      return b.textContent.replace(/✓/g, '').replace(/\s+/g, ' ').trim();
    }).join(', ');
  }
  function prefill() {
    var val = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
    var cfg = {};
    var name = val('qName'); if (name) cfg.name = name;
    var email = val('qEmail'); if (email) cfg.email = email;
    var notes = [];
    var focus = selectedOpts('bottleneck'); if (focus) notes.push('Focus areas: ' + focus);
    var size = selectedOpts('size'); if (size) notes.push('Team size: ' + size);
    var company = val('qCompany'); if (company) notes.push('Company: ' + company);
    if (notes.length) cfg.notes = notes.join('\n');
    return cfg;
  }

  /* ---- placeholder shown until a real Cal.com link is set ---- */
  function placeholderHTML(dur) {
    var len = dur === '30' ? '30-minute' : '1-hour';
    return '<div class="book-cal-ph">' +
      '<div class="bph-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/><path d="M8.5 14l2.2 2.2L15.5 12" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<div class="bph-t">Your Cal.com calendar loads here</div>' +
      '<div class="bph-d">Add your Cal.com username and event slug in <code>js/booking.js</code> and the live ' + len + ' booking calendar appears right in this window.</div>' +
      '<div class="bph-slug">cal.com/<b>' + CAL.username + '</b>/' + CAL.events[dur] + '</div>' +
      '</div>';
  }

  /* ---- lazily build + mount each duration's calendar once ---- */
  function ensureMount(dur) {
    if (mounted[dur]) return mounted[dur];
    var box = document.createElement('div');
    box.setAttribute('data-dur', dur);
    mount.appendChild(box);
    if (PLACEHOLDER) {
      box.innerHTML = placeholderHTML(dur);
    } else {
      var ns = 'ag8' + dur;
      Cal('init', ns, { origin: 'https://cal.com' });
      Cal.ns[ns]('inline', {
        elementOrSelector: box,
        calLink: calLink(dur),
        layout: 'month_view',
        config: Object.assign({ theme: 'dark' }, prefill())
      });
      Cal.ns[ns]('ui', {
        theme: 'dark',
        cssVarsPerTheme: { dark: { 'cal-brand': CAL.brandColor } },
        hideEventTypeDetails: false,
        layout: 'month_view'
      });
    }
    mounted[dur] = box;
    return box;
  }

  /* ---- drop cached calendars so the next open re-mounts with fresh
     prefill (used when the qualifier form hands off to booking) ---- */
  function resetMounts() {
    mounted = {};
    if (mount) mount.innerHTML = '';
  }

  function showChoose() {
    calView.hidden = true;
    chooseView.hidden = false;
  }
  function showCal(dur) {
    chooseView.hidden = true;
    calView.hidden = false;
    ensureMount(dur);
    [].forEach.call(mount.children, function (c) { c.hidden = c.getAttribute('data-dur') !== dur; });
    calLabel.textContent = dur === '30' ? '30-minute discovery call' : '1-hour strategy session';
  }

  function openModal() {
    lastFocus = document.activeElement;
    showChoose();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    var first = chooseView.querySelector('.book-dur');
    if (first) first.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---- open from any booking CTA (any link to #book) ----
     Capture phase so we beat main.js's smooth-scroll handler. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#book"]');
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    openModal();
  }, true);

  /* ---- public API: let the qualifier form hand off to booking ----
     opts.fresh re-mounts so the calendar picks up the answers just
     entered. Returns false if booking is unavailable (placeholder/no
     modal) so the caller can fall back to its own confirmation. */
  window.AG8Booking = {
    open: function (opts) {
      if (PLACEHOLDER) return false;
      if (opts && opts.fresh) resetMounts();
      openModal();
      return true;
    }
  };

  /* ---- in-modal controls ---- */
  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-book-close]')) { closeModal(); return; }
    if (e.target.closest('[data-book-back]')) { showChoose(); return; }
    var dur = e.target.closest('.book-dur');
    if (dur) showCal(dur.getAttribute('data-dur'));
  });

  /* ---- ESC to close + lightweight focus trap ---- */
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      var f = panel.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])');
      var vis = [].filter.call(f, function (el) { return el.offsetParent !== null; });
      if (!vis.length) return;
      var first = vis[0], last = vis[vis.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
