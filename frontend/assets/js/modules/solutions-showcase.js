/**
 * Solutions showcase — liste interactive + panneau de démonstration
 * Réutilisable via [data-sol-showcase]
 */
(function initSolutionsShowcase() {
  const HOVER_MQ = '(hover: hover) and (pointer: fine)';

  function activate(root, id) {
    const triggers = root.querySelectorAll('[data-sol-trigger]');
    const panels = root.querySelectorAll('[data-sol-panel]');
    if (!id) return;

    triggers.forEach((btn) => {
      const on = btn.getAttribute('data-sol-trigger') === id;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      btn.tabIndex = on ? 0 : -1;
    });

    panels.forEach((panel) => {
      const on = panel.getAttribute('data-sol-panel') === id;
      panel.classList.toggle('is-active', on);
      panel.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    root.setAttribute('data-active', id);
  }

  function setup(root) {
    if (root.dataset.solReady === '1') return;
    root.dataset.solReady = '1';

    const triggers = Array.from(root.querySelectorAll('[data-sol-trigger]'));
    if (!triggers.length) return;

    const initial =
      root.querySelector('[data-sol-trigger].is-active')?.getAttribute('data-sol-trigger') ||
      triggers[0].getAttribute('data-sol-trigger');
    activate(root, initial);

    const canHover = () => window.matchMedia(HOVER_MQ).matches;

    triggers.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        activate(root, btn.getAttribute('data-sol-trigger'));
      });

      btn.addEventListener('mouseenter', () => {
        if (!canHover()) return;
        activate(root, btn.getAttribute('data-sol-trigger'));
      });

      btn.addEventListener('focus', () => {
        activate(root, btn.getAttribute('data-sol-trigger'));
      });

      btn.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const next =
          event.key === 'ArrowDown'
            ? triggers[(index + 1) % triggers.length]
            : triggers[(index - 1 + triggers.length) % triggers.length];
        next.focus();
        activate(root, next.getAttribute('data-sol-trigger'));
      });
    });
  }

  function run(scope) {
    const root = scope || document;
    root.querySelectorAll('[data-sol-showcase]').forEach(setup);
  }

  window.BloomarSolutionsShowcase = { init: run };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => run());
  } else {
    run();
  }
})();
