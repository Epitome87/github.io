/* ── Shared utilities ───────────────────────────────────────────
   Imported by leetcode.js and github.js
   ─────────────────────────────────────────────────────────────── */

export const USERNAME = 'Epitome87';
export const FETCH_TRIGGER_DISTANCE = '200px';

export const fetchWithTimeout = async (url, ms = 12_000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};
