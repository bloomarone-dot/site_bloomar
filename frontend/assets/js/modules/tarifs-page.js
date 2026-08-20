/**
 * Page Tarifs — reveals
 */
(function initTarifsPage() {
    'use strict';

    function initReveals() {
        const els = document.querySelectorAll('.premium-reveal');
        if (!els.length) return;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-visible');
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        els.forEach((el) => io.observe(el));
    }

    function boot() {
        if (document.body.dataset.page !== 'tarifs') return;
        initReveals();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    document.addEventListener('DOMContentLoaded', boot);
    document.addEventListener('layoutReady', boot);
})();
