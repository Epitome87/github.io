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
