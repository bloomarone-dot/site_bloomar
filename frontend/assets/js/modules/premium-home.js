/**
 * Bloomarone Premium Homepage — particles, reveals, mobile menu
 */

function togglePremiumMenu() {
    const menu = document.getElementById('premium-mobile-menu');
    const btn = document.getElementById('premium-menu-btn');
    if (!menu) return;
    const open = menu.classList.toggle('is-open');
    menu.hidden = !open;
    if (btn) btn.setAttribute('aria-expanded', String(open));
    const icon = document.getElementById('premium-menu-icon');
    if (icon && typeof lucide !== 'undefined') {
        icon.setAttribute('data-lucide', open ? 'x' : 'menu');
        lucide.createIcons();
    }
}
window.togglePremiumMenu = togglePremiumMenu;
window.toggleMobileMenu = togglePremiumMenu;

function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let particles = [];
    const count = 48;

    function resize() {
        const parent = canvas.parentElement;
        w = canvas.width = parent.offsetWidth;
        h = canvas.height = parent.offsetHeight;
    }

    function seed() {
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.8 + 0.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            a: Math.random() * 0.5 + 0.15,
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
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(123, 47, 247, ${0.08 * (1 - dist / 120)})`;
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

function initPremiumReveals() {
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

function initPremiumHome() {
    if (document.body.dataset.page !== 'index') return;
    initHeroParticles();
    initPremiumReveals();
}

document.addEventListener('DOMContentLoaded', initPremiumHome);
document.addEventListener('layoutReady', initPremiumHome);
