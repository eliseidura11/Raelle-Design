// Same underlying technique as the rest of the site (transform-based parallax,
// driven by requestAnimationFrame; reveal via IntersectionObserver) but kept as
// its own file with its own attribute names (data-bx-*), so this project never
// shares state or styling with any other case study.

const bxParallaxEls = Array.from(document.querySelectorAll('[data-bx-parallax]'));
let bxTicking = false;

function bxUpdateParallax() {
  const viewportH = window.innerHeight;

  bxParallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.18');
    const host = el.closest('.bx-arch, .bx-panel-media') || el.parentElement;
    const rect = host.getBoundingClientRect();
    const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
    const offset = progress * speed * viewportH * -0.5;
    el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
  });

  bxTicking = false;
}

function bxOnScroll() {
  if (!bxTicking) {
    window.requestAnimationFrame(bxUpdateParallax);
    bxTicking = true;
  }
}

const bxPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!bxPrefersReduced) {
  window.addEventListener('scroll', bxOnScroll, { passive: true });
  window.addEventListener('resize', bxOnScroll);
  bxUpdateParallax();
}

// Reveal on scroll
const bxRevealEls = document.querySelectorAll('[data-bx-reveal]');
const bxObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('bx-visible');
        bxObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
bxRevealEls.forEach((el) => bxObserver.observe(el));

// Active state in the room index while scrolling
const bxRooms = document.querySelectorAll('.bx-room, .bx-panel[id]');
const bxIndexLinks = document.querySelectorAll('.bx-index a');
if (bxRooms.length && bxIndexLinks.length) {
  const bxNavObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          bxIndexLinks.forEach((a) => {
            a.style.opacity = a.getAttribute('href') === `#${id}` ? '1' : '';
          });
        }
      });
    },
    { threshold: 0.5 }
  );
  bxRooms.forEach((r) => { if (r.id) bxNavObserver.observe(r); });
}
