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
const statLbl1El = document.getElementById('lc-stat-lbl-1');
const statLbl2El = document.getElementById('lc-stat-lbl-2');
const statLbl3El = document.getElementById('lc-stat-lbl-3');

const lcEasyCountEl = document.getElementById('lc-easy-count');
const lcMediumCountEl = document.getElementById('lc-medium-count');
const lcHardCountEl = document.getElementById('lc-hard-count');
const lcEasyBarEl = document.getElementById('lc-easy-bar');
const lcMediumBarEl = document.getElementById('lc-medium-bar');
const lcHardBarEl = document.getElementById('lc-hard-bar');

const footerDescEl = document.getElementById('algo-footer-desc');
const footerLinkEl = document.getElementById('algo-footer-link');

const hasAlgoDom = Boolean(leetcodeCard && tabBtnLc && tabBtnCw && panelLc && panelCw && stat1El && stat2El && stat3El);

let currentPlatform = 'leetcode';

function setPlatform(platform) {
  if (currentPlatform === platform) return;
  currentPlatform = platform;

  const isLC = platform === 'leetcode';

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

  // Update dynamic 3-stat metric row
  if (isLC) {
    if (stat1El) {
      stat1El.textContent = '1,267';
      stat1El.classList.remove('coding__stat-num--accent');
    }
    if (statLbl1El) statLbl1El.textContent = 'Total Solved';

    if (stat2El) {
      stat2El.textContent = 'Top 1%';
      stat2El.classList.add('coding__stat-num--accent');
    }
    if (statLbl2El) statLbl2El.textContent = 'Global Rank (#15.1K)';

    if (stat3El) {
      stat3El.textContent = '83.4%';
      stat3El.classList.remove('coding__stat-num--accent');
    }
    if (statLbl3El) statLbl3El.textContent = 'Acceptance';

    if (footerDescEl) {
      footerDescEl.innerHTML = 'Data Structures &bull; Graph Theory &bull; Dynamic Programming';
    }
    if (footerLinkEl) {
      footerLinkEl.href = 'https://leetcode.com/u/Epitome87/';
      footerLinkEl.innerHTML = '<span>LeetCode ↗</span>';
      footerLinkEl.className = 'coding__footer-pill coding__footer-pill--accent';
      footerLinkEl.setAttribute('aria-label', "View Matthew's LeetCode profile, opens in new tab");
    }
  } else {
    if (stat1El) {
      stat1El.textContent = '4 Kyu';
      stat1El.classList.add('coding__stat-num--accent');
    }
    if (statLbl1El) statLbl1El.textContent = 'Rank Tier';

    if (stat2El) {
      stat2El.textContent = '1,420+';
      stat2El.classList.remove('coding__stat-num--accent');
    }
    if (statLbl2El) statLbl2El.textContent = 'Honor Earned';

    if (stat3El) {
      stat3El.textContent = 'Top 5%';
      stat3El.classList.remove('coding__stat-num--accent');
    }
    if (statLbl3El) statLbl3El.textContent = 'Leaderboard';

    if (footerDescEl) {
      footerDescEl.innerHTML = 'Kata Discipline &bull; JavaScript &bull; TypeScript &bull; C#';
    }
    if (footerLinkEl) {
      footerLinkEl.href = 'https://www.codewars.com/users/Epitome87';
      footerLinkEl.innerHTML = '<span>Codewars ↗</span>';
      footerLinkEl.className = 'coding__footer-pill';
      footerLinkEl.setAttribute('aria-label', "View Matthew's Codewars profile, opens in new tab");
    }
  }
}

// Event Listeners for Tabs
if (hasAlgoDom) {
  tabBtnLc?.addEventListener('click', () => setPlatform('leetcode'));
  tabBtnCw?.addEventListener('click', () => setPlatform('codewars'));
}

function renderLeetCode(stats) {
  if (!stats) return;

  const totalSolved = stats.totalSolved ?? 1267;
  const easySolved = stats.easySolved ?? 825;
  const mediumSolved = stats.mediumSolved ?? 428;
  const hardSolved = stats.hardSolved ?? 14;
  const totalEasy = stats.totalEasy || 966;
  const totalMedium = stats.totalMedium || 2117;
  const totalHard = stats.totalHard || 977;

  if (stat1El && currentPlatform === 'leetcode') {
    stat1El.textContent = totalSolved.toLocaleString();
  }

  if (lcEasyCountEl) lcEasyCountEl.textContent = `${easySolved} / ${totalEasy.toLocaleString()}`;
  if (lcMediumCountEl) lcMediumCountEl.textContent = `${mediumSolved} / ${totalMedium.toLocaleString()}`;
  if (lcHardCountEl) lcHardCountEl.textContent = `${hardSolved} / ${totalHard.toLocaleString()}`;

  // Animate difficulty bars on reveal
  setTimeout(() => {
    if (lcEasyBarEl) lcEasyBarEl.style.width = `${Math.min(100, (easySolved / totalEasy) * 100)}%`;
    if (lcMediumBarEl) lcMediumBarEl.style.width = `${Math.min(100, (mediumSolved / totalMedium) * 100)}%`;
    if (lcHardBarEl) lcHardBarEl.style.width = `${Math.min(100, (hardSolved / totalHard) * 100)}%`;
  }, 200);
}

if (hasAlgoDom && leetcodeCard) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        renderLeetCode(LEETCODE_SNAPSHOT);
        obs.disconnect();
      }
    },
    { rootMargin: '200px 0px' },
  );
  observer.observe(leetcodeCard);
}
