// ============================================================
//  about.js — Pure Open Canvas Chapter Deck Controller
// ============================================================

const chapterNextTitles = ['Modern Web Focus →', 'Go-To Tech Stack →', 'Reliability & Mindset →', 'Back to Origins ↺'];

const totalChapters = 4;
let currentChapter = 0;

let typewriterTimer = null;

/**
 * Animate the title text character-by-character with terminal cursor
 * @param {HTMLElement} slideEl
 */
function typewriteTitle(slideEl) {
  if (!slideEl) return;
  const typedSpan = slideEl.querySelector('.about__typed-title');
  if (!typedSpan) return;

  const fullText = typedSpan.getAttribute('data-full-text') || typedSpan.textContent.trim();
  if (!fullText) return;

  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    typedSpan.textContent = fullText;
    return;
  }

  typedSpan.textContent = '';
  let i = 0;
  typewriterTimer = setInterval(() => {
    if (i < fullText.length) {
      typedSpan.textContent = fullText.slice(0, i + 1);
      i++;
    } else {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
  }, 18);
}

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
    const isActive = i === index;
    slide.classList.toggle('active', isActive);
    if (isActive) {
      typewriteTitle(slide);
    }
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

  // Touch swipe support for mobile chapter navigation
  const slidesViewport =
    aboutSection.querySelector('.about__slides-viewport') || aboutSection.querySelector('.about__window-body');
  if (slidesViewport) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    slidesViewport.addEventListener(
      'touchstart',
      (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        }
      },
      { passive: true },
    );

    slidesViewport.addEventListener(
      'touchend',
      (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchEndX = e.changedTouches[0].screenX;
          touchEndY = e.changedTouches[0].screenY;
          handleSwipe();
        }
      },
      { passive: true },
    );

    const handleSwipe = () => {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      // Dominant horizontal swipe with > 45px displacement
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
        if (deltaX < 0) {
          nextChapter(); // Swipe left -> next
        } else {
          prevChapter(); // Swipe right -> prev
        }
      }
    };
  }

  // Trigger typewriter effect on first scroll into view
  let hasTypedInitial = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasTypedInitial) {
          hasTypedInitial = true;
          const activeSlide = aboutSection.querySelector('.about__slide.active');
          if (activeSlide) typewriteTitle(activeSlide);
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(aboutSection);

  // WAI-ARIA tablist keyboard navigation on .about__track
  const tabTrack = aboutSection.querySelector('.about__track');
  if (tabTrack) {
    tabTrack.addEventListener('keydown', (e) => {
      const segs = Array.from(tabTrack.querySelectorAll('.about__seg'));
      const activeIdx = segs.findIndex((s) => s.classList.contains('active'));
      let targetIdx = -1;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetIdx = (activeIdx + 1) % totalChapters;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetIdx = (activeIdx - 1 + totalChapters) % totalChapters;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIdx = totalChapters - 1;
      }

      if (targetIdx !== -1) {
        goToChapter(targetIdx);
        segs[targetIdx]?.focus();
      }
    });
  }

  // Initialize Lower-Zone Ambient Stardust Particles
  const stardustCanvas = document.getElementById('aboutStardust');
  if (stardustCanvas) {
    initAboutStardust(stardustCanvas, aboutSection);
  }
});

/**
 * Ambient Lower-Zone Stardust Particles
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} sectionEl
 */
function initAboutStardust(canvas, sectionEl) {
  if (!canvas || !sectionEl) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let particles = [];
  const particleCount = 45;
  let animFrameId = null;
  let isVisible = false;

  function resize() {
    canvas.width = sectionEl.offsetWidth;
    canvas.height = sectionEl.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const minY = canvas.height * 0.45;
    const spanY = canvas.height - minY;
    const colors = ['#818CF8', '#38BDF8', '#FBBF24', '#34D399'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: minY + Math.random() * spanY,
        size: Math.random() * 2.2 + 1,
        speedY: -(Math.random() * 0.35 + 0.1),
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleAngle: Math.random() * Math.PI * 2,
      });
    }
  }

  function render() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const minY = canvas.height * 0.45;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.twinkleAngle += p.twinkleSpeed;

      if (p.y < minY) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      const dynamicOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.twinkleAngle));

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, dynamicOpacity);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.size > 2.2) {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x - 3, p.y);
        ctx.lineTo(p.x + 3, p.y);
        ctx.moveTo(p.x, p.y - 3);
        ctx.lineTo(p.x, p.y + 3);
        ctx.stroke();
      }
    }

    animFrameId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animFrameId) render();
        } else {
          if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
        }
      });
    },
    { threshold: 0.05 },
  );

  visibilityObserver.observe(sectionEl);
}
