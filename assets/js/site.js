// Site behaviour: theme, navigation, project filters, table of contents,
// reveal-on-scroll and Bit the mascot. Everything here is progressive
// enhancement: the pages are complete without it.
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* storage unavailable: preference lasts this visit */ }
    },
  };
  const announcer = $('[data-announcer]');
  const announce = (msg) => {
    if (!announcer) return;
    announcer.textContent = '';
    setTimeout(() => { announcer.textContent = msg; }, 50);
  };

  /* ------------------------------------------------------------ theme */
  function initTheme() {
    const btn = $('[data-theme-toggle]');
    if (!btn) return;
    // Light is the default; dark only when the visitor chooses it.
    const current = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    const sync = () => btn.setAttribute('aria-label', current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('theme', next);
      sync();
    });
    sync();
  }

  /* ------------------------------------------------------- header/menu */
  function initHeader() {
    const header = $('[data-header]');
    const button = $('[data-menu-button]');
    const menu = $('[data-menu]');
    if (!header) return;

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!button || !menu) return;
    const setOpen = (open, { restoreFocus = false } = {}) => {
      button.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      header.classList.toggle('is-open', open);
      if (!open && restoreFocus) button.focus();
    };
    button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') setOpen(false, { restoreFocus: true });
    });
    document.addEventListener('click', (e) => {
      if (button.getAttribute('aria-expanded') === 'true' && !header.contains(e.target)) setOpen(false);
    });
    matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------------------------------------------------------- filters */
  function initFilters() {
    const bar = $('[data-filters]');
    const grid = $('[data-project-grid]');
    const status = $('[data-filter-status]');
    if (!bar || !grid) return;
    const buttons = $$('[data-filter]', bar);
    const cards = $$('.card', grid);

    function apply(id, { focus = false, quiet = false } = {}) {
      const btn = buttons.find((b) => b.dataset.filter === id) || buttons[0];
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      for (const card of cards) {
        const match = filter === 'all' || card.dataset.categories.split(' ').includes(filter);
        card.hidden = !match;
        if (match) {
          shown += 1;
          card.classList.add('is-visible');
        }
      }
      const label = btn.firstChild.textContent.trim();
      const msg = filter === 'all'
        ? `Showing all ${shown} projects`
        : `Showing ${shown} ${shown === 1 ? 'project' : 'projects'} in ${label}`;
      if (status) status.textContent = msg;
      if (!quiet) announce(msg);
      const url = new URL(location.href);
      if (filter === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', filter);
      history.replaceState(null, '', url);
      if (focus) btn.focus();
    }

    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (btn) apply(btn.dataset.filter);
    });
    const initial = new URL(location.href).searchParams.get('category');
    if (initial) apply(initial, { quiet: true });
  }

  /* --------------------------------------------------------------- toc */
  function initToc() {
    const links = $$('.toc a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    // Observe each heading's section; highlight the first one in view.
    const sections = links
      .map((a) => document.getElementById(a.hash.slice(1))?.closest('section'))
      .filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      const index = sections.findIndex((s) => visible.has(s));
      if (index < 0) return;
      links.forEach((a, i) => {
        if (i === index) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -55% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------ reveal */
  function initReveal() {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
    const targets = $$('.card, .thread, .interest, .post, .timeline__item, .archive__item, .case__section, .facts');
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    const fold = window.innerHeight;
    for (const el of targets) {
      // Content already on screen is left alone so the first paint never shifts.
      if (el.getBoundingClientRect().top < fold) continue;
      el.classList.add('reveal');
      io.observe(el);
    }
  }

  /* ============================================================ Bit */
  function initBit() {
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const toggles = $$('[data-bit-toggle]');
    const statics = $$('.bit--hero, .bit--contact, .bit--lost');
    const seat = $('[data-bit-seat]');
    const contact = $('[data-contact]');

    const enabled = () => !root.classList.contains('bit-off');
    const animated = () => enabled() && !reduceMotion.matches;
    const canFollow = () => animated() && finePointer.matches;

    const setState = (svg, state) => {
      if (svg && svg.dataset.state !== state) svg.dataset.state = state;
    };
    const bounce = (svg) => {
      svg.classList.remove('is-bouncing');
      void svg.getBoundingClientRect(); // restart the animation
      svg.classList.add('is-bouncing');
      setTimeout(() => svg.classList.remove('is-bouncing'), 500);
    };

    /* Blinking: one timer for every Bit on the page. */
    let blinkTimer = 0;
    const blinkTargets = () => (companion ? [companion.svg] : statics);
    function scheduleBlink() {
      clearTimeout(blinkTimer);
      if (!animated() || document.hidden) return;
      blinkTimer = setTimeout(() => {
        const twice = Math.random() < 0.18;
        for (const svg of blinkTargets()) {
          if (svg.dataset.state === 'sleep') continue;
          svg.classList.add('is-blinking');
          setTimeout(() => svg.classList.remove('is-blinking'), 130);
          if (twice) {
            setTimeout(() => svg.classList.add('is-blinking'), 260);
            setTimeout(() => svg.classList.remove('is-blinking'), 380);
          }
        }
        scheduleBlink();
      }, 2400 + Math.random() * 3800);
    }

    /* Static Bits: tap to say hi, wave at the contact section. */
    seat?.addEventListener('click', () => {
      if (!animated() || companion) return;
      const svg = seat.querySelector('svg');
      setState(svg, 'happy');
      bounce(svg);
      setTimeout(() => setState(svg, 'idle'), 900);
    });

    if (contact && 'IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting || !animated()) return;
        if (companion) {
          companion.wave();
        } else {
          const svg = $('.bit--contact', contact);
          setState(svg, 'wave');
          setTimeout(() => setState(svg, 'idle'), 1900);
        }
      }, { threshold: 0.55 }).observe(contact);
    }

    /* ------------------------------------------------ cursor companion */
    let companion = null;

    function createCompanion() {
      const tpl = document.getElementById('bit-companion');
      if (!tpl) return null;
      const el = tpl.content.firstElementChild.cloneNode(true);
      const svg = el.querySelector('svg');
      document.body.append(el);
      root.classList.add('companion-on');

      const SIZE = 46;
      const header = $('[data-header]');
      const ac = new AbortController();
      const on = (target, type, fn, opts = {}) => target.addEventListener(type, fn, { ...opts, signal: ac.signal });

      let x;
      let y;
      let vx = 0;
      let vy = 0;
      let lean = 0;
      let pointer = null;
      let hoverMood = null;
      let happyUntil = 0;
      let waveUntil = 0;
      let asleep = false;
      let raf = 0;
      let last = 0;
      let lastScroll = window.scrollY;
      let sleepTimer = 0;
      let moodTimer = 0;
      let eyes = { x: 0, y: 0 };

      // Start where the hero Bit perches, so it visibly hops off the photo.
      function snapToSeat() {
        const r = seat?.getBoundingClientRect();
        if (r && r.bottom > 0 && r.top < innerHeight && r.width > 0) {
          x = r.left + r.width / 2 - SIZE / 2;
          y = r.bottom - SIZE; // feet stay on the same perch
        } else {
          x = innerWidth - SIZE - 28;
          y = innerHeight - SIZE - 28;
        }
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      snapToSeat();
      // Web fonts can shift the hero after first paint; re-perch until the visitor moves.
      const resnap = () => { if (!pointer) snapToSeat(); };
      document.fonts?.ready.then(resnap);
      on(window, 'load', resnap);
      requestAnimationFrame(() => el.classList.add('is-ready'));

      const minY = () => (header ? Math.max(8, header.getBoundingClientRect().bottom + 6) : 8);

      function target() {
        if (!pointer) return { tx: x, ty: y };
        const offX = pointer.x > innerWidth - 110 ? -SIZE - 16 : 18;
        const offY = pointer.y > innerHeight - 100 ? -SIZE - 12 : 18;
        const tx = Math.min(Math.max(pointer.x + offX, 8), innerWidth - SIZE - 8);
        const ty = Math.min(Math.max(pointer.y + offY, minY()), innerHeight - SIZE - 8);
        return { tx, ty };
      }

      function mood(now) {
        if (asleep) return 'sleep';
        if (now < waveUntil) return 'wave';
        if (now < happyUntil) return 'happy';
        return hoverMood || 'idle';
      }

      function refreshMood() {
        setState(svg, mood(performance.now()));
      }

      function lookAt(px, py) {
        const dx = px - (x + SIZE / 2);
        const dy = py - (y + SIZE / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 120);
        const lx = Math.round((dx / d) * 4 * k);
        const ly = Math.round((dy / d) * 3 * k); // whole units keep the pixel look
        if (lx !== eyes.x || ly !== eyes.y) {
          eyes = { x: lx, y: ly };
          svg.style.setProperty('--lx', `${lx}px`);
          svg.style.setProperty('--ly', `${ly}px`);
        }
      }

      function frame(now) {
        const dt = Math.min(now - (last || now), 48) / 16.667 || 1;
        last = now;
        const { tx, ty } = target();
        const stiffness = 0.055;
        const damping = Math.pow(0.8, dt);
        vx = (vx + (tx - x) * stiffness * dt) * damping;
        vy = (vy + (ty - y) * stiffness * dt) * damping;
        x += vx * dt;
        y += vy * dt;
        lean *= Math.pow(0.88, dt);
        const tilt = Math.max(-16, Math.min(16, vx * 1.5 + lean));
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
        if (pointer) lookAt(pointer.x, pointer.y);
        setState(svg, mood(now));
        svg.classList.toggle('is-walking', Math.hypot(vx, vy) > 0.6);

        const settled = Math.hypot(vx, vy) < 0.04 && Math.hypot(tx - x, ty - y) < 0.4 && Math.abs(lean) < 0.05;
        if (settled) {
          svg.classList.remove('is-walking');
          raf = 0;
          last = 0;
          return;
        }
        raf = requestAnimationFrame(frame);
      }

      function kick() {
        if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
      }

      function wake() {
        clearTimeout(sleepTimer);
        if (asleep) {
          asleep = false;
          refreshMood();
        }
        sleepTimer = setTimeout(() => {
          asleep = true;
          refreshMood();
        }, 20000);
      }

      function pulse(kind, ms) {
        const until = performance.now() + ms;
        if (kind === 'wave') waveUntil = until;
        else happyUntil = until;
        refreshMood();
        clearTimeout(moodTimer);
        moodTimer = setTimeout(refreshMood, ms + 20);
      }

      on(window, 'pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        pointer = { x: e.clientX, y: e.clientY };
        wake();
        kick();
      }, { passive: true });

      on(document, 'pointerover', (e) => {
        const t = e.target instanceof Element ? e.target : null;
        // A card's stretched title link covers the whole card, so hovering
        // anywhere on a card reads as curiosity; its other links read as happy.
        const control = t?.closest('a:not(.card__link), button, summary, [role="button"]');
        const next = control ? 'happy' : t?.closest('[data-bit="curious"]') ? 'curious' : t?.closest('a') ? 'happy' : null;
        if (next !== hoverMood) {
          hoverMood = next;
          refreshMood();
        }
      });

      on(document, 'pointerdown', (e) => {
        if (e.target instanceof Element && e.target.closest('a, button, summary')) {
          pulse('happy', 700);
          bounce(svg);
        }
      });

      on(document.documentElement, 'pointerleave', () => {
        pointer = null;
        hoverMood = null;
        refreshMood();
        kick();
      });

      on(window, 'scroll', () => {
        const dy = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        lean = Math.max(-10, Math.min(10, lean + dy * 0.12));
        kick();
      }, { passive: true });

      on(window, 'resize', kick, { passive: true });
      on(document, 'visibilitychange', () => {
        if (document.hidden && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
          last = 0;
        } else {
          kick();
        }
      });

      wake();

      return {
        svg,
        wave() {
          pulse('wave', 1900);
          wake();
        },
        destroy() {
          ac.abort();
          cancelAnimationFrame(raf);
          clearTimeout(sleepTimer);
          clearTimeout(moodTimer);
          el.remove();
          root.classList.remove('companion-on');
        },
      };
    }

    /* Keep the companion in step with preferences and input devices. */
    function reconcile() {
      if (canFollow() && !companion) companion = createCompanion();
      if (!canFollow() && companion) {
        companion.destroy();
        companion = null;
      }
      if (!animated()) statics.forEach((svg) => setState(svg, 'idle'));
      toggles.forEach((b) => b.setAttribute('aria-pressed', String(enabled())));
      scheduleBlink();
    }

    toggles.forEach((btn) =>
      btn.addEventListener('click', () => {
        const turnOn = !enabled();
        root.classList.toggle('bit-off', !turnOn);
        store.set('bit', turnOn ? 'on' : 'off');
        reconcile();
        announce(turnOn ? 'Bit is back.' : 'Bit is resting. Animations are off.');
      }),
    );
    reduceMotion.addEventListener('change', reconcile);
    finePointer.addEventListener('change', reconcile);
    document.addEventListener('visibilitychange', scheduleBlink);
    reconcile();
  }

  initTheme();
  initHeader();
  initFilters();
  initToc();
  initReveal();
  initBit();
})();
