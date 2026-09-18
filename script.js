// ---------- 1) PARALLAX PE SCROLL ----------
// Idee: fiecare element [data-parallax] are un data-speed (0 = fix pe ecran, 1 = se mișcă
// exact cu pagina). Sub 1 -> imaginea pare mai "în spate" -> asta e efectul de parallax.
// Recalculăm poziția doar în requestAnimationFrame, nu direct în evenimentul de scroll,
// ca să nu blocăm thread-ul principal (scroll jank).

const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
let ticking = false;

function updateParallax() {
  const viewportH = window.innerHeight;

  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.2');
    const rect = el.parentElement.getBoundingClientRect();

    // cât de aproape e secțiunea de centrul ecranului (-1 ... 1)
    const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;

    // deplasăm imaginea invers față de scroll, scalat cu "speed"
    const offset = progress * speed * viewportH * -0.5;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });

  ticking = false;
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateParallax();
}

// ---------- 2) REVEAL LA SCROLL ----------
// IntersectionObserver marchează elementul cu .is-visible quando intră în viewport.
// Restul (fade + translateY) e pur CSS -> mult mai ieftin decât să animăm din JS.

const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);
revealEls.forEach((el) => io.observe(el));

// ---------- 3) FAQ ACCORDION ----------
// Fiecare .faq-item are un buton .faq-question și un panou .faq-answer.
// La click, deschidem panoul curent setând max-height la scrollHeight (înălțimea reală
// a conținutului) — CSS-ul face restul (tranziția). Închidem orice alt panou deschis,
// ca să rămână mereu un singur răspuns vizibil odată.

const faqItems = document.querySelectorAll('[data-faq]');

faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    faqItems.forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});
