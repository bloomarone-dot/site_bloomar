/**
 * Charge header, footer, modales et UI globale depuis partials/
 */
async function injectLayout() {
    const slots = [
        ['site-header', 'partials/header.html'],
        ['site-footer', 'partials/footer.html'],
        ['site-modals', 'partials/modals.html'],
        ['site-global-ui', 'partials/global-ui.html'],
    ];

    await Promise.all(
        slots.map(async ([id, url]) => {
            const el = document.getElementById(id);
            if (!el) return;
            try {
                const res = await fetch(url);
                if (res.ok) el.innerHTML = await res.text();
            } catch (_) { /* serveur local requis */ }
        })
    );

    const page = document.body.dataset.page;
    if (page) {
        document.querySelectorAll('[data-nav-page]').forEach((link) => {
            const active = link.dataset.navPage === page;
            link.classList.toggle('nav-link--active', active);
            if (active && !link.classList.contains('nav-link--highlight')) {
                link.classList.add('text-bloomar-navy', 'bg-slate-100/80');
            }
        });
    }

    if (typeof applyTranslations === 'function') applyTranslations();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof setupCookieBanner === 'function') setupCookieBanner();

    window.dispatchEvent(new Event('layoutReady'));
}

document.addEventListener('DOMContentLoaded', injectLayout);
