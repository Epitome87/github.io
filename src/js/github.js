/* GitHub Contributions Graph
   - Fetches all years in parallel for all-time stats
   - Caches each year's data so switching is instant
   - Year buttons rendered dynamically from available data
*/

import { FETCH_TRIGGER_DISTANCE, USERNAME, fetchWithTimeout } from './utils.js';

const GITHUB_API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}`;
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
let yearRequestId = 0;

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

// Skeleton
const buildSkeleton = () => {
  const frag = document.createDocumentFragment();
  for (let w = 0; w < 53; w++) {
    const col = document.createElement('div');
    col.className = 'github__skeleton-col';
    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div');
      cell.className = 'github__skeleton-cell';
      cell.style.animationDelay = `${(w * 0.012 + d * 0.018).toFixed(3)}s`;
      col.appendChild(cell);
    }
    frag.appendChild(col);
  }
  return frag;
};

if (hasGitHubDom) grid.appendChild(buildSkeleton());

// Helpers
const extractContributions = (data) => {
  const contributions = Array.isArray(data) ? data : (data?.contributions ?? data?.data ?? []);
  return contributions?.length ? contributions : null;
};

const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));
const formatDate = (d, opts) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', opts);

// Year selector UI
const buildYearSelector = (years, active) => {
  yearSelEl.replaceChildren();

  const makeBtn = (label, year) => {
    const btn = document.createElement('button');
    btn.className = `github__year-btn${active === year ? ' active' : ''}`;
    btn.textContent = label;
    btn.setAttribute('aria-pressed', String(active === year));
    btn.addEventListener('click', () => switchYear(year));
    return btn;
  };

  yearSelEl.appendChild(makeBtn('Last 12 mo', 'last'));
  for (const year of [...years].reverse()) {
    yearSelEl.appendChild(makeBtn(year, year));
  }
};

const switchYear = async (year) => {
  if (year === activeYear) return;
  activeYear = year;
  const requestId = ++yearRequestId;

  for (const btn of yearSelEl.querySelectorAll('.github__year-btn')) {
    const match = btn.textContent === String(year) || (year === 'last' && btn.textContent === 'Last 12 mo');
    btn.classList.toggle('active', match);
    btn.setAttribute('aria-pressed', String(match));
  }

  if (yearCache.has(year)) {
    renderGraph(yearCache.get(year), year);
    return;
  }

  showSkeleton();
  try {
    const data = await fetchWithTimeout(`${GITHUB_API_URL}?y=${year}`);
    const contributions = extractContributions(data);
    if (!contributions) throw new Error('empty');
    yearCache.set(year, contributions);
    if (requestId !== yearRequestId || activeYear !== year) return;
    renderGraph(contributions, year);
  } catch {
    if (requestId !== yearRequestId || activeYear !== year) return;
    subtitle.textContent = `Could not load ${year}`;
  }
};

const showSkeleton = () => {
  grid.replaceChildren(buildSkeleton());
  monthsEl.replaceChildren();
};

// Main fetch
const currentYear = new Date().getFullYear();
const START_YEAR = 2021;
const years = Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) => START_YEAR + i);

const setStatsLoading = () => {
  for (const el of Object.values(statEls)) {
    if (el) el.textContent = '...';
  }
};

const updateAllTimeStats = (allYearsData, fallbackGridData = []) => {
  const allContribs = allYearsData
    .filter(Boolean)
    .flat()
    .sort((a, b) => a.date.localeCompare(b.date));

  const gridData = fallbackGridData.length ? fallbackGridData : allContribs.slice(-365);

  let yearTotal = 0;
  let allActive = 0;
  let allBestCount = 0;
  let allBestDate = '';
  let allMaxStreak = 0;
  let allCurStreak = 0;

  for (const contribution of allContribs) {
    if (contribution.count > 0) {
      allCurStreak++;
      if (allCurStreak > allMaxStreak) allMaxStreak = allCurStreak;
      allActive++;
    } else {
      allCurStreak = 0;
    }

    if (contribution.count > allBestCount) {
      allBestCount = contribution.count;
      allBestDate = contribution.date;
    }
  }

  for (const contribution of gridData) yearTotal += contribution.count;

  if (statEls.total) statEls.total.textContent = formatCount(yearTotal);
  if (statEls.streak) statEls.streak.textContent = allMaxStreak;
  if (statEls.best) statEls.best.textContent = allBestCount;
  if (statEls.activeDays) statEls.activeDays.textContent = formatCount(allActive);

  if (statEls.bestDate) {
    if (allBestDate) {
      const bestDate = new Date(`${allBestDate}T12:00:00`);
      statEls.bestDate.textContent = bestDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } else {
      statEls.bestDate.textContent = '—';
    }
  }

  if (streakSubEl) streakSubEl.textContent = 'All time';
};

const warmYearCache = async (fallbackGridData) => {
  const allYearsData = await Promise.all(
    years.map((year) =>
      fetchWithTimeout(`${GITHUB_API_URL}?y=${year}`)
        .then(extractContributions)
        .catch(() => null),
    ),
  );

  years.forEach((year, i) => {
    if (allYearsData[i]) yearCache.set(year, allYearsData[i]);
  });

  updateAllTimeStats(allYearsData, fallbackGridData);
};

async function loadGitHub() {
  if (!hasGitHubDom) return;

  try {
    setStatsLoading();
    buildYearSelector(years, 'last');

    const lastYearData = await fetchWithTimeout(`${GITHUB_API_URL}?y=last`).then(extractContributions);
    if (!lastYearData) throw new Error('empty');

    yearCache.set('last', lastYearData);
    renderGraph(lastYearData, 'last');

    warmYearCache(lastYearData).catch((err) => {
      console.warn('GitHub yearly cache error:', err);
    });
  } catch (err) {
    console.warn('GitHub fetch error:', err);
    showError();
  }
}

// Defer fetch until the graph is near the viewport
if (hasGitHubDom) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        loadGitHub();
        obs.disconnect();
      }
    },
    { rootMargin: FETCH_TRIGGER_DISTANCE },
  );
  observer.observe(graphWrap);
}

// Render
const renderGraph = (contributions, year = activeYear) => {
  grid.replaceChildren();
  monthsEl.replaceChildren();
  if (!contributions?.length) {
    showError();
    return;
  }

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

const showError = () => {
  grid.innerHTML =
    `<div class="github__error">Could not load data. ` +
    `<a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer">View on GitHub ↗</a></div>`;
  subtitle.textContent = 'Data unavailable';
  for (const el of [statEls.total, statEls.streak, statEls.best, statEls.activeDays]) {
    if (el) el.textContent = '—';
  }
};
