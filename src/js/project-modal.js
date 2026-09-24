/* ── Project Case Studies Modal (Native HTML5 Dialog) ── */
import { PROJECTS_DATA } from './projects-data.js';

const modal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalTagline = document.getElementById('modal-tagline');
const modalStats = document.getElementById('modal-stats');
const modalVideoWrap = document.getElementById('modal-video-wrap');
const modalOverview = document.getElementById('modal-overview');
const modalChallenge = document.getElementById('modal-challenge');
const modalArchitecture = document.getElementById('modal-architecture');
const modalTags = document.getElementById('modal-tags');
const modalLiveBtn = document.getElementById('modal-live-btn');
const modalCodeBtn = document.getElementById('modal-code-btn');

let lastFocusedElement = null;

export function openProjectModal(projectId) {
  if (!modal) return;
  const project = PROJECTS_DATA[projectId];
  if (!project) return;

  lastFocusedElement = document.activeElement;

  if (modalCategory) modalCategory.textContent = project.category;
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalTagline) modalTagline.textContent = project.tagline;

  // Stats
  if (modalStats) {
    modalStats.replaceChildren();
    for (const stat of project.stats) {
      const box = document.createElement('div');
      box.className = 'project-modal__stat-box';

      const label = document.createElement('span');
      label.className = 'project-modal__stat-label';
      label.textContent = stat.label;

      const val = document.createElement('span');
      val.className = 'project-modal__stat-val';
      val.textContent = stat.value;

      box.appendChild(label);
      box.appendChild(val);
      modalStats.appendChild(box);
    }
  }

  // Video Embed
  if (modalVideoWrap) {
    modalVideoWrap.replaceChildren();
    const embedUrl = project.embedUrl || project.videoEmbed;
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = `${project.title} Video Preview`;
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      );
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.aspectRatio = '16 / 9';
      iframe.style.borderRadius = '12px';
      iframe.style.border = '1px solid rgba(255, 255, 255, 0.15)';
      iframe.style.display = 'block';
      iframe.style.backgroundColor = '#000000';
      modalVideoWrap.appendChild(iframe);
      modalVideoWrap.removeAttribute('hidden');
      modalVideoWrap.style.display = 'block';
      modalVideoWrap.style.width = '100%';
      modalVideoWrap.style.aspectRatio = '16 / 9';
    } else {
      modalVideoWrap.setAttribute('hidden', '');
      modalVideoWrap.style.display = 'none';
    }
  }

  if (modalOverview) modalOverview.textContent = project.overview;
  if (modalChallenge) modalChallenge.textContent = project.challenge;
  if (modalArchitecture) modalArchitecture.textContent = project.architecture;

  // Tech stack tags
  if (modalTags) {
    modalTags.replaceChildren();
    for (const tag of project.techStack) {
      const span = document.createElement('span');
      span.className = 'project-tag';
      span.textContent = tag;
      modalTags.appendChild(span);
    }
  }

  // Action links
  if (modalLiveBtn) {
    if (project.liveUrl) {
      modalLiveBtn.href = project.liveUrl;
      modalLiveBtn.style.display = 'inline-flex';
      const liveSpan = modalLiveBtn.querySelector('span');
      if (liveSpan) liveSpan.textContent = project.liveLabel || 'View Live Demo';
    } else {
      modalLiveBtn.style.display = 'none';
    }
  }

  if (modalCodeBtn) {
    if (project.codeUrl) {
      modalCodeBtn.href = project.codeUrl;
      modalCodeBtn.style.display = 'inline-flex';
    } else {
      modalCodeBtn.style.display = 'none';
    }
  }

  // Open native dialog
  modal.showModal();
  modal.scrollTop = 0;
  const inner = modal.querySelector('.project-modal__inner');
  if (inner) inner.scrollTop = 0;

  if (modalCloseBtn) modalCloseBtn.focus();
}

export function closeProjectModal() {
  if (!modal || !modal.open) return;
  if (modalVideoWrap) {
    modalVideoWrap.replaceChildren();
    modalVideoWrap.style.display = 'none';
  }
  modal.close();
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

// Attach event listeners
if (modal) {
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog || e.target === modal) {
      closeProjectModal();
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  // Wire up project cards
  const projectCards = document.querySelectorAll('[data-project-id]');
  projectCards.forEach((card) => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');

    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button, .project-card__links, .project-featured__links')) {
        return;
      }
      openProjectModal(card.dataset.projectId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a, button, .project-card__links, .project-featured__links')) {
          return;
        }
        e.preventDefault();
        openProjectModal(card.dataset.projectId);
      }
    });
  });
}
