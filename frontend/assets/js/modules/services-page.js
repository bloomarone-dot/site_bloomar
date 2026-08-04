/**
 * Page Services — révélation progressive (même esprit que Home)
 */
(function initServicesPage() {
  function run() {
    if (document.body.dataset.page !== 'services') return;

    const sections = document.querySelectorAll('.reveal-section');
    if (!sections.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveal = (el) => el.classList.add('is-visible');

    if (reduce || !('IntersectionObserver' in window)) {
      sections.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach((el) => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
