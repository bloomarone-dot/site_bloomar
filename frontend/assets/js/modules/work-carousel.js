/**
 * Carrousel réalisations — réutilisable via [data-work-carousel]
 * Flèches, progression, swipe tactile, clavier.
 */
(function initWorkCarousel() {
  const SWIPE_THRESHOLD = 48;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function setup(root) {
    if (root.dataset.workReady === '1') return;
    root.dataset.workReady = '1';

    const track = root.querySelector('[data-work-track]');
    const slides = Array.from(root.querySelectorAll('[data-work-slide]'));
    const prevBtn = root.querySelector('[data-work-prev]');
    const nextBtn = root.querySelector('[data-work-next]');
    const progress = root.querySelector('[data-work-progress]');
    const count = root.querySelector('[data-work-count]');
    const viewport = root.querySelector('.work-carousel__viewport');

    if (!track || slides.length < 2) return;

    let index = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains('is-active'))
    );
    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function render() {
      track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
      slides.forEach((slide, i) => {
        const on = i === index;
        slide.classList.toggle('is-active', on);
        slide.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      if (progress) {
        progress.style.width = `${((index + 1) / slides.length) * 100}%`;
      }
      if (count) {
        count.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      }
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    }

    function goTo(next) {
      index = Math.max(0, Math.min(slides.length - 1, next));
      render();
    }

    prevBtn?.addEventListener('click', () => goTo(index - 1));
    nextBtn?.addEventListener('click', () => goTo(index + 1));

    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    if (!viewport) {
      render();
      return;
    }

    viewport.addEventListener(
      'touchstart',
      (event) => {
        if (!event.touches[0]) return;
        dragging = true;
        startX = event.touches[0].clientX;
        deltaX = 0;
        if (!reduce) track.style.transition = 'none';
      },
      { passive: true }
    );

    viewport.addEventListener(
      'touchmove',
      (event) => {
        if (!dragging || !event.touches[0]) return;
        deltaX = event.touches[0].clientX - startX;
        const offset = -index * 100 + (deltaX / viewport.clientWidth) * 100;
        track.style.transform = `translate3d(${offset}%, 0, 0)`;
      },
      { passive: true }
    );

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (!reduce) {
        track.style.transition = '';
      }
      if (deltaX > SWIPE_THRESHOLD) goTo(index - 1);
      else if (deltaX < -SWIPE_THRESHOLD) goTo(index + 1);
      else render();
      deltaX = 0;
    }

    viewport.addEventListener('touchend', endDrag);
    viewport.addEventListener('touchcancel', endDrag);

    root.setAttribute('tabindex', '0');
    render();
  }

  function run(scope) {
    (scope || document).querySelectorAll('[data-work-carousel]').forEach(setup);
  }

  window.BloomarWorkCarousel = { init: run };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => run());
  } else {
    run();
  }
})();
