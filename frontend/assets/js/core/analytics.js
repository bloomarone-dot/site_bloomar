/**
 * Bloomarone — Analytics centralisé (GA4 + Microsoft Clarity)
 * Tous les événements passent par BloomarAnalytics.trackEvent().
 * Chargement différé après consentement cookies (performance).
 */
(function (global) {
    "use strict";

    var EVENTS = {
        PAGE_VIEW: "page_view",
        CHATBOT_OPEN: "chatbot_open",
        WHATSAPP_CLICK: "whatsapp_click",
        QUOTE_REQUEST: "quote_request",
        APPOINTMENT_REQUEST: "appointment_request",
        CONTACT_CLICK: "contact_click",
        BLOOSCHOOL_CLICK: "blooschool_click",
        BLOORESTAURANT_CLICK: "bloorestaurant_click",
        FORM_SUBMIT: "form_submit",
        DOCUMENT_DOWNLOAD: "document_download",
    };

    var gaLoaded = false;
    var clarityLoaded = false;
    var initialized = false;
    var delegateBound = false;
    var queue = [];

    function config() {
        return global.BloomarAnalyticsConfig || {};
    }

    function isEnabled() {
        var cfg = config();
        return cfg.enabled !== false;
    }

    function hasAnalyticsConsent() {
        var consentApi = global.BloomarCookieConsent;
        if (!consentApi || typeof consentApi.getConsent !== "function") return false;
        var consent = consentApi.getConsent();
        if (!consent) return false;
        if (consent.choice === "refused") return false;
        if (consent.performance === false) return false;
        return true;
    }

    function canSend() {
        return isEnabled() && hasAnalyticsConsent() && initialized;
    }

    function getMeasurementId() {
        return (config().GA_MEASUREMENT_ID || "").trim();
    }

    function getClarityId() {
        return (config().CLARITY_PROJECT_ID || "").trim();
    }

    function loadScriptAsync(src, id) {
        return new Promise(function (resolve, reject) {
            if (id && document.getElementById(id)) {
                resolve();
                return;
            }
            var s = document.createElement("script");
            s.async = true;
            s.src = src;
            if (id) s.id = id;
            s.onload = function () {
                resolve();
            };
            s.onerror = function () {
                reject(new Error("Failed to load " + src));
            };
            document.head.appendChild(s);
        });
    }

    function ensureGtag() {
        global.dataLayer = global.dataLayer || [];
        if (!global.gtag) {
            global.gtag = function () {
                global.dataLayer.push(arguments);
            };
        }
    }

    function loadGA4(measurementId) {
        if (gaLoaded || !measurementId) return Promise.resolve();
        ensureGtag();
        return loadScriptAsync(
            "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId),
            "bloomar-ga4"
        ).then(function () {
            global.gtag("js", new Date());
            global.gtag("config", measurementId, {
                anonymize_ip: config().anonymizeIp !== false,
                send_page_view: false,
                allow_google_signals: true,
                allow_ad_personalization_signals: false,
            });
            gaLoaded = true;
        });
    }

    function loadClarity(projectId) {
        if (clarityLoaded || !projectId) return Promise.resolve();
        if (typeof global.clarity === "function") {
            clarityLoaded = true;
            return Promise.resolve();
        }
        global.clarity =
            global.clarity ||
            function () {
                (global.clarity.q = global.clarity.q || []).push(arguments);
            };
        return loadScriptAsync(
            "https://www.clarity.ms/tag/" + encodeURIComponent(projectId),
            "bloomar-clarity"
        ).then(function () {
            clarityLoaded = true;
        });
    }

    function sendToClarity(eventName, params) {
        if (!clarityLoaded || typeof global.clarity !== "function") return;
        try {
            global.clarity("set", "bloomar_event", eventName);
            if (params && params.event_category) {
                global.clarity("set", "event_category", String(params.event_category));
            }
        } catch (_) {
            /* Clarity optionnel */
        }
    }

    function sendToGA4(eventName, params) {
        if (!gaLoaded || typeof global.gtag !== "function") return;
        var gaParams = Object.assign(
            {
                page_path: global.location.pathname,
                page_title: document.title,
                page_location: global.location.href,
            },
            params || {}
        );
        global.gtag("event", eventName, gaParams);
    }

    function flushQueue() {
        if (!canSend() || !queue.length) return;
        var pending = queue.slice();
        queue = [];
        pending.forEach(function (item) {
            trackEvent(item.name, item.params, true);
        });
    }

    function trackEvent(name, params, internal) {
        if (!name) return;
        var payload = params || {};

        if (!internal && !canSend()) {
            queue.push({ name: name, params: payload });
            return;
        }

        sendToGA4(name, payload);
        sendToClarity(name, payload);
    }

    function trackPageView(extra) {
        trackEvent(EVENTS.PAGE_VIEW, Object.assign({ send_to: getMeasurementId() }, extra || {}));
    }

    function init() {
        if (!isEnabled() || initialized) return Promise.resolve();
        if (!hasAnalyticsConsent()) return Promise.resolve();

        var measurementId = getMeasurementId();
        var clarityId = getClarityId();

        if (!measurementId && !clarityId) return Promise.resolve();

        return Promise.all([loadGA4(measurementId), loadClarity(clarityId)])
            .then(function () {
                initialized = true;
                if (config().autoPageView !== false) {
                    trackPageView();
                }
                flushQueue();
            })
            .catch(function (err) {
                console.warn("[BloomarAnalytics] Init failed", err);
            });
    }

    function onConsentChange(consent) {
        if (!isEnabled()) return;
        if (consent && consent.choice !== "refused" && consent.performance !== false) {
            init();
        }
    }

    function bindDelegationOnce() {
        if (delegateBound) return;
        delegateBound = true;

        document.addEventListener(
            "click",
            function (e) {
                if (!isEnabled()) return;

                var tracked = e.target.closest("[data-track]");
                if (tracked) {
                    trackEvent(tracked.getAttribute("data-track"), {
                        event_category: "engagement",
                        event_label: tracked.getAttribute("data-track-label") || tracked.textContent.trim(),
                    });
                    return;
                }

                var wa = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
                if (wa) {
                    trackEvent(EVENTS.WHATSAPP_CLICK, {
                        event_category: "engagement",
                        link_url: wa.href,
                        link_text: (wa.textContent || "").trim(),
                    });
                }

                var contact = e.target.closest('a[href*="contact.html"]');
                if (contact && !contact.closest("#bchat-root")) {
                    trackEvent(EVENTS.CONTACT_CLICK, {
                        event_category: "engagement",
                        link_url: contact.href,
                        link_text: (contact.textContent || "").trim(),
                    });
                }

                var school = e.target.closest(
                    'a[href*="#blooschool"], a[href*="blooschool"], [data-track="blooschool_click"]'
                );
                if (school) {
                    trackEvent(EVENTS.BLOOSCHOOL_CLICK, {
                        event_category: "product",
                        link_url: school.href || school.getAttribute("href") || "",
                        link_text: (school.textContent || "").trim(),
                    });
                }

                var resto = e.target.closest(
                    'a[href*="#bloorestaurant"], a[href*="bloorestaurant"], [data-track="bloorestaurant_click"]'
                );
                if (resto) {
                    trackEvent(EVENTS.BLOORESTAURANT_CLICK, {
                        event_category: "product",
                        link_url: resto.href || resto.getAttribute("href") || "",
                        link_text: (resto.textContent || "").trim(),
                    });
                }
            },
            true
        );
    }

    bindDelegationOnce();

    global.BloomarAnalytics = {
        EVENTS: EVENTS,
        init: init,
        trackEvent: trackEvent,
        trackPageView: trackPageView,
        onConsentChange: onConsentChange,
        hasAnalyticsConsent: hasAnalyticsConsent,
        isReady: function () {
            return initialized;
        },
    };
})(typeof window !== "undefined" ? window : globalThis);
