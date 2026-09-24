import './project-modal.js';

// ── Nav scroll & back-to-top visibility ──────────────────────
const navInner = document.getElementById('nav-inner');
const navEl = document.getElementById('nav');
const backToTop = document.querySelector('.back-to-top');

// Track scroll state to avoid unnecessary DOM updates
let wasScrolled = false;
let wasBackToTopVisible = false;

window.addEventListener(
  'scroll',
  () => {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 80;
    const isBackToTopVisible = scrollY > document.body.scrollHeight / 2 - window.innerHeight / 2;

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
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }, idx * 50); // TODO: Right now this must be >= the stagger numbers in layout.scss
      }
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
const codingSection = document.getElementById('coding');

if (codingSection) {
  let codingLoaded = false;
  const loadCodingModules = async () => {
    if (codingLoaded) return;
    codingLoaded = true;
    try {
      await Promise.all([import('./leetcode.js'), import('./github.js')]);
    } catch (err) {
      console.warn('Coding modules failed to load:', err);
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadCodingModules(), { timeout: 2000 });
  } else {
    setTimeout(loadCodingModules, 1000);
  }

  const codingObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries[0]?.isIntersecting) return;
      loadCodingModules();
      observer.disconnect();
    },
    { rootMargin: '300px 0px' },
  );

  codingObserver.observe(codingSection);
}

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


// ── Contact Form Submission (AJAX + Honeypot + Time-trap) ────
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const formSubmitBtn = document.getElementById('form-submit-btn');

if (contactForm && formStatus && formSubmitBtn) {
  let formInteractionStart = 0;

  // Track when user first interacts with any form input
  contactForm.addEventListener(
    'focusin',
    () => {
      if (!formInteractionStart) formInteractionStart = Date.now();
    },
    { once: true },
  );

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const honey = formData.get('_honey');

    // Honeypot check: if filled by a bot, simulate success without sending
    if (honey) {
      contactForm.reset();
      formStatus.className = 'form-status form-status--success is-visible';
      formStatus.textContent = 'Thank you! Your message has been sent successfully.';
      return;
    }

    // Time-trap check: if submitted unnaturally fast (<1.8s), add a brief delay
    const elapsedTime = formInteractionStart ? Date.now() - formInteractionStart : 0;
    if (elapsedTime < 1800) {
      await new Promise((r) => setTimeout(r, 1200));
    }

    const btnTextSpan = formSubmitBtn.querySelector('span');
    const originalText = btnTextSpan ? btnTextSpan.textContent : formSubmitBtn.textContent;

    // Loading state
    if (btnTextSpan) btnTextSpan.textContent = 'Sending...';
    formSubmitBtn.disabled = true;
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        contactForm.reset();
        formInteractionStart = 0;
        if (btnTextSpan) btnTextSpan.textContent = 'Sent! ✓';
        formStatus.className = 'form-status form-status--success is-visible';
        formStatus.textContent = "Thank you! Your message has been sent. I'll get back to you within 24 hours.";

        setTimeout(() => {
          if (btnTextSpan) btnTextSpan.textContent = originalText;
          formSubmitBtn.disabled = false;
        }, 5000);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn('Form submission error:', err);
      if (btnTextSpan) btnTextSpan.textContent = originalText;
      formSubmitBtn.disabled = false;
      formStatus.className = 'form-status form-status--error is-visible';
      formStatus.innerHTML =
        'Could not send message automatically. Please email me directly at <a href="mailto:matthew.mcgrath.b@gmail.com" style="text-decoration: underline;">matthew.mcgrath.b@gmail.com</a>.';
    }
  });
}
