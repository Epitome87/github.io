// ── Scroll reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }, idx * 50);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── Portrait: wiggle on click, rocket on third click ─────────
const portraitOuter = document.querySelector('.about__portrait-outer');

if (portraitOuter) {
  let clickCount = 0;
  let activePortraitAnimation = null;

  const playPortraitAnimation = (keyframes, duration) => {
    activePortraitAnimation?.cancel();
    activePortraitAnimation = portraitOuter.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      fill: 'none',
    });
  };

  portraitOuter.addEventListener('click', () => {
    clickCount++;

    if (clickCount >= 3) {
      // Third click — blast off, never to return
      activePortraitAnimation?.cancel();
      portraitOuter.classList.add('is-launching');
      return;
    }

    if (clickCount === 1) {
      playPortraitAnimation(
        [
          { transform: 'rotate(0deg) translateY(0)', offset: 0 },
          { transform: 'rotate(-6deg) translateY(-4px)', offset: 0.1 },
          { transform: 'rotate(5deg) translateY(-8px)', offset: 0.25 },
          { transform: 'rotate(-4deg) translateY(-3px)', offset: 0.4 },
          { transform: 'rotate(3deg) translateY(-6px)', offset: 0.55 },
          { transform: 'rotate(-2deg) translateY(-2px)', offset: 0.7 },
          { transform: 'rotate(1deg) translateY(-1px)', offset: 0.85 },
          { transform: 'rotate(0deg) translateY(0)', offset: 1 },
        ],
        700,
      );
    } else {
      playPortraitAnimation(
        [
          { transform: 'rotate(0deg) translateY(0)', offset: 0 },
          { transform: 'rotate(-14deg) translateY(-10px)', offset: 0.08 },
          { transform: 'rotate(12deg) translateY(-20px)', offset: 0.2 },
          { transform: 'rotate(-10deg) translateY(-8px)', offset: 0.33 },
          { transform: 'rotate(8deg) translateY(-15px)', offset: 0.46 },
          { transform: 'rotate(-6deg) translateY(-6px)', offset: 0.58 },
          { transform: 'rotate(4deg) translateY(-8px)', offset: 0.7 },
          { transform: 'rotate(-2deg) translateY(-3px)', offset: 0.82 },
          { transform: 'rotate(1deg) translateY(-1px)', offset: 0.91 },
          { transform: 'rotate(0deg) translateY(0)', offset: 1 },
        ],
        1100,
      );
    }
  });

  // On launch: hide entirely so it doesn't block content below
  portraitOuter.addEventListener('animationend', () => {
    if (portraitOuter.classList.contains('is-launching')) {
      portraitOuter.classList.add('is-hidden');
    }
  });
}

// ── Footer staggered entrance ────────────────────────────────
const footerInner = document.querySelector('.footer__inner');
if (footerInner) {
  const footerObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          footerInner.classList.add('is-visible');
          footerObserver.unobserve(footerInner);
        }
      }
    },
    { threshold: 0.3 },
  );
  footerObserver.observe(footerInner);
}

// ── Hero JSON Deck Tabs ─────────────────────────────────────
const heroDeck = document.querySelector('.hero__deck');
if (heroDeck) {
  const tabs = Array.from(heroDeck.querySelectorAll('.hero__deck-tab'));
  const panels = heroDeck.querySelectorAll('.hero__deck-body');
  const tablist = heroDeck.querySelector('.hero__deck-tabs');

  const activateTab = (tab, shouldFocus = false) => {
    if (!tab) return;
    const targetId = tab.getAttribute('aria-controls');

    tabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((p) => {
      p.classList.remove('is-active');
    });

    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add('is-active');
    }

    if (shouldFocus) {
      tab.focus();
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });
  });

  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      const currentIdx = tabs.indexOf(document.activeElement);
      if (currentIdx === -1) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % tabs.length;
        activateTab(tabs[nextIdx], true);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + tabs.length) % tabs.length;
        activateTab(tabs[prevIdx], true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        activateTab(tabs[0], true);
      } else if (e.key === 'End') {
        e.preventDefault();
        activateTab(tabs[tabs.length - 1], true);
      }
    });
  }
}
