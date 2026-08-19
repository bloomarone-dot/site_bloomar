/**
 * Page Ressources — particules hero, révélations au scroll
 */
(function initRessourcesPage() {
    'use strict';

    function initParticles() {
        const canvas = document.getElementById('res-hero-particles');
        if (!canvas) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const ctx = canvas.getContext('2d');
        let w = 0;
        let h = 0;
        let particles = [];
        const count = 38;

        function resize() {
            const parent = canvas.parentElement;
            w = canvas.width = parent.offsetWidth;
            h = canvas.height = parent.offsetHeight;
        }

        function seed() {
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.4 + 0.3,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                a: Math.random() * 0.4 + 0.1,
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(167, 139, 250, ${p.a})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(123, 47, 247, ${0.06 * (1 - dist / 90)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(draw);
        }

        resize();
        seed();
        draw();
        window.addEventListener('resize', () => {
            resize();
            seed();
        });
    }

    function initReveals() {
        const els = document.querySelectorAll('.premium-reveal');
        if (!els.length) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !('IntersectionObserver' in window)) {
            els.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-visible');
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        els.forEach((el) => io.observe(el));

        const grid = document.getElementById('res-grid');
        if (grid) io.observe(grid);
    }

    function run() {
        if (document.body.dataset.page !== 'ressources') return;
        initParticles();
        initReveals();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

    document.addEventListener('layoutReady', run);
})();
