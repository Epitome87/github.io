/* ── LeetCode Stats ─────────────────────────────────────────────
   Pre-baked static data loaded from stats-data.js.
   Zero runtime network requests.
   ─────────────────────────────────────────────────────────────── */

import { LEETCODE_SNAPSHOT } from './stats-data.js';

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

function renderLeetCode(stats) {
  if (!hasLeetCodeDom || !stats) return;
  const ESTIMATED_TOTAL_USERS = 3_000_000;

  const totalSolved = stats.totalSolved ?? 1267;
  const easySolved = stats.easySolved ?? 825;
  const mediumSolved = stats.mediumSolved ?? 428;
  const hardSolved = stats.hardSolved ?? 14;
  const totalEasy = stats.totalEasy || 966;
  const totalMedium = stats.totalMedium || 2117;
  const totalHard = stats.totalHard || 977;
  const acceptance = stats.acceptanceRate != null ? `${stats.acceptanceRate.toFixed(1)}%` : '83.4%';
  const ranking = stats.ranking ?? 15131;

  lcTotalEl.textContent = totalSolved.toLocaleString();
  lcAcceptEl.textContent = acceptance;

  if (ranking) {
    const formattedRank = ranking >= 1000 ? `${(ranking / 1000).toFixed(1)}K` : ranking;
    const topPercent = ((ranking / ESTIMATED_TOTAL_USERS) * 100).toFixed(0);
    lcRankingEl.textContent = formattedRank;
    lcRankSubEl.innerHTML = `<span class="lc-rank-badge">✦ Top ${topPercent}%</span>`;
  }

  lcEasyCountEl.textContent = `${easySolved} / ${totalEasy.toLocaleString()}`;
  lcMediumCountEl.textContent = `${mediumSolved} / ${totalMedium.toLocaleString()}`;
  lcHardCountEl.textContent = `${hardSolved} / ${totalHard.toLocaleString()}`;

  // Animate difficulty bars on reveal
  setTimeout(() => {
    lcEasyBarEl.style.width = `${Math.min(100, (easySolved / totalEasy) * 100)}%`;
    lcMediumBarEl.style.width = `${Math.min(100, (mediumSolved / totalMedium) * 100)}%`;
    lcHardBarEl.style.width = `${Math.min(100, (hardSolved / totalHard) * 100)}%`;
  }, 200);
}

if (hasLeetCodeDom) {
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
