// ── Nav scroll, smart headroom & back-to-top visibility ─────────
const navEl = document.getElementById('nav');
const navInner = document.getElementById('nav-inner');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const backToTop = document.querySelector('.back-to-top');

// Track scroll state to avoid unnecessary DOM updates
let wasScrolled = false;
let wasBackToTopVisible = false;
let lastScrollY = window.scrollY;
let accumulatedDelta = 0;
let isHidden = false;

window.addEventListener(
  'scroll',
  () => {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 80;
    const isBackToTopVisible = scrollY > document.body.scrollHeight / 2 - window.innerHeight / 2;

    // ── Smart Headroom (Directional Accumulator for Mobile/Tablet) ──
    if (window.innerWidth < 1024) {
      const isMobileMenuOpen = mobileMenu?.classList.contains('open');
      const diff = scrollY - lastScrollY;

      // Reset accumulator when reversing scroll direction
      if ((diff > 0 && accumulatedDelta < 0) || (diff < 0 && accumulatedDelta > 0)) {
        accumulatedDelta = 0;
      }
      accumulatedDelta += diff;

      // Hide when cumulative downward scroll exceeds 25px (past top 80px)
      if (accumulatedDelta > 25 && scrollY > 80 && !isMobileMenuOpen) {
        if (!isHidden) {
          navEl?.classList.add('is-hidden');
          isHidden = true;
        }
      }
      // Reveal when cumulative upward scroll exceeds 10px OR when returning to top
      else if (accumulatedDelta < -10 || scrollY <= 80) {
        if (isHidden) {
          navEl?.classList.remove('is-hidden');
          isHidden = false;
        }
      }
    } else if (isHidden) {
      navEl?.classList.remove('is-hidden');
      isHidden = false;
    }
    lastScrollY = scrollY;

    // Return early if neither state has changed to avoid unnecessary DOM updates
    if (isScrolled === wasScrolled && isBackToTopVisible === wasBackToTopVisible) {
      return;
    }

    // Add scrolled class to nav after scrolling past hero, and remove when back at top
    if (isScrolled !== wasScrolled) {
      navInner?.classList.toggle('scrolled', isScrolled);
      navEl?.classList.toggle('is-scrolled', isScrolled);
      wasScrolled = isScrolled;
    }

    // Back to top button appears after scrolling past the first half of the page
    if (isBackToTopVisible !== wasBackToTopVisible) {
      backToTop?.classList.toggle('is-visible', isBackToTopVisible);
      wasBackToTopVisible = isBackToTopVisible;
    }
  },
  { passive: true },
);

// ── Mobile menu ──────────────────────────────────────────────

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

  // Close on Escape key press and restore focus to hamburger trigger
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      hamburger.focus();
    }
  });
}

// ── Active nav link on scroll (Scrollspy) ───────────────────
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
const sections = document.querySelectorAll('main section[id], section[id]');

if (navLinks.length && sections.length) {
  const activeSections = new Map();

  const setActiveLink = (currentId) => {
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

  const updateActiveSection = () => {
    let currentId = null;
    let bestTop = Infinity;

    for (const [section, rect] of activeSections) {
      const topDistance = Math.abs(rect.top);

      if (topDistance < bestTop) {
        bestTop = topDistance;
        currentId = section.id;
      }
    }

    if (!currentId) return;

    setActiveLink(currentId);
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSections.set(entry.target, entry.boundingClientRect);
        } else {
          activeSections.delete(entry.target);
        }
      }

      updateActiveSection();
    },
    { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
  updateActiveSection();
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
