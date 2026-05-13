const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const copyButton = document.querySelector('.copy-email');
const copyMessage = document.querySelector('.copy-message');
const modal = document.querySelector('.modal');
const detailButtons = document.querySelectorAll('.detail-btn');
const modalClose = document.querySelector('.modal-close');
const contactShine = document.querySelector('.contact-shine');

window.addEventListener('load', () => {
  document.body.classList.add('is-loaded');
  animateSkillRings();
  runTypewriter();
});

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
