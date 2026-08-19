/**
 * Page À propos — particules, timeline, révélations
 */
(function initAboutPage() {
    'use strict';

    function initParticles() {
        const canvas = document.getElementById('about-hero-particles');
        if (!canvas) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const ctx = canvas.getContext('2d');
        let w = 0;
        let h = 0;
        let particles = [];
        const count = 40;

        function resize() {
            const parent = canvas.parentElement;
            w = canvas.width = parent.offsetWidth;
            h = canvas.height = parent.offsetHeight;
        }

        function seed() {
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.5 + 0.35,
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
                    if (dist < 95) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(123, 47, 247, ${0.06 * (1 - dist / 95)})`;
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
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        els.forEach((el) => io.observe(el));
    }

    function initTimeline() {
        const wrap = document.getElementById('about-timeline');
        if (!wrap) return;

        const steps = wrap.querySelectorAll('.about-timeline__step');
        const progress = document.getElementById('about-timeline-progress');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduce || !('IntersectionObserver' in window)) {
            steps.forEach((s) => s.classList.add('is-visible'));
            if (progress) progress.style.width = '100%';
            return;
        }

        let visibleCount = 0;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    visibleCount += 1;
                    if (progress && steps.length) {
                        progress.style.width = `${(visibleCount / steps.length) * 100}%`;
                    }
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
        );

        steps.forEach((step, i) => {
            step.style.transitionDelay = `${i * 0.08}s`;
            observer.observe(step);
        });
    }

    function initAfricaPulse() {
        const svg = document.getElementById('about-africa-map');
        if (!svg) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const nodes = svg.querySelectorAll('.africa-node');
        nodes.forEach((node, i) => {
            node.style.animation = `aboutNodePulse 2.5s ease-in-out ${i * 0.4}s infinite`;
        });

        if (!document.getElementById('about-africa-keyframes')) {
            const style = document.createElement('style');
            style.id = 'about-africa-keyframes';
            style.textContent = `
                @keyframes aboutNodePulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.35); }
                }
                .africa-node { transform-origin: center; transform-box: fill-box; }
            `;
            document.head.appendChild(style);
        }
    }

    function initOfficeImage() {
        const img = document.getElementById('about-office-img');
        const placeholder = document.getElementById('about-office-placeholder');
        if (!img || !placeholder) return;

        img.addEventListener('error', () => {
            img.hidden = true;
            placeholder.hidden = false;
        });

        img.addEventListener('load', () => {
            if (img.naturalWidth > 0) {
                img.hidden = false;
                placeholder.hidden = true;
            }
        });

        if (!img.complete || img.naturalWidth === 0) {
            img.hidden = true;
            placeholder.hidden = false;
        } else {
            img.hidden = false;
            placeholder.hidden = true;
        }
    }

    function run() {
        if (document.body.dataset.page !== 'a-propos') return;
        initParticles();
        initReveals();
        initTimeline();
        initAfricaPulse();
        initOfficeImage();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

    document.addEventListener('layoutReady', run);
})();
