/**
 * Bloomarone — thème clair / sombre
 */
(function initBloomarTheme() {
    'use strict';

    const STORAGE_KEY = 'bloomar-theme';
    const DEFAULT = 'dark';

    function getTheme() {
        return document.documentElement.dataset.theme || DEFAULT;
    }

    function applyTheme(theme) {
        const next = theme === 'light' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        document.documentElement.style.colorScheme = next;

        document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
            const isLight = next === 'light';
            btn.setAttribute('aria-pressed', String(isLight));
            const labelKey = isLight ? 'theme.dark' : 'theme.light';
            btn.setAttribute('aria-label', typeof t === 'function' ? t(labelKey) : (isLight ? 'Dark mode' : 'Light mode'));
            const icon = btn.querySelector('[data-theme-icon]');
            if (icon && typeof lucide !== 'undefined') {
                icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
                lucide.createIcons({ nodes: [icon] });
            }
        });

        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
    }

    function setTheme(theme) {
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme === 'light' ? 'light' : 'dark');
    }

    function toggleTheme() {
        setTheme(getTheme() === 'light' ? 'dark' : 'light');
    }

    function boot() {
        const saved = localStorage.getItem(STORAGE_KEY);
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(saved || (prefersLight ? 'light' : DEFAULT));
    }

    window.getTheme = getTheme;
    window.setTheme = setTheme;
    window.toggleTheme = toggleTheme;
    window.applyTheme = applyTheme;

    boot();
    document.addEventListener('DOMContentLoaded', applyTheme.bind(null, getTheme()));
    document.addEventListener('layoutReady', () => applyTheme(getTheme()));
})();
