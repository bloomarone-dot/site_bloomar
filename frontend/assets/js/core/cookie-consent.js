/**
 * Bloomar — Gestionnaire centralisé du consentement cookies
 * Persistance localStorage · un seul bandeau · pas de fuite mémoire
 */
(function (global) {
    "use strict";

    const STORAGE_KEY = "bloomar-cookie-consent";
    const VERSION = 1;

    let delegateBound = false;

    function readConsent() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || typeof data.choice !== "string") return null;
            return data;
        } catch (_) {
            return null;
        }
    }

    function writeConsent(choice, performance) {
        const payload = {
            version: VERSION,
            choice,
            performance: !!performance,
            updatedAt: Date.now(),
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn("[BloomarCookieConsent] Impossible d'enregistrer le consentement.", e);
        }
        return payload;
    }

    function hasConsent() {
        return readConsent() !== null;
    }

    function getBanner() {
        return document.getElementById("bloomar-cookie-banner");
    }

    function getSettingsSection() {
        return document.getElementById("cookie-settings-section");
    }

    function getPerformanceCheckbox() {
        return document.getElementById("ck-perf");
    }

    function hideBanner(animated) {
        const banner = getBanner();
        if (!banner || banner.dataset.consentHidden === "1") return;

        banner.dataset.consentHidden = "1";

        if (animated === false) {
            banner.classList.add("hidden");
            banner.style.opacity = "";
            banner.style.transform = "";
            return;
        }

        banner.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        banner.style.opacity = "0";
        banner.style.transform = "translate(-50%, 20px)";
        window.setTimeout(function () {
            banner.classList.add("hidden");
        }, 400);
    }

    function showBanner() {
        const banner = getBanner();
        if (!banner) return;

        banner.dataset.consentHidden = "0";
        banner.classList.remove("hidden");
        banner.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        banner.style.opacity = "0";
        banner.style.transform = "translate(-50%, 20px)";

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                banner.style.opacity = "1";
                banner.style.transform = "translate(-50%, 0)";
            });
        });
    }

    function notify(message) {
        if (typeof global.showToast === "function") {
            global.showToast(message);
        }
    }

    function notifyAnalytics(consent) {
        if (global.BloomarAnalytics && typeof global.BloomarAnalytics.onConsentChange === "function") {
            global.BloomarAnalytics.onConsentChange(consent || readConsent());
        }
    }

    function acceptAll() {
        const perf = getPerformanceCheckbox();
        const performance = perf ? perf.checked : true;
        const saved = writeConsent("accepted_all", performance);
        hideBanner(true);
        notify("Cookies et outils de sécurité activés.");
        notifyAnalytics(saved);
    }

    function refuse() {
        const saved = writeConsent("refused", false);
        hideBanner(true);
        notify("Paramètres enregistrés : uniquement les cookies essentiels.");
        notifyAnalytics(saved);
    }

    function toggleSettings() {
        const section = getSettingsSection();
        if (!section) return;
        section.classList.toggle("hidden");
    }

    function bindDelegationOnce() {
        if (delegateBound) return;
        delegateBound = true;

        document.addEventListener("click", function (e) {
            const target = e.target.closest("[data-cookie-action]");
            if (!target) return;

            const action = target.getAttribute("data-cookie-action");
            if (action === "accept") acceptAll();
            else if (action === "refuse") refuse();
            else if (action === "customize") toggleSettings();
        });
    }

    function init() {
        bindDelegationOnce();

        const banner = getBanner();
        if (!banner) return;

        if (hasConsent()) {
            hideBanner(false);
            notifyAnalytics(readConsent());
            return;
        }

        showBanner();
    }

    const api = {
        init,
        hasConsent,
        getConsent: readConsent,
        acceptAll,
        refuse,
        toggleSettings,
        hideBanner,
        showBanner,
    };

    global.BloomarCookieConsent = api;

    // Compatibilité avec les onclick existants dans global-ui.html
    global.setupCookieBanner = init;
    global.accepterTout = acceptAll;
    global.refuserCookies = refuse;
    global.ouvrirParametres = toggleSettings;
    global.hideCookieBanner = function () {
        hideBanner(true);
    };
})(typeof window !== "undefined" ? window : globalThis);
