const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const copyButton = document.querySelector('.copy-email');
const copyMessage = document.querySelector('.copy-message');
const modal = document.querySelector('.modal');
const detailButtons = document.querySelectorAll('.detail-btn');
const modalClose = document.querySelector('.modal-close');
const contactShine = document.querySelector('.contact-shine');
const introBanner = document.querySelector('.intro-banner');
const profileSection = document.querySelector('.portfolio-board');
let introTouchStartY = 0;
let isIntroScrollJumping = false;

if (introBanner) {
  document.body.classList.add('has-intro');
}

window.addEventListener('load', () => {
  document.body.classList.add('is-loaded');
  animateSkillRings();
  runTypewriter();
  runIntroBannerTypewriter();
});

if (introBanner && profileSection) {
  window.addEventListener('wheel', handleIntroWheel, { passive: false });
  window.addEventListener('touchstart', handleIntroTouchStart, { passive: true });
  window.addEventListener('touchmove', handleIntroTouchMove, { passive: false });
  window.addEventListener('scroll', revealIntroControlsOnScroll, { passive: true });
}

function showIntroControls() {
  document.body.classList.add('intro-ready');
}

function revealIntroControlsOnScroll() {
  if (window.scrollY > 0) {
    showIntroControls();
  }
}

function getHeaderHeight() {
  return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
}

function isInsideIntro() {
  return window.scrollY < introBanner.offsetHeight - getHeaderHeight() - 10;
}

function isIntroVisible() {
  return isIntroVisibleAt(window.scrollY);
}

function isIntroVisibleAt(scrollY) {
  const rect = introBanner.getBoundingClientRect();
  const predictedTop = rect.top + window.scrollY - scrollY;
  const predictedBottom = predictedTop + introBanner.offsetHeight;
  return predictedBottom > getHeaderHeight() && predictedTop < window.innerHeight;
}

function scrollToIntroTop(force = false) {
  if (isIntroScrollJumping || window.scrollY <= 0 || (!force && !isIntroVisible())) return;

  isIntroScrollJumping = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  window.setTimeout(() => {
    isIntroScrollJumping = false;
  }, 700);
}

function scrollToProfileSection() {
  if (isIntroScrollJumping || !isInsideIntro()) return;

  isIntroScrollJumping = true;
  const targetTop = profileSection.getBoundingClientRect().top + window.scrollY - getHeaderHeight();
  window.scrollTo({ top: targetTop, behavior: 'smooth' });

  window.setTimeout(() => {
    isIntroScrollJumping = false;
  }, 700);
}

function handleIntroWheel(event) {
  showIntroControls();

  const nextScrollY = Math.max(0, window.scrollY + event.deltaY);

  if (event.deltaY < 0 && isIntroVisibleAt(nextScrollY)) {
    event.preventDefault();
    scrollToIntroTop(true);
    return;
  }

  if (event.deltaY <= 0 || !isInsideIntro()) return;

  event.preventDefault();
  scrollToProfileSection();
}

function handleIntroTouchStart(event) {
  introTouchStartY = event.touches[0].clientY;
}

function handleIntroTouchMove(event) {
  showIntroControls();

  const currentY = event.touches[0].clientY;
  const isSwipingDownPage = introTouchStartY - currentY > 12;
  const isSwipingUpPage = currentY - introTouchStartY > 12;
  const nextScrollY = Math.max(0, window.scrollY - (currentY - introTouchStartY));

  if (isSwipingUpPage && isIntroVisibleAt(nextScrollY)) {
    event.preventDefault();
    scrollToIntroTop(true);
    return;
  }

  if (!isSwipingDownPage || !isInsideIntro()) return;

  event.preventDefault();
  scrollToProfileSection();
}

function runTypewriter() {
  const target = document.querySelector('.typewriter');
  if (!target) return;

  const text = target.dataset.text || '';
  let index = 0;
  target.textContent = '';
  target.classList.remove('is-complete');
  target.classList.remove('is-visible');

  requestAnimationFrame(() => {
    target.classList.add('is-visible');

    const timer = setInterval(() => {
      target.textContent += text[index] || '';
      index += 1;

      if (index >= text.length) {
        clearInterval(timer);
        setTimeout(() => {
          target.classList.add('is-complete');
        }, 450);
      }
    }, 170);
  });
}

async function runIntroBannerTypewriter() {
  const lines = document.querySelectorAll('.intro-banner__content p, .intro-banner__content h1');
  if (!lines.length) return;

  await Promise.all(Array.from(lines, (line) => {
    if (line.tagName === 'H1') {
      return revealTextCharacters(line, 95);
    }

    return typeTextLine(line, 125);
  }));

  showIntroControls();
}

function typeTextLine(target, speed) {
  return new Promise((resolve) => {
    const text = target.dataset.text || target.textContent.trim();
    const characters = Array.from(text);
    let index = 0;

    target.dataset.text = text;
    target.textContent = '';
    target.classList.add('intro-text-line');
    target.classList.remove('is-complete');
    target.classList.remove('is-active');
    target.classList.remove('is-visible');

    requestAnimationFrame(() => {
      target.classList.add('is-visible');
      target.classList.add('is-active');

      const timer = setInterval(() => {
        target.textContent += characters[index] || '';
        index += 1;

        if (index >= characters.length) {
          clearInterval(timer);
          target.classList.remove('is-active');
          target.classList.add('is-complete');
          resolve();
        }
      }, speed);
    });
  });
}

function revealTextCharacters(target, speed) {
  return new Promise((resolve) => {
    const text = target.dataset.text || target.textContent.trim();
    const characters = Array.from(text);
    let index = 0;

    target.dataset.text = text;
    target.textContent = '';
    target.classList.add('intro-text-line');
    target.classList.remove('is-complete');
    target.classList.remove('is-active');
    target.classList.remove('is-visible');

    characters.forEach((value) => {
      const character = document.createElement('span');
      character.className = 'intro-char';
      character.textContent = value === ' ' ? '\u00a0' : value;
      target.appendChild(character);
    });

    const characterElements = target.querySelectorAll('.intro-char');

    requestAnimationFrame(() => {
      target.classList.add('is-visible');

      const timer = setInterval(() => {
        characterElements[index].classList.add('is-visible');
        index += 1;

        if (index >= characterElements.length) {
          clearInterval(timer);
          window.setTimeout(() => {
            target.classList.remove('is-active');
            target.classList.add('is-complete');
            resolve();
          }, 360);
        }
      }, speed);
    });
  });
}

function animateSkillRings() {
  document.querySelectorAll('.skill-ring').forEach((ring) => {
    const target = Number(ring.dataset.value) || 0;
    const progressCircle = ring.querySelector('.ring-progress');
    const length = progressCircle.getTotalLength();
    const duration = 1350;
    const startedAt = performance.now();

    progressCircle.style.strokeDasharray = length;
    progressCircle.style.strokeDashoffset = length;

    function tick(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      progressCircle.style.strokeDashoffset = length * (1 - (target * eased) / 100);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
}

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('is-open');
});

document.querySelectorAll('.nav-list a').forEach((link) => {
  link.addEventListener('click', () => {
    navList.classList.remove('is-open');
  });
});

contactShine.addEventListener('pointermove', (event) => {
  const rect = contactShine.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  contactShine.style.setProperty('--shine-x', `${x}%`);
  contactShine.style.setProperty('--shine-y', `${y}%`);
});

copyButton.addEventListener('click', async () => {
  const email = copyButton.dataset.email;

  try {
    await navigator.clipboard.writeText(email);
    showToast(`${email} 주소가 클립보드에 복사되었습니다.`);
  } catch (error) {
    showToast('복사에 실패했습니다. 브라우저 권한을 확인해주세요.');
  }
});

let toastTimer;

function showToast(message) {
  copyMessage.textContent = message;
  copyMessage.classList.add('is-visible');
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    copyMessage.classList.remove('is-visible');
  }, 1300);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const openModal = () => {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
};

detailButtons.forEach((button) => {
  button.addEventListener('click', openModal);
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});
