// ── Contact Form Submission (AJAX + Honeypot + Time-trap) ────
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const formSubmitBtn = document.getElementById('form-submit-btn');

if (contactForm && formStatus && formSubmitBtn) {
  let formInteractionStart = 0;

  // Track when user first interacts with any form input
  contactForm.addEventListener(
    'focusin',
    () => {
      if (!formInteractionStart) formInteractionStart = Date.now();
    },
    { once: true },
  );

  // Accessible live validation feedback: toggle aria-invalid on input blur/input
  const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]');
  requiredFields.forEach((field) => {
    field.addEventListener('blur', () => {
      if (!field.value.trim() || (field.type === 'email' && !field.validity.valid)) {
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.removeAttribute('aria-invalid');
      }
    });

    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        if (field.value.trim() && (field.type !== 'email' || field.validity.valid)) {
          field.removeAttribute('aria-invalid');
        }
      }
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check all required fields on submit
    let hasError = false;
    requiredFields.forEach((field) => {
      if (!field.value.trim() || (field.type === 'email' && !field.validity.valid)) {
        field.setAttribute('aria-invalid', 'true');
        hasError = true;
      } else {
        field.removeAttribute('aria-invalid');
      }
    });

    if (hasError) {
      formStatus.setAttribute('role', 'alert');
      formStatus.className = 'form-status form-status--error is-visible';
      formStatus.textContent = 'Please complete all required fields correctly before submitting.';
      const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const formData = new FormData(contactForm);
    const honey = formData.get('_honey');

    // Honeypot check: if filled by a bot, simulate success without sending
    if (honey) {
      contactForm.reset();
      formStatus.setAttribute('role', 'status');
      formStatus.className = 'form-status form-status--success is-visible';
      formStatus.textContent = 'Thank you! Your message has been sent successfully.';
      return;
    }

    // Time-trap check: if submitted unnaturally fast (<1.8s), add a brief delay
    const elapsedTime = formInteractionStart ? Date.now() - formInteractionStart : 0;
    if (elapsedTime < 1800) {
      await new Promise((r) => setTimeout(r, 1200));
    }

    const btnTextSpan = formSubmitBtn.querySelector('span');
    const originalText = btnTextSpan ? btnTextSpan.textContent : formSubmitBtn.textContent;

    // Loading state
    if (btnTextSpan) btnTextSpan.textContent = 'Sending...';
    formSubmitBtn.disabled = true;
    contactForm.setAttribute('aria-busy', 'true');
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        contactForm.reset();
        requiredFields.forEach((field) => field.removeAttribute('aria-invalid'));
        formInteractionStart = 0;
        if (btnTextSpan) btnTextSpan.textContent = 'Sent! ✓';
        formStatus.setAttribute('role', 'status');
        formStatus.className = 'form-status form-status--success is-visible';
        formStatus.textContent = "Thank you! Your message has been sent. I'll get back to you within 24 hours.";

        setTimeout(() => {
          if (btnTextSpan) btnTextSpan.textContent = originalText;
          formSubmitBtn.disabled = false;
        }, 5000);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn('Form submission error:', err);
      if (btnTextSpan) btnTextSpan.textContent = originalText;
      formSubmitBtn.disabled = false;
      formStatus.setAttribute('role', 'alert');
      formStatus.className = 'form-status form-status--error is-visible';
      formStatus.innerHTML =
        'Could not send message automatically. Please email me directly at <a href="mailto:matthew.mcgrath.b@gmail.com" style="text-decoration: underline;">matthew.mcgrath.b@gmail.com</a>.';
    } finally {
      contactForm.removeAttribute('aria-busy');
    }
  });
}

// ── Contact Form: Topic Sync & Service Pre-fill ──────────────
const topicSelect = document.getElementById('topic-select');
const messageTextarea = document.getElementById('message');

const topicPlaceholders = {
  'Inquiry: Full-Time Software Engineering Role':
    'Tell me about the role, team structure, and tech stack...',
  'Inquiry: React & Next.js Web App':
    'Tell me about the product, features, and timeline...',
  'Inquiry: Landing Page & Marketing Site':
    'Tell me about your design ideas and launch goals...',
  'Inquiry: Site Fixes & Code Audit':
    "Tell me about the bugs or performance issues you're seeing...",
  'Inquiry: Monthly Developer Retainer':
    'Tell me about your stack and monthly maintenance needs...',
  'Inquiry: General Hello':
    "Tell me what's on your mind, or just say hello!...",
};

// 1. Dynamic placeholder change & speech bubble reaction when user selects an option
if (topicSelect && messageTextarea) {
  topicSelect.addEventListener('change', () => {
    const customPlaceholder = topicPlaceholders[topicSelect.value];
    if (customPlaceholder && !messageTextarea.value) {
      messageTextarea.placeholder = customPlaceholder;
    }
    triggerTopicBubble(topicSelect.value);
  });
}

// 2. Pre-fill & sync dropdown when user clicks "Get a Quote →" or any service CTA
document.querySelectorAll('[data-service-subject]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const subject = btn.getAttribute('data-service-subject');
    const msgStarter = btn.getAttribute('data-service-msg');

    // Sync the <select> dropdown option & trigger speech bubble
    if (topicSelect && subject) {
      topicSelect.value = subject;
      triggerTopicBubble(subject);
    }

    // Pre-fill polite 1-liner into message and focus
    if (messageTextarea && msgStarter) {
      messageTextarea.value = msgStarter;
      setTimeout(() => {
        messageTextarea.focus();
        messageTextarea.setSelectionRange(messageTextarea.value.length, messageTextarea.value.length);
      }, 350);
    }
  });
});

// ── Contact Avatar Porthole Depth Tracking & Contextual Speech Bubble ────
const contactSection = document.getElementById('contact');
const avatarChassis = document.getElementById('contact-avatar-chassis');
const avatarWrap = document.getElementById('contact-avatar-wrap');
const avatarImg = document.getElementById('contact-avatar-img');
const speechBubble = document.getElementById('contact-speech-bubble');
const bubbleTag = document.getElementById('contact-bubble-tag');
const bubbleTitle = document.getElementById('contact-bubble-title');
const bubbleSub = document.getElementById('contact-bubble-sub');

// Topic-specific speech bubble messages (matching introductory lines)
const topicBubbleMessages = {
  'Inquiry: Full-Time Software Engineering Role': {
    tag: '💼 Engineering Role',
    title: 'Hiring for your team?',
    sub: 'Tell me about the role, team structure, and tech stack.',
  },
  'Inquiry: React & Next.js Web App': {
    tag: '⚡ Web App Architecture',
    title: 'Building a web app?',
    sub: 'Tell me about the product, features, and timeline.',
  },
  'Inquiry: Landing Page & Marketing Site': {
    tag: '🌐 Landing Page & Brand',
    title: 'Launching a site?',
    sub: 'Tell me about your design ideas and launch goals.',
  },
  'Inquiry: Site Fixes & Code Audit': {
    tag: '🔍 Bug Fixes & Code Audit',
    title: 'Need code fixes or a tune-up?',
    sub: "Tell me about the bugs or performance issues you're seeing.",
  },
  'Inquiry: Monthly Developer Retainer': {
    tag: '🛠️ Ongoing Retainer',
    title: 'Need ongoing support?',
    sub: 'Tell me about your stack and monthly maintenance needs.',
  },
  'Inquiry: General Hello': {
    tag: '☕ Just Saying Hello',
    title: 'Always glad to chat.',
    sub: "Tell me what's on your mind, or just say hello!",
  },
};

const defaultGreeting = {
  tag: "👋 Let's Connect!",
  title: 'How can I help?',
  sub: "Tell me about what you're looking to build or hire for.",
};

let topicBubbleTimer = null;
let isHoveringAvatar = false;

const setBubbleContent = (content) => {
  if (!speechBubble || !bubbleTitle || !bubbleSub) return;
  if (bubbleTag && content.tag) bubbleTag.textContent = content.tag;
  bubbleTitle.textContent = content.title;
  bubbleSub.textContent = content.sub;
};

const showBubble = (content) => {
  if (!speechBubble) return;
  setBubbleContent(content);
  speechBubble.classList.add('is-active');
};

const hideBubble = () => {
  if (!speechBubble) return;
  speechBubble.classList.remove('is-active');
};

const triggerTopicBubble = (topicKey) => {
  const content = topicBubbleMessages[topicKey];
  if (!content) return;

  if (topicBubbleTimer) {
    clearTimeout(topicBubbleTimer);
    topicBubbleTimer = null;
  }

  showBubble(content);

  // Stays visible for 5 seconds, then dismisses automatically
  topicBubbleTimer = setTimeout(() => {
    topicBubbleTimer = null;
    if (!isHoveringAvatar) {
      hideBubble();
    }
  }, 5000);
};

// Porthole depth cursor tracking on avatar
if (contactSection && avatarWrap && avatarImg) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const maxShift = 20; // 20px travel for depth parallax
    let ticking = false;

    contactSection.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = avatarWrap.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Normalized from -1 to 1 across viewport
        const normX = Math.max(-1, Math.min(1, deltaX / (window.innerWidth * 0.45)));
        const normY = Math.max(-1, Math.min(1, deltaY / (window.innerHeight * 0.45)));

        // Specular rim light reflection
        const lightX = 50 + normX * 35;
        const lightY = 50 + normY * 35;
        avatarWrap.style.setProperty('--contact-light-x', `${lightX}%`);
        avatarWrap.style.setProperty('--contact-light-y', `${lightY}%`);

        // Inside image shifts towards cursor with porthole depth
        const shiftX = normX * maxShift;
        const shiftY = normY * maxShift;
        avatarImg.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(1.14)`;

        ticking = false;
      });
    }, { passive: true });

    contactSection.addEventListener('mouseenter', () => {
      avatarImg.style.willChange = 'transform';
    }, { passive: true });

    contactSection.addEventListener('mouseleave', () => {
      avatarImg.style.transform = 'translate(0px, 0px) scale(1.14)';
      avatarImg.style.willChange = 'auto';
    });
  }
}

// Hover event: Generic greeting while hovering avatar image
if (avatarChassis) {
  avatarChassis.addEventListener('mouseenter', () => {
    isHoveringAvatar = true;
    if (topicBubbleTimer) {
      clearTimeout(topicBubbleTimer);
      topicBubbleTimer = null;
    }
    showBubble(defaultGreeting);
  });

  avatarChassis.addEventListener('mouseleave', () => {
    isHoveringAvatar = false;
    hideBubble();
  });
}
