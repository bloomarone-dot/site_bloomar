/**
 * Accueil — révélation progressive + compteurs section Pourquoi
 */
(function initHomeStory() {
  function animateCount(el, to, suffix, duration) {
    const start = performance.now();
    const from = 0;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      el.textContent = `${value}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function runCounters(root) {
    if (!root || root.dataset.counted === '1') return;
    root.dataset.counted = '1';

    root.querySelectorAll('[data-count-to]').forEach((el) => {
      const to = Number(el.getAttribute('data-count-to') || 0);
      const suffix = el.getAttribute('data-count-suffix') || '';
      animateCount(el, to, suffix, 1100);
    });
  }

  function run() {
    if (document.body.dataset.page !== 'index') return;

    const sections = document.querySelectorAll('.reveal-section');
    if (!sections.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveal = (el) => {
      el.classList.add('is-visible');
      const stats = el.querySelector('[data-why-stats]');
      if (stats) {
        if (reduce) {
          stats.querySelectorAll('[data-count-to]').forEach((node) => {
            const to = node.getAttribute('data-count-to');
            const suffix = node.getAttribute('data-count-suffix') || '';
            node.textContent = `${to}${suffix}`;
          });
          stats.dataset.counted = '1';
        } else {
          runCounters(stats);
        }
      }
    };

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
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach((el) => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
