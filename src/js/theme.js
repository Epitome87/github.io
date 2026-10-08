// ── Theme toggle & persistence ──────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

export const syncThemeColorMeta = (theme) => {
  const themeColor = theme === 'dark' ? '#0b0f14' : '#f4f7ff';
  let metaTheme = document.querySelector('meta[name="theme-color"]:not([media])');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    document.head.appendChild(metaTheme);
  }
  metaTheme.content = themeColor;
};

export const syncThemeToggle = (theme) => {
  const isDark = theme === 'dark';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle?.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  syncThemeColorMeta(theme);
};

export const initTheme = () => {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');

  htmlEl.setAttribute('data-theme', initialTheme);
  syncThemeToggle(initialTheme);

  themeToggle?.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncThemeToggle(next);
  });

  // If user hasn't explicitly saved a choice, listen for system theme changes
  if (!saved && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const next = e.matches ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', next);
        syncThemeToggle(next);
      }
    });
  }
};

initTheme();
