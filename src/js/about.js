// ============================================================
//  about.js — Pure Open Canvas Chapter Deck Controller
// ============================================================

const chapterNextTitles = ['Modern Web Shift →', 'Go-To Stack →', 'Mindset & Reliability →', 'Back to Origins ↺'];

const totalChapters = 4;
let currentChapter = 0;

/**
 * Switch to a specific chapter index (0-3)
 * @param {number} index
 */
export function goToChapter(index) {
  if (index < 0 || index >= totalChapters) return;
  currentChapter = index;

  // Update chapter slides
  const slides = document.querySelectorAll('.about__slide');
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  // Update progress segment bars
  const segs = document.querySelectorAll('.about__seg');
  segs.forEach((seg, i) => {
    const isActive = i === index;
    seg.classList.toggle('active', isActive);
    seg.setAttribute('aria-selected', String(isActive));
  });

  // Update next CTA button label
  const nextTitleEl = document.getElementById('about-next-title');
  if (nextTitleEl) {
    nextTitleEl.textContent = chapterNextTitles[index];
  }
}

export function nextChapter() {
  goToChapter((currentChapter + 1) % totalChapters);
}

export function prevChapter() {
  goToChapter((currentChapter - 1 + totalChapters) % totalChapters);
}

// Attach to window for inline onclick fallback
if (typeof window !== 'undefined') {
  window.goToAboutChapter = goToChapter;
  window.nextAboutChapter = nextChapter;
  window.prevAboutChapter = prevChapter;
}

// Delegated document event listeners
document.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  // Click handler for segment bars & action buttons
  aboutSection.addEventListener('click', (e) => {
    const segBtn = e.target.closest('.about__seg');
    if (segBtn) {
      const idx = parseInt(segBtn.getAttribute('data-chapter-index'), 10);
      if (!isNaN(idx)) goToChapter(idx);
      return;
    }

    const nextBtn = e.target.closest('[data-about-action="next"]');
    if (nextBtn) {
      nextChapter();
      return;
    }

    const prevBtn = e.target.closest('[data-about-action="prev"]');
    if (prevBtn) {
      prevChapter();
      return;
    }
  });

  // Keyboard navigation when about section is in viewport
  let isAboutInView = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isAboutInView = entry.isIntersecting;
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(aboutSection);

  document.addEventListener('keydown', (e) => {
    if (!isAboutInView) return;
    if (e.key === 'ArrowRight') {
      nextChapter();
    } else if (e.key === 'ArrowLeft') {
      prevChapter();
    }
  });
});
