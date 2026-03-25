// ── Nav scroll & back-to-top visibility ──────────────────────
const navInner = document.getElementById('nav-inner');
const navEl = document.getElementById('nav');
const backToTop = document.querySelector('.back-to-top');

window.addEventListener(
  'scroll',
  () => {
    const isScrolled = window.scrollY > 80;
    navInner?.classList.toggle('scrolled', isScrolled);
    navEl?.classList.toggle('is-scrolled', isScrolled);
    backToTop?.classList.toggle('is-visible', window.scrollY > document.body.scrollHeight / 2 - window.innerHeight / 2);
  },
  { passive: true },
);

// ── Mobile menu ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
  });

  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileMenu));

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

// ── Scroll reveal ────────────────────────────────────────────
// const revealObserver = new IntersectionObserver(
//   (entries) => {
//     for (const entry of entries) {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('visible');
//         revealObserver.unobserve(entry.target);
//       }
//     }
//   },
//   { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
// );

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      setTimeout(() => {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }, idx * 50); // TODO: Right now this must be >= the stagger numbers in layout.scss
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── Theme toggle ─────────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

const syncThemeToggle = (theme) => {
  themeToggle?.setAttribute('aria-pressed', String(theme === 'dark'));
};

const initialTheme = localStorage.getItem('theme') ?? 'dark';
htmlEl.setAttribute('data-theme', initialTheme);
syncThemeToggle(initialTheme);

themeToggle?.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeToggle(next);
});

// ── Active nav link on scroll ────────────────────────────────
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
const sections = document.querySelectorAll('main section[id], section[id]');

if (navLinks.length && sections.length) {
  const updateActiveSection = () => {
    let currentId = null;
    let bestTop = Infinity;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const topDistance = Math.abs(rect.top);
      const inView = rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.2;

      if (inView && topDistance < bestTop) {
        bestTop = topDistance;
        currentId = section.id;
      }
    }

    if (!currentId) return;

    for (const link of navLinks) {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  };

  const sectionObserver = new IntersectionObserver(
    () => {
      updateActiveSection();
    },
    { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
  updateActiveSection();
}

// ── Portrait: wiggle on click, rocket on third click ─────────
const portraitOuter = document.querySelector('.about__portrait-outer');

if (portraitOuter) {
  let clickCount = 0;

  portraitOuter.addEventListener('click', () => {
    clickCount++;

    if (clickCount >= 3) {
      // Third click — blast off, never to return
      portraitOuter.classList.remove('is-wiggling', 'is-wiggling-2');
      portraitOuter.classList.add('is-launching');
      return;
    }

    // First click — normal wiggle, second click — more extreme wiggle
    const wiggleClass = clickCount === 1 ? 'is-wiggling' : 'is-wiggling-2';
    const otherClass = clickCount === 1 ? 'is-wiggling-2' : 'is-wiggling';
    portraitOuter.classList.remove(wiggleClass, otherClass);
    void portraitOuter.offsetWidth; // force reflow to restart animation
    portraitOuter.classList.add(wiggleClass);
  });

  // Clean up wiggle classes when animation ends
  // On launch: hide entirely so it doesn't block content below
  portraitOuter.addEventListener('animationend', () => {
    if (portraitOuter.classList.contains('is-launching')) {
      portraitOuter.classList.add('is-hidden');
    } else {
      portraitOuter.classList.remove('is-wiggling', 'is-wiggling-2');
    }
  });
}

// ── Footer staggered entrance ────────────────────────────────
const footerInner = document.querySelector('.footer__inner');
if (footerInner) {
  const footerObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        console.log(entry);
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

// ── Back to top rocket button ────────────────────────────────
if (backToTop) {
  backToTop.addEventListener('click', () => {
    // Trigger launch animation, then scroll to top once it's mid-launch
    backToTop.classList.add('is-launching');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
    setTimeout(() => {
      // Reset button after it's scrolled away
      backToTop.classList.remove('is-launching', 'is-visible');
    }, 700);
  });
}
