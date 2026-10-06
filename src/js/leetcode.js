/* ── Algorithm Station & LeetCode / Codewars Stats ─────────────
   Pre-baked static data loaded from stats-data.js.
   Zero runtime network requests. Instant tab switching and animations.
   ─────────────────────────────────────────────────────────────── */

import { LEETCODE_SNAPSHOT } from './stats-data.js';

const leetcodeCard = document.getElementById('leetcode-card');
const tabBtnLc = document.getElementById('tab-btn-lc');
const tabBtnCw = document.getElementById('tab-btn-cw');
const panelLc = document.getElementById('panel-leetcode');
const panelCw = document.getElementById('panel-codewars');

const stat1El = document.getElementById('lc-stat-1');
const stat2El = document.getElementById('lc-stat-2');
const stat3El = document.getElementById('lc-stat-3');

const lcEasyCountEl = document.getElementById('lc-easy-count');
const lcMediumCountEl = document.getElementById('lc-medium-count');
const lcHardCountEl = document.getElementById('lc-hard-count');
const lcEasyBarEl = document.getElementById('lc-easy-bar');
const lcMediumBarEl = document.getElementById('lc-medium-bar');
const lcHardBarEl = document.getElementById('lc-hard-bar');

const hasAlgoDom = Boolean(leetcodeCard && tabBtnLc && tabBtnCw && panelLc && panelCw && stat1El && stat2El && stat3El);

let currentPlatform = 'leetcode';

function setPlatform(platform) {
  if (currentPlatform === platform) return;
  currentPlatform = platform;

  const isLC = platform === 'leetcode';

  const algoFlagEl = document.getElementById('algo-flag-text');
  if (algoFlagEl) {
    algoFlagEl.textContent = `--platform=${platform}`;
  }

  // Toggle tab states
  tabBtnLc?.classList.toggle('active', isLC);
  tabBtnLc?.setAttribute('aria-selected', String(isLC));
  tabBtnCw?.classList.toggle('active', !isLC);
  tabBtnCw?.setAttribute('aria-selected', String(!isLC));

  // Toggle panels
  if (panelLc && panelCw) {
    panelLc.classList.toggle('active', isLC);
    panelLc.hidden = !isLC;
    panelCw.classList.toggle('active', !isLC);
    panelCw.hidden = isLC;
  }
}

// Event Listeners for Tabs
if (hasAlgoDom) {
  tabBtnLc?.addEventListener('click', () => setPlatform('leetcode'));
  tabBtnCw?.addEventListener('click', () => setPlatform('codewars'));

  // WAI-ARIA tablist keyboard navigation
  const platformTablist = leetcodeCard?.querySelector('[role="tablist"]');
  if (platformTablist) {
    platformTablist.addEventListener('keydown', (e) => {
      const tabs = [tabBtnLc, tabBtnCw].filter(Boolean);
      const activeIdx = currentPlatform === 'leetcode' ? 0 : 1;
      let targetIdx = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        targetIdx = activeIdx === 0 ? 1 : 0;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIdx = 1;
      }

      if (targetIdx !== -1) {
        const targetPlatform = targetIdx === 0 ? 'leetcode' : 'codewars';
        setPlatform(targetPlatform);
        tabs[targetIdx]?.focus();
      }
    });
  }
}

function getAsciiBarLength(platform = 'leetcode') {
  if (typeof window === 'undefined') return 36;
  if (window.innerWidth < 480) return platform === 'codewars' ? 22 : 18;
  if (window.innerWidth < 768) return 24;
  if (window.innerWidth < 1024) return 30;
  return 36;
}

function generateAsciiBar(solved, total, length) {
  const barLen = length || getAsciiBarLength('leetcode');
  if (!total) return `[<span class="g-empty">${'█'.repeat(barLen)}</span>]`;
  const ratio = Math.max(0, Math.min(1, solved / total));
  const filledCount = Math.min(barLen, Math.max(solved > 0 ? 1 : 0, Math.round(ratio * barLen)));
  const emptyCount = barLen - filledCount;
  return `[<span class="g-fill">${'█'.repeat(filledCount)}</span><span class="g-empty">${'█'.repeat(emptyCount)}</span>]`;
}

function renderLeetCode(stats) {
  if (!stats) return;

  const totalSolved = stats.totalSolved ?? 1270;
  const ranking = stats.ranking ?? 15090;
  const easySolved = stats.easySolved ?? 828;
  const mediumSolved = stats.mediumSolved ?? 428;
  const hardSolved = stats.hardSolved ?? 14;
  const totalEasy = stats.totalEasy || 968;
  const totalMedium = stats.totalMedium || 2122;
  const totalHard = stats.totalHard || 979;

  if (stat1El && currentPlatform === 'leetcode') {
    stat1El.textContent = totalSolved.toLocaleString();
  }
  if (stat2El && currentPlatform === 'leetcode') {
    stat2El.textContent = ranking.toLocaleString();
  }
  if (stat3El && currentPlatform === 'leetcode') {
    stat3El.textContent = `${(stats.acceptanceRate ?? 83.4).toFixed(1)}%`;
  }

  const easyRatio = ((easySolved / totalEasy) * 100).toFixed(1);
  const medRatio = ((mediumSolved / totalMedium) * 100).toFixed(1);
  const hardRatio = ((hardSolved / totalHard) * 100).toFixed(1);

  if (lcEasyCountEl) {
    lcEasyCountEl.innerHTML = `<span class="g-solved-total">${easySolved.toLocaleString()} / ${totalEasy.toLocaleString()} </span><strong class="g-pct">(${easyRatio}%)</strong>`;
  }
  if (lcMediumCountEl) {
    lcMediumCountEl.innerHTML = `<span class="g-solved-total">${mediumSolved.toLocaleString()} / ${totalMedium.toLocaleString()} </span><strong class="g-pct">(${medRatio}%)</strong>`;
  }
  if (lcHardCountEl) {
    lcHardCountEl.innerHTML = `<span class="g-solved-total">${hardSolved.toLocaleString()} / ${totalHard.toLocaleString()} </span><strong class="g-pct">(${hardRatio}%)</strong>`;
  }

  const barLen = getAsciiBarLength('leetcode');
  if (lcEasyBarEl) {
    lcEasyBarEl.innerHTML = generateAsciiBar(easySolved, totalEasy, barLen);
    lcEasyBarEl.setAttribute('aria-hidden', 'true');
    lcEasyBarEl.removeAttribute('aria-label');
  }
  if (lcMediumBarEl) {
    lcMediumBarEl.innerHTML = generateAsciiBar(mediumSolved, totalMedium, barLen);
    lcMediumBarEl.setAttribute('aria-hidden', 'true');
    lcMediumBarEl.removeAttribute('aria-label');
  }
  if (lcHardBarEl) {
    lcHardBarEl.innerHTML = generateAsciiBar(hardSolved, totalHard, barLen);
    lcHardBarEl.setAttribute('aria-hidden', 'true');
    lcHardBarEl.removeAttribute('aria-label');
  }
}

const cwLanguages = [
  { id: 'cw-js-bar', kyu: 2.61, name: 'JavaScript' },
  { id: 'cw-py-bar', kyu: 3.14, name: 'Python' },
  { id: 'cw-ts-bar', kyu: 6.35, name: 'TypeScript' },
  { id: 'cw-sql-bar', kyu: 7.18, name: 'SQL' },
];

function generateKyuBar(kyu, length) {
  const barLen = length || getAsciiBarLength('codewars');
  const ratio = Math.max(0, Math.min(1, (8 - kyu) / 7));
  const filledCount = Math.min(barLen, Math.max(1, Math.round(ratio * barLen)));
  const emptyCount = barLen - filledCount;
  return `[<span class="g-fill">${'█'.repeat(filledCount)}</span><span class="g-empty">${'█'.repeat(emptyCount)}</span>]`;
}

function renderCodewarsBars() {
  const barLen = getAsciiBarLength('codewars');
  for (const lang of cwLanguages) {
    const el = document.getElementById(lang.id);
    if (el) {
      el.innerHTML = generateKyuBar(lang.kyu, barLen);
      el.setAttribute('aria-hidden', 'true');
      el.removeAttribute('aria-label');
    }
  }
}

if (hasAlgoDom && leetcodeCard) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        renderLeetCode(LEETCODE_SNAPSHOT);
        renderCodewarsBars();
        obs.disconnect();
      }
    },
    { rootMargin: '200px 0px' },
  );
  observer.observe(leetcodeCard);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderLeetCode(LEETCODE_SNAPSHOT);
      renderCodewarsBars();
    }, 150);
  });
}
