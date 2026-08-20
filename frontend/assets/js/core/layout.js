/**
 * Charge header, footer, modales et UI globale depuis partials/
 */

function loadScript(src) {
    return new Promise(function (resolve, reject) {
        const existing = document.querySelector('script[src="' + src + '"]');
        if (existing) {
            if (existing.dataset.loaded === '1') {
                resolve();
                return;
            }
            existing.addEventListener('load', function onLoad() {
                existing.removeEventListener('load', onLoad);
                resolve();
            });
            existing.addEventListener('error', function onError() {
                existing.removeEventListener('error', onError);
                reject(new Error('Failed to load ' + src));
            });
            return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = function () {
            s.dataset.loaded = '1';
            resolve();
        };
        s.onerror = function () {
            reject(new Error('Failed to load ' + src));
        };
        document.body.appendChild(s);
    });
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function toggleVisibility() {
        btn.classList.toggle('is-visible', window.scrollY > 400);
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
}

async function initCookieConsent() {
    try {
        if (!window.BloomarCookieConsent) {
            await loadScript('assets/js/core/cookie-consent.js');
        }
        if (window.BloomarCookieConsent && typeof window.BloomarCookieConsent.init === 'function') {
            window.BloomarCookieConsent.init();
        }
    } catch (err) {
        console.error('[Bloomar] Cookie consent load failed', err);
    }
}

async function initAnalytics() {
    try {
        if (!window.BloomarAnalyticsConfig) {
            await loadScript('assets/js/config/analytics.config.js');
        }
        if (!window.BloomarAnalytics) {
            await loadScript('assets/js/core/analytics.js');
        }
        if (window.BloomarAnalytics && typeof window.BloomarAnalytics.init === 'function') {
            await window.BloomarAnalytics.init();
        }
    } catch (err) {
        console.error('[Bloomar] Analytics load failed', err);
    }
}

async function injectLayout() {
    try {
        if (!window.__bloomarThemeLoaded && !window.getTheme) {
            await loadScript('assets/js/core/theme.js');
        }
        window.__bloomarThemeLoaded = true;
    } catch (err) {
        console.error('[Bloomar] Theme load failed', err);
    }

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
            link.classList.toggle('premium-nav__link--active', active);
            link.classList.toggle('nav-link--active', active);
        });
    }

    if (typeof applyTranslations === 'function') applyTranslations();
    if (typeof window.togglePremiumMenu !== 'function') {
        window.togglePremiumMenu = function togglePremiumMenu() {
            const menu = document.getElementById('premium-mobile-menu');
            const btn = document.getElementById('premium-menu-btn');
            if (!menu) return;
            const open = menu.classList.toggle('is-open');
            menu.hidden = !open;
            if (btn) btn.setAttribute('aria-expanded', String(open));
            const icon = document.getElementById('premium-menu-icon');
            if (icon && typeof lucide !== 'undefined') {
                icon.setAttribute('data-lucide', open ? 'x' : 'menu');
                lucide.createIcons({ nodes: [icon] });
            }
        };
        window.toggleMobileMenu = window.togglePremiumMenu;
    }

    initBackToTop();

    if (typeof lucide !== 'undefined') lucide.createIcons();
    await initCookieConsent();
    await initAnalytics();

    // BloomarChat — knowledge → engine → UI
    if (!document.getElementById('bloomar-chat-css')) {
        const link = document.createElement('link');
        link.id = 'bloomar-chat-css';
        link.rel = 'stylesheet';
        link.href = 'assets/css/bloomar-chat.css';
        document.head.appendChild(link);
    }

    if (!window.__bloomarChatScript && !window.BloomarChat) {
        window.__bloomarChatScript = true;
        loadScript('assets/js/modules/chatbot-knowledge.js')
            .then(function () {
                return loadScript('assets/js/modules/chatbot-memory.js');
            })
            .then(function () {
                return loadScript('assets/js/modules/chatbot-intents.js');
            })
            .then(function () {
                return loadScript('assets/js/modules/chatbot-provider.js');
            })
            .then(function () {
                return loadScript('assets/js/modules/chatbot-engine.js');
            })
            .then(function () {
                return loadScript('assets/js/modules/bloomar-chat.js');
            })
            .then(function () {
                if (window.BloomarChat && typeof window.BloomarChat.init === 'function') {
                    window.BloomarChat.init();
                }
            })
            .catch(function (err) {
                console.error('[Bloomar] Chatbot load failed', err);
                window.__bloomarChatScript = false;
            });
    } else if (window.BloomarChat && typeof window.BloomarChat.init === 'function') {
        window.BloomarChat.init();
    }

    window.dispatchEvent(new Event('layoutReady'));

    if (window.BloomarCookieConsent && typeof window.BloomarCookieConsent.init === 'function') {
        window.BloomarCookieConsent.init();
    }
    if (typeof applyTranslations === 'function') applyTranslations();
}

document.addEventListener('DOMContentLoaded', injectLayout);
