/* ── LeetCode Stats ─────────────────────────────────────────────
   Fetches from leetcode-stats.tashif.codes — public, no auth.
   Falls back gracefully if unavailable.
   ─────────────────────────────────────────────────────────────── */

import { FETCH_TRIGGER_DISTANCE, USERNAME, fetchWithTimeout } from './utils.js';

const LEETCODE_API_URL = `https://leetcode-stats.tashif.codes/${USERNAME}`;
const leetcodeCard = document.getElementById('leetcode-card');
const lcTotalEl = document.getElementById('lc-total');
const lcAcceptEl = document.getElementById('lc-accept');
const lcRankingEl = document.getElementById('lc-ranking');
const lcRankSubEl = document.getElementById('lc-rank-sub');
const lcEasyCountEl = document.getElementById('lc-easy-count');
const lcMediumCountEl = document.getElementById('lc-medium-count');
const lcHardCountEl = document.getElementById('lc-hard-count');
const lcEasyBarEl = document.getElementById('lc-easy-bar');
const lcMediumBarEl = document.getElementById('lc-medium-bar');
const lcHardBarEl = document.getElementById('lc-hard-bar');
const hasLeetCodeDom = Boolean(
  leetcodeCard &&
  lcTotalEl &&
  lcAcceptEl &&
  lcRankingEl &&
  lcRankSubEl &&
  lcEasyCountEl &&
  lcMediumCountEl &&
  lcHardCountEl &&
  lcEasyBarEl &&
  lcMediumBarEl &&
  lcHardBarEl,
);

async function loadLeetCode() {
  if (!hasLeetCodeDom) return;
  const ESTIMATED_TOTAL_USERS = 3_000_000; // approx LeetCode active users (updated 2026)

  try {
    const stats = await fetchWithTimeout(LEETCODE_API_URL);

    const totalSolved = stats.totalSolved ?? 0;
    const easySolved = stats.easySolved ?? 0;
    const mediumSolved = stats.mediumSolved ?? 0;
    const hardSolved = stats.hardSolved ?? 0;
    const totalEasy = stats.totalEasy || 1; // || 1 guards against division by zero
    const totalMedium = stats.totalMedium || 1;
    const totalHard = stats.totalHard || 1;
    const acceptance = stats.acceptanceRate != null ? `${stats.acceptanceRate.toFixed(1)}%` : '—';
    const ranking = stats.ranking ?? 0;

    lcTotalEl.textContent = totalSolved;
    lcAcceptEl.textContent = acceptance;

    if (ranking) {
      const formattedRank = ranking >= 1000 ? `${(ranking / 1000).toFixed(1)}K` : ranking;
      const topPercent = ((ranking / ESTIMATED_TOTAL_USERS) * 100).toFixed(0);
      lcRankingEl.textContent = formattedRank;
      lcRankSubEl.textContent = `Top ${topPercent}%`;
    }

    lcEasyCountEl.textContent = `${easySolved} / ${totalEasy}`;
    lcMediumCountEl.textContent = `${mediumSolved} / ${totalMedium}`;
    lcHardCountEl.textContent = `${hardSolved} / ${totalHard}`;

    // Animate bars after a short delay so they're visible on scroll
    setTimeout(() => {
      lcEasyBarEl.style.width = `${Math.min(100, (easySolved / totalEasy) * 100)}%`;
      lcMediumBarEl.style.width = `${Math.min(100, (mediumSolved / totalMedium) * 100)}%`;
      lcHardBarEl.style.width = `${Math.min(100, (hardSolved / totalHard) * 100)}%`;
    }, 300);
  } catch (err) {
    console.warn('LeetCode API error:', err);
    if (leetcodeCard)
      leetcodeCard.innerHTML =
        `<div class="leetcode__error">Could not load stats. ` +
        `<a href="https://leetcode.com/u/${USERNAME}/" target="_blank" rel="noopener noreferrer" ` +
        `>View on LeetCode ↗</a></div>`;
  }
}

// Defer fetch until the card is near the viewport
if (hasLeetCodeDom) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        loadLeetCode();
        obs.disconnect();
      }
    },
    { rootMargin: FETCH_TRIGGER_DISTANCE },
  );
  observer.observe(leetcodeCard);
}
