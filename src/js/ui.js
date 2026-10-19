import './about.js';
import './animations.js';
import './contact.js';
import './nav.js';
import './project-modal.js';
import './skills-studio.js';
import './theme.js';

// ── Deferred loading of coding activity modules ──────────────
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

// ── Developer Console Easter Egg ──────────────────────────────
console.log(
  `%c Matthew McGrath %c Full-Stack Web Developer \n%cHey there! 👋 Thanks for inspecting the source code.\nInterested in building something together? Let's connect:\n📧 matthew.mcgrath.b@gmail.com\n🐙 https://github.com/Epitome87\n💼 https://linkedin.com/in/matthew-b-mcgrath/`,
  'background: #1e3a5f; color: #93c5fd; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px; font-family: monospace; font-size: 12px;',
  'background: #3b82f6; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0; font-family: monospace; font-size: 12px;',
  'color: #94a3b8; font-family: monospace; font-size: 12px; line-height: 1.6; margin-top: 6px;',
);

