/**
 * Skills & Experience Studio Controller Module
 * Interactive IDE code editor + simplified Git graph timeline controller.
 */

import { allSkills, overviewTemplate } from './skills-data.js';

export function loadSkill(key) {
  const data = allSkills[key];
  if (!data) return;

  // 1. Update Desktop & Mobile Sidebar Items (Sync aria-selected)
  document.querySelectorAll('.file-item').forEach((f) => {
    const isTarget = f.getAttribute('data-skill') === key;
    f.classList.toggle('active', isTarget);
    f.setAttribute('aria-selected', String(isTarget));
  });

  // Auto-expand parent folder if collapsed
  const el = document.getElementById(`side-${key}`);
  if (el) {
    const parentFolder = el.closest('.folder-content');
    if (parentFolder && parentFolder.classList.contains('hidden')) {
      parentFolder.classList.remove('hidden');
      const prevHeader = parentFolder.previousElementSibling;
      if (prevHeader) {
        prevHeader.classList.remove('collapsed');
        prevHeader.setAttribute('aria-expanded', 'true');
      }
    }
  }

  const sidebar = document.getElementById('ide-sidebar');
  if (sidebar) updateRovingTabindex(sidebar);

  // 2. Update Interactive Editor Tab
  const tabLabel = document.getElementById('tab-label-text');
  if (tabLabel) {
    tabLabel.innerHTML = `${data.icon} ${data.name}`;
  }

  // 3. Auto-collapse mobile file drawer on file selection
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    const tabBtn = document.getElementById('active-tab-title');
    if (tabBtn) tabBtn.setAttribute('aria-expanded', 'false');
  }

  // Toggle Back to Overview button in the tab bar
  const backBtn = document.getElementById('btn-back-to-overview');
  if (backBtn) {
    backBtn.classList.toggle('hidden', !!data.isOverview);
  }

  // 5. Render Canvas (Overview Markdown vs Code Lines)
  const codeCanvas = document.getElementById('code-canvas-body');
  if (codeCanvas) {
    if (data.isOverview) {
      codeCanvas.classList.remove('is-code');
      codeCanvas.classList.add('is-overview');
      codeCanvas.innerHTML = overviewTemplate;
    } else {
      codeCanvas.classList.remove('is-overview');
      codeCanvas.classList.add('is-code');
      let codeHtml = '';
      data.lines.forEach((l, idx) => {
        codeHtml += `<div class="code-line"><span class="line-no">${idx + 1}</span><span>${l}</span></div>`;
      });
      codeCanvas.innerHTML = codeHtml;
    }
    codeCanvas.scrollTop = 0;
  }
}

export function toggleFolder(folderId, headerEl) {
  const content = typeof folderId === 'string' ? document.getElementById(folderId) : folderId;
  if (!content) return;
  const isHidden = content.classList.toggle('hidden');
  if (headerEl) {
    headerEl.classList.toggle('collapsed', isHidden);
    headerEl.setAttribute('aria-expanded', String(!isHidden));
  }
}

export function toggleMobileExplorer() {
  const drawer = document.getElementById('ide-sidebar');
  const toggleBtn = document.getElementById('active-tab-title');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('open');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  }
}

export function toggleConsoleDrawer() {
  const drawer = document.getElementById('console-drawer-panel');
  const toggleBtn = document.getElementById('console-drawer-status-bar');
  const indicator = document.getElementById('drawer-indicator-text');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('open');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  }
  if (indicator) {
    indicator.textContent = isOpen ? '5 commits ▴' : '5 commits ▾';
  }
}

// ── Roving Tabindex & Tree Navigation ──────────────────────────────
export function updateRovingTabindex(container) {
  if (!container) return;
  // Get all visible interactive elements in the sidebar (folders and non-hidden files)
  const items = getVisibleNavItems(container);
  if (!items.length) return;

  // Check if any item already has active class or aria-selected="true"
  let targetItem = items.find((el) => el.classList.contains('active') || el.getAttribute('aria-selected') === 'true');
  if (!targetItem) targetItem = items[0];

  items.forEach((el) => {
    if (el === targetItem) {
      el.setAttribute('tabindex', '0');
    } else {
      el.setAttribute('tabindex', '-1');
    }
  });
}

function getVisibleNavItems(container) {
  // Select folder headers and file items that are not in a hidden container
  const allElements = container.querySelectorAll('.folder-header, .file-item');
  return Array.from(allElements).filter((el) => {
    const parentFolder = el.closest('.folder-content');
    if (parentFolder && parentFolder.classList.contains('hidden')) {
      return false;
    }
    return el.offsetParent !== null || window.getComputedStyle(el).display !== 'none';
  });
}

function handleTreeKeydown(e, container) {
  const visibleItems = getVisibleNavItems(container);
  if (!visibleItems.length) return;

  const currentIdx = visibleItems.indexOf(document.activeElement);
  if (currentIdx === -1) return;

  const currentEl = visibleItems[currentIdx];
  let nextIdx = -1;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      nextIdx = (currentIdx + 1) % visibleItems.length;
      break;

    case 'ArrowUp':
      e.preventDefault();
      nextIdx = (currentIdx - 1 + visibleItems.length) % visibleItems.length;
      break;

    case 'Home':
      e.preventDefault();
      nextIdx = 0;
      break;

    case 'End':
      e.preventDefault();
      nextIdx = visibleItems.length - 1;
      break;

    case 'ArrowRight':
      // If on a collapsed folder, expand it
      if (currentEl.classList.contains('folder-header')) {
        const targetId = currentEl.getAttribute('data-folder-target');
        const folder = document.getElementById(targetId);
        if (folder && folder.classList.contains('hidden')) {
          e.preventDefault();
          toggleFolder(targetId, currentEl);
          updateRovingTabindex(container);
        }
      }
      return;

    case 'ArrowLeft':
      // If on an expanded folder, collapse it
      if (currentEl.classList.contains('folder-header')) {
        const targetId = currentEl.getAttribute('data-folder-target');
        const folder = document.getElementById(targetId);
        if (folder && !folder.classList.contains('hidden')) {
          e.preventDefault();
          toggleFolder(targetId, currentEl);
          updateRovingTabindex(container);
        }
      } else if (currentEl.classList.contains('file-item')) {
        // If on a file item, jump focus to its parent folder header
        const parentFolder = currentEl.closest('.folder-content');
        if (parentFolder && parentFolder.previousElementSibling) {
          e.preventDefault();
          const folderHeader = parentFolder.previousElementSibling;
          visibleItems.forEach((item) => item.setAttribute('tabindex', '-1'));
          folderHeader.setAttribute('tabindex', '0');
          folderHeader.focus();
        }
      }
      return;

    case 'Enter':
    case ' ':
      if (currentEl.classList.contains('file-item')) {
        e.preventDefault();
        const skill = currentEl.getAttribute('data-skill');
        if (skill) loadSkill(skill);
      }
      return;

    default:
      return;
  }

  if (nextIdx !== -1) {
    const nextEl = visibleItems[nextIdx];
    visibleItems.forEach((item) => item.setAttribute('tabindex', '-1'));
    nextEl.setAttribute('tabindex', '0');
    nextEl.focus();

    // If it's a file, preview/load it immediately for a fluid IDE experience
    if (nextEl.classList.contains('file-item')) {
      const skill = nextEl.getAttribute('data-skill');
      if (skill) loadSkill(skill);
    }
  }
}

// Attach globally to window for resilience
if (typeof window !== 'undefined') {
  window.loadSkill = loadSkill;
  window.toggleFolder = toggleFolder;
  window.toggleMobileExplorer = toggleMobileExplorer;
  window.toggleConsoleDrawer = toggleConsoleDrawer;
}

// Delegated Click Handling on document
document.addEventListener('click', (e) => {
  // 1. Skill Trigger Click (Sidebar file, Overview matrix tag, or Back button)
  const skillTrigger = e.target.closest('[data-skill]');
  if (skillTrigger) {
    const skill = skillTrigger.getAttribute('data-skill');
    if (skill) {
      loadSkill(skill);
      return;
    }
  }

  // 2. Sidebar File Item fallback
  const fileItem = e.target.closest('.file-item');
  if (fileItem) {
    const skill = fileItem.getAttribute('data-skill') || fileItem.id.replace('side-', '');
    if (skill) {
      loadSkill(skill);
      return;
    }
  }

  // 3. Collapsible Folder Header Click
  const folderHeader = e.target.closest('.folder-header');
  if (folderHeader) {
    const targetId = folderHeader.getAttribute('data-folder-target');
    if (targetId) {
      const content = document.getElementById(targetId);
      if (content) {
        const isHidden = content.classList.toggle('hidden');
        folderHeader.classList.toggle('collapsed', isHidden);
        folderHeader.setAttribute('aria-expanded', String(!isHidden));
        const sidebar = folderHeader.closest('#ide-sidebar');
        if (sidebar) updateRovingTabindex(sidebar);
      }
    }
    return;
  }

  // 4. Interactive Active Tab (Mobile File Switcher) Click
  const tabToggle = e.target.closest('#active-tab-title');
  if (tabToggle) {
    // Only toggle on mobile screens (< 768px) where drawer operates
    if (window.innerWidth < 768) {
      toggleMobileExplorer();
    }
    return;
  }

  // 5. Console Status Bar Click
  const consoleToggle = e.target.closest('#console-drawer-status-bar');
  if (consoleToggle) {
    toggleConsoleDrawer();
    return;
  }
});

// Attach keydown listener for sidebar explorer
const ideSidebar = document.getElementById('ide-sidebar');
if (ideSidebar) {
  ideSidebar.addEventListener('keydown', (e) => handleTreeKeydown(e, ideSidebar));
}

// Auto-run when DOM is ready
const initSkillsStudio = () => {
  const totalSkillsCount = Object.keys(allSkills).length;
  const mobileFileCountEl = document.getElementById('ide-mobile-file-count');
  if (mobileFileCountEl) {
    mobileFileCountEl.textContent = `${totalSkillsCount} files`;
  }
  loadSkill('overview');

  const sidebar = document.getElementById('ide-sidebar');
  if (sidebar) updateRovingTabindex(sidebar);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkillsStudio);
} else {
  initSkillsStudio();
}
