/* GitHub Contributions Graph
   Pre-baked static data loaded from stats-data.js.
   Zero runtime network requests. Instant year switching from pre-computed dataset.
*/

import { GITHUB_LAST_SNAPSHOT, GITHUB_SNAPSHOT } from './stats-data.js';

const USERNAME = 'Epitome87';
const grid = document.getElementById('github-grid');
const monthsEl = document.getElementById('github-months');
const subtitle = document.getElementById('graph-subtitle');
const yearSelEl = document.getElementById('github-year-selector');
const graphWrap = document.querySelector('.github__graph-wrap');
const gridScrollEl = grid?.closest('.github__grid-scroll');
const hasGitHubDom = Boolean(grid && monthsEl && subtitle && yearSelEl && graphWrap);
const statEls = {
  total: document.getElementById('stat-total'),
  streak: document.getElementById('stat-streak'),
  best: document.getElementById('stat-best'),
  activeDays: document.getElementById('stat-active-days'),
  bestDate: document.getElementById('stat-best-date'),
};
const streakSubEl = statEls.streak?.closest('.github__stat')?.querySelector('.github__stat-sub');
const yearCache = new Map();
let activeYear = 'last';

// Pre-populate yearCache with the trailing 12 months (365 days) from snapshot
if (GITHUB_LAST_SNAPSHOT && Array.isArray(GITHUB_LAST_SNAPSHOT)) {
  const sortedLast = [...GITHUB_LAST_SNAPSHOT].sort((a, b) => a.date.localeCompare(b.date));
  yearCache.set('last', sortedLast);
}

const years = [];
if (GITHUB_SNAPSHOT && GITHUB_SNAPSHOT.total) {
  const allYears = Object.keys(GITHUB_SNAPSHOT.total).sort((a, b) => b - a);
  years.push(...allYears);

  // Group contributions by year and sort chronologically
  if (Array.isArray(GITHUB_SNAPSHOT.contributions)) {
    for (const year of allYears) {
      const yearContributions = GITHUB_SNAPSHOT.contributions
        .filter((c) => c.date.startsWith(`${year}-`))
        .sort((a, b) => a.date.localeCompare(b.date));
      yearCache.set(year, yearContributions);
    }
  }
}

// Tooltip
const tip = document.createElement('div');
tip.className = 'github__tooltip';
if (hasGitHubDom) document.body.appendChild(tip);

const posTip = (e) => {
  const [tw, th] = [tip.offsetWidth, tip.offsetHeight];
  let x = e.clientX - tw / 2;
  let y = e.clientY - th - 12;
  x = Math.max(6, Math.min(x, window.innerWidth - tw - 6));
  if (y < 6) y = e.clientY + 20;
  tip.style.left = `${x}px`;
  tip.style.top = `${y}px`;
};

if (hasGitHubDom) {
  graphWrap.addEventListener('mouseover', (e) => {
    const cell = e.target.closest?.('.github__day');
    if (!cell?.dataset.tip) {
      tip.style.opacity = '0';
      return;
    }
    tip.textContent = cell.dataset.tip;
    tip.style.opacity = '1';
    posTip(e);
  });

  graphWrap.addEventListener('mousemove', (e) => {
    if (tip.style.opacity === '1') posTip(e);
  });

  graphWrap.addEventListener('mouseout', (e) => {
    if (e.target.closest?.('.github__day')) tip.style.opacity = '0';
  });
}

// Helpers
const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));
const formatDate = (d, opts) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', opts);

// Year selector UI
const buildYearSelector = (yearsList, active) => {
  if (!yearSelEl) return;
  yearSelEl.replaceChildren();

  const makeBtn = (label, year) => {
    const btn = document.createElement('button');
    btn.className = `github__year-btn${active === year ? ' active' : ''}`;
    btn.textContent = label;
    btn.setAttribute('aria-pressed', String(active === year));
    btn.addEventListener('click', () => {
      if (activeYear === year) return;
      activeYear = year;
      yearSelEl.querySelectorAll('.github__year-btn').forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-pressed', String(isCurrent));
      });
      const data = yearCache.get(year);
      if (data) renderGraph(data, year);
    });
    return btn;
  };

  // Default tab is the trailing 365 days ("Last 12 Months")
  yearSelEl.appendChild(makeBtn('Last 12 Months', 'last'));
  const visibleYears = yearsList.slice(0, 5);
  for (const year of visibleYears) {
    yearSelEl.appendChild(makeBtn(year, year));
  }
};

// Render graph
const renderGraph = (contributions, year = activeYear) => {
  if (!grid || !monthsEl || !subtitle || !contributions?.length) return;
  grid.replaceChildren();
  monthsEl.replaceChildren();

  const first = contributions[0].date;
  const last = contributions[contributions.length - 1].date;

  subtitle.textContent = `${formatDate(first, { month: 'short', year: 'numeric' })} → ${formatDate(last, { month: 'short', year: 'numeric' })}`;

  const firstDay = new Date(`${contributions[0].date}T12:00:00`).getDay();
  const padded = [...Array(firstDay).fill(null), ...contributions];
  const weeks = Array.from({ length: Math.ceil(padded.length / 7) }, (_, i) => padded.slice(i * 7, i * 7 + 7));

  let prevIdx = -4;
  const seen = new Set();
  for (const [wi, wk] of weeks.entries()) {
    for (const day of wk) {
      if (!day) continue;
      const dd = new Date(`${day.date}T12:00:00`);
      const key = `${dd.getFullYear()}-${dd.getMonth()}`;
      if (!seen.has(key) && dd.getDate() <= 7) {
        seen.add(key);
        const spacer = document.createElement('div');
        spacer.className = 'github__month-label';
        spacer.style.minWidth = `${(wi - prevIdx) * 16}px`;
        spacer.textContent = dd.toLocaleDateString('en-US', { month: 'short' });
        monthsEl.appendChild(spacer);
        prevIdx = wi;
      }
    }
  }

  const frag = document.createDocumentFragment();
  for (const wk of weeks) {
    const weekEl = document.createElement('div');
    weekEl.className = 'github__week';
    for (let d = 0; d < 7; d++) {
      const dayData = wk[d];
      const cell = document.createElement('div');
      cell.className = 'github__day';
      if (dayData) {
        const lvl =
          typeof dayData.level === 'number'
            ? dayData.level
            : dayData.count === 0
              ? 0
              : dayData.count <= 2
                ? 1
                : dayData.count <= 5
                  ? 2
                  : dayData.count <= 9
                    ? 3
                    : 4;
        cell.dataset.level = lvl;
        const dateStr = formatDate(dayData.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        const countStr =
          dayData.count === 0 ? 'No contributions' : `${dayData.count} contribution${dayData.count !== 1 ? 's' : ''}`;
        cell.dataset.tip = `${countStr} · ${dateStr}`;
      } else {
        cell.dataset.level = '0';
        cell.style.visibility = 'hidden';
      }
      weekEl.appendChild(cell);
    }
    frag.appendChild(weekEl);
  }
  grid.appendChild(frag);

  if (gridScrollEl) {
    setTimeout(() => {
      gridScrollEl.scrollLeft = year === 'last' ? gridScrollEl.scrollWidth : 0;
    }, 50);
  }
};

// Compute and update all-time stats from full snapshot
const updateAllTimeStats = () => {
  let allMaxStreak = 0;
  let allActive = 0;
  let allBestCount = 0;
  let allBestDate = null;
  let currentStreak = 0;

  const allContributions = Array.isArray(GITHUB_SNAPSHOT?.contributions) ? GITHUB_SNAPSHOT.contributions : [];

  for (const contribution of allContributions) {
    if (contribution.count > 0) {
      currentStreak++;
      allActive++;
      if (currentStreak > allMaxStreak) allMaxStreak = currentStreak;
    } else {
      currentStreak = 0;
    }

    if (contribution.count > allBestCount) {
      allBestCount = contribution.count;
      allBestDate = contribution.date;
    }
  }

  const lastYearData = yearCache.get('last') || [];
  let lastYearTotal = 0;
  for (const item of lastYearData) lastYearTotal += item.count;

  if (statEls.total) statEls.total.textContent = formatCount(lastYearTotal || 809);
  if (statEls.streak) statEls.streak.textContent = formatCount(allMaxStreak || 1900);
  if (statEls.best) statEls.best.textContent = allBestCount || 36;
  if (statEls.activeDays) statEls.activeDays.textContent = formatCount(allActive || 1900);

  if (statEls.bestDate && allBestDate) {
    const bestDate = new Date(`${allBestDate}T12:00:00`);
    statEls.bestDate.textContent = bestDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (streakSubEl) streakSubEl.textContent = 'All time';
};

function initGitHub() {
  if (!hasGitHubDom) return;
  buildYearSelector(years, 'last');
  const initialData =
    yearCache.get('last') ||
    (Array.isArray(GITHUB_SNAPSHOT?.contributions) ? GITHUB_SNAPSHOT.contributions.slice(0, 365) : []);
  renderGraph(initialData, 'last');
  updateAllTimeStats();
}

initGitHub();
