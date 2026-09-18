// Independent copy of the same underlying technique used elsewhere on the site
// (transform-based parallax via requestAnimationFrame, reveal via IntersectionObserver),
// namespaced with data-oh-* / .oh-visible so this project shares no state or styling
// with any other case study.

const ohParallaxEls = Array.from(document.querySelectorAll('[data-oh-parallax]'));
let ohTicking = false;

function ohUpdateParallax() {
  const viewportH = window.innerHeight;

  ohParallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.16');
    const host = el.parentElement;
    const rect = host.getBoundingClientRect();
    const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
    const offset = progress * speed * viewportH * -0.5;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });

  ohTicking = false;
}

function ohOnScroll() {
  if (!ohTicking) {
    window.requestAnimationFrame(ohUpdateParallax);
    ohTicking = true;
  }
}

const ohPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!ohPrefersReduced) {
  window.addEventListener('scroll', ohOnScroll, { passive: true });
  window.addEventListener('resize', ohOnScroll);
  ohUpdateParallax();
}

const ohRevealEls = document.querySelectorAll('[data-oh-reveal]');
const ohObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('oh-visible');
        ohObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
ohRevealEls.forEach((el) => ohObserver.observe(el));
