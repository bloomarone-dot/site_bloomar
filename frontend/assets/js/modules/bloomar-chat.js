/**
 * BloomarChat — Interface flottante (UI uniquement)
 * La conversation passe par BloomarChatEngine (+ provider + mémoire + knowledge).
 */
(function () {
    "use strict";

    const WHATSAPP = "237652209175";
    const WA_BASE = `https://wa.me/${WHATSAPP}`;

    const ui = {
        open: false,
        minimized: false,
    };

    let els = {};
    let config = {
        whatsapp: WHATSAPP,
        apiEndpoint: null,
        /** Provider IA futur : async (payload) => reply | null */
        aiAdapter: null,
        onSubmitLead: null,
    };

    function engine() {
        return window.BloomarChatEngine;
    }

    function nowTime() {
        return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function buildWaUrl(text) {
        return `${WA_BASE}?text=${encodeURIComponent(text || "Bonjour Bloomarone, je souhaite échanger avec vous.")}`;
    }

    function conversationSummary() {
        if (engine() && typeof engine().getSummary === "function") return engine().getSummary();
        return "Bonjour Bloomarone, je souhaite échanger avec vous.";
    }

    function enrichCtas(ctas) {
        if (!Array.isArray(ctas)) return [];
        return ctas.map((c) => {
            const item = { ...c };
            if (item.action === "whatsapp" || item.wa) {
                item.href = buildWaUrl(
                    item.waText ||
                        ("Bonjour Bloomarone,\n\nRésumé de ma conversation avec Bloomar :\n" +
                            conversationSummary() +
                            "\n\nMerci.")
                );
                item.wa = true;
                delete item.action;
            }
            return item;
        });
    }

    function injectMarkup() {
        if (document.getElementById("bchat-root")) return;

        const root = document.createElement("div");
        root.id = "bchat-root";
        root.className = "bchat";
        root.setAttribute("aria-live", "polite");
        root.innerHTML = `
            <button type="button" class="bchat-launcher" id="bchat-launcher" aria-label="Ouvrir Bloomar Assist">
                <span class="bchat-launcher__badge" aria-hidden="true"><i></i> En ligne</span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3c-4.4 0-8 3.1-8 7 0 2.2 1.2 4.2 3.1 5.5L6 20l4.2-2.1c.6.1 1.2.2 1.8.2 4.4 0 8-3.1 8-7s-3.6-7-8-7z" fill="currentColor" opacity=".95"/>
                    <circle cx="9" cy="10" r="1.1" fill="#0B1232"/>
                    <circle cx="12" cy="10" r="1.1" fill="#0B1232"/>
                    <circle cx="15" cy="10" r="1.1" fill="#0B1232"/>
                </svg>
            </button>
            <div class="bchat-panel" id="bchat-panel" role="dialog" aria-modal="true" aria-labelledby="bchat-title" hidden>
                <header class="bchat-header">
                    <div class="bchat-header__brand">
                        <img class="bchat-header__logo" src="assets/images/bloomar-one-logo.png" alt="" width="40" height="40" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
                        <span class="bchat-header__logo-fallback" style="display:none" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3c-4.4 0-8 3.1-8 7 0 2.2 1.2 4.2 3.1 5.5L6 20l4.2-2.1c.6.1 1.2.2 1.8.2 4.4 0 8-3.1 8-7s-3.6-7-8-7z" fill="#fff"/></svg>
                        </span>
                        <div class="bchat-header__text">
                            <strong id="bchat-title">Bloomar</strong>
                            <span>Assistant intelligent de Bloomarone</span>
                            <div class="bchat-header__status"><i></i> En ligne</div>
                        </div>
                    </div>
                    <div class="bchat-header__actions">
                        <button type="button" class="bchat-icon-btn" id="bchat-minimize" aria-label="Réduire" title="Réduire">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
                        </button>
                        <button type="button" class="bchat-icon-btn" id="bchat-close" aria-label="Fermer" title="Fermer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
                        </button>
                    </div>
                </header>
                <div class="bchat-body" id="bchat-messages"></div>
                <div class="bchat-quick" id="bchat-quick"></div>
                <form class="bchat-composer" id="bchat-form" autocomplete="off">
                    <input type="text" id="bchat-input" placeholder="Écrivez votre message..." aria-label="Message" maxlength="2000">
                    <button type="submit" class="bchat-send" id="bchat-send" aria-label="Envoyer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z" fill="currentColor"/></svg>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(root);

        els = {
            root,
            launcher: root.querySelector("#bchat-launcher"),
            panel: root.querySelector("#bchat-panel"),
            messages: root.querySelector("#bchat-messages"),
            quick: root.querySelector("#bchat-quick"),
            form: root.querySelector("#bchat-form"),
            input: root.querySelector("#bchat-input"),
            minimize: root.querySelector("#bchat-minimize"),
            close: root.querySelector("#bchat-close"),
        };
    }

    function renderQuick() {
        const actions =
            (engine() && engine().getQuickActions()) ||
            [
                { id: "products", label: "Découvrir nos solutions" },
                { id: "quote", label: "Demander un devis" },
                { id: "appointment", label: "Prendre rendez-vous" },
                { id: "whatsapp", label: "Parler sur WhatsApp" },
                { id: "contact", label: "Nous contacter" },
                { id: "services", label: "Nos services" },
            ];
        els.quick.innerHTML = actions
            .map((a) => `<button type="button" data-bchat-action="${escapeHtml(a.id)}">${escapeHtml(a.label)}</button>`)
            .join("");
    }

    function scrollBottom() {
        requestAnimationFrame(() => {
            els.messages.scrollTop = els.messages.scrollHeight;
        });
    }

    function appendMessage({ role, html, text, ctas }) {
        const wrap = document.createElement("div");
        wrap.className = `bchat-msg bchat-msg--${role === "user" ? "user" : "bot"}`;
        const bubble = document.createElement("div");
        bubble.className = "bchat-bubble";
        if (html) bubble.innerHTML = html;
        else bubble.innerHTML = `<p>${escapeHtml(text || "")}</p>`;
        wrap.appendChild(bubble);

        const finalCtas = enrichCtas(ctas);
        if (finalCtas.length) {
            const row = document.createElement("div");
            row.className = "bchat-cta-row";
            finalCtas.forEach((c) => {
                if (c.href) {
                    const a = document.createElement("a");
                    a.className = "bchat-cta" + (c.wa ? " bchat-cta--wa" : "");
                    a.href = c.href;
                    a.target = c.wa || c.external ? "_blank" : "_self";
                    a.rel = "noopener";
                    a.textContent = c.label;
                    row.appendChild(a);
                } else {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "bchat-cta";
                    btn.dataset.bchatAction = c.action || "";
                    btn.textContent = c.label;
                    row.appendChild(btn);
                }
            });
            wrap.appendChild(row);
        }

        const time = document.createElement("span");
        time.className = "bchat-time";
        time.textContent = nowTime();
        wrap.appendChild(time);

        els.messages.appendChild(wrap);
        scrollBottom();
    }

    function showTyping() {
        const wrap = document.createElement("div");
        wrap.className = "bchat-msg bchat-msg--bot";
        wrap.dataset.typing = "1";
        wrap.innerHTML = `<div class="bchat-bubble bchat-typing" aria-hidden="true"><i></i><i></i><i></i></div>`;
        els.messages.appendChild(wrap);
        scrollBottom();
        return wrap;
    }

    async function submitLead(lead) {
        if (!lead) return;
        const payload = {
            ...lead,
            source: "bloomar-chat",
            page: location.pathname,
            createdAt: new Date().toISOString(),
            conversation: engine() ? engine().getHistory().slice(-20) : [],
        };
        if (typeof config.onSubmitLead === "function") {
            try {
                await config.onSubmitLead(payload);
            } catch (e) {
                console.warn("[BloomarChat] onSubmitLead", e);
            }
        }
        if (config.apiEndpoint) {
            try {
                await fetch(config.apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } catch (e) {
                console.warn("[BloomarChat] apiEndpoint", e);
            }
        }
        return payload;
    }

    async function botFromEngine(payload) {
        const typing = showTyping();
        await new Promise((r) => setTimeout(r, 380 + Math.random() * 220));
        typing.remove();

        let result;

        // Hook IA optionnel (sans changer l’UI)
        if (typeof config.aiAdapter === "function" && payload.message) {
            try {
                const ai = await config.aiAdapter({
                    message: payload.message,
                    history: engine() ? engine().getHistory() : [],
                    memory: engine() ? engine().getMemory() : null,
                    knowledge: window.BloomarChatKnowledge,
                });
                if (ai) {
                    result =
                        typeof ai === "string"
                            ? { text: ai, html: `<p>${escapeHtml(ai)}</p>`, ctas: [] }
                            : ai;
                }
            } catch (e) {
                console.warn("[BloomarChat] aiAdapter", e);
            }
        }

        if (!result) {
            result = await engine().respond(payload);
        }

        if (result.lead && result.lead.confirmed) {
            await submitLead(result.lead);
            const ev = window.BloomarAnalytics && window.BloomarAnalytics.EVENTS;
            if (result.lead.kind === "quote") {
                trackAnalytics((ev && ev.QUOTE_REQUEST) || "quote_request", {
                    event_category: "lead",
                    source: "bloomar-chat",
                });
            } else if (result.lead.kind === "appointment") {
                trackAnalytics((ev && ev.APPOINTMENT_REQUEST) || "appointment_request", {
                    event_category: "lead",
                    source: "bloomar-chat",
                });
            }
        }

        appendMessage({
            role: "bot",
            html: result.html,
            text: result.text,
            ctas: result.ctas,
        });
    }

    async function handleUserText(raw) {
        const text = (raw || "").trim();
        if (!text) return;
        appendMessage({ role: "user", text });
        await botFromEngine({ message: text });
    }

    async function handleAction(action) {
        if (!action) return;
        const ev = window.BloomarAnalytics && window.BloomarAnalytics.EVENTS;
        if (action === "product_school" || action === "blooschool") {
            trackAnalytics((ev && ev.BLOOSCHOOL_CLICK) || "blooschool_click", {
                event_category: "product",
                source: "bloomar-chat",
            });
        } else if (action === "product_restaurant" || action === "bloorestaurant") {
            trackAnalytics((ev && ev.BLOORESTAURANT_CLICK) || "bloorestaurant_click", {
                event_category: "product",
                source: "bloomar-chat",
            });
        } else if (action === "contact") {
            trackAnalytics((ev && ev.CONTACT_CLICK) || "contact_click", {
                event_category: "engagement",
                source: "bloomar-chat",
            });
        }
        await botFromEngine({ action });
    }

    function trackAnalytics(eventName, params) {
        if (window.BloomarAnalytics && typeof window.BloomarAnalytics.trackEvent === "function") {
            window.BloomarAnalytics.trackEvent(eventName, params);
        }
    }

    function openPanel(source) {
        ui.open = true;
        ui.minimized = false;
        els.panel.hidden = false;
        els.panel.classList.add("is-open");
        els.panel.classList.remove("is-minimized");
        els.launcher.classList.add("is-open");
        document.body.classList.add("bchat-open");
        els.input.focus({ preventScroll: true });
        scrollBottom();
        trackAnalytics(
            (window.BloomarAnalytics && window.BloomarAnalytics.EVENTS && window.BloomarAnalytics.EVENTS.CHATBOT_OPEN) ||
                "chatbot_open",
            { event_category: "chatbot", source: source || "launcher" }
        );
    }

    function closePanel() {
        ui.open = false;
        ui.minimized = false;
        els.panel.classList.remove("is-open", "is-minimized");
        els.launcher.classList.remove("is-open");
        document.body.classList.remove("bchat-open");
        setTimeout(() => {
            if (!ui.open) els.panel.hidden = true;
        }, 320);
    }

    function minimizePanel() {
        if (!ui.open) return openPanel();
        ui.minimized = !ui.minimized;
        els.panel.classList.toggle("is-minimized", ui.minimized);
        if (!ui.minimized) {
            els.input.focus({ preventScroll: true });
            scrollBottom();
        }
    }

    function bind() {
        els.launcher.addEventListener("click", () => openPanel("launcher"));
        els.close.addEventListener("click", () => closePanel());
        els.minimize.addEventListener("click", () => minimizePanel());

        els.form.addEventListener("submit", (e) => {
            e.preventDefault();
            const v = els.input.value;
            els.input.value = "";
            handleUserText(v);
        });

        els.input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                els.form.requestSubmit();
            }
        });

        els.root.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-bchat-action]");
            if (!btn) return;
            if (btn.closest(".bchat-quick") || btn.classList.contains("bchat-cta")) {
                handleAction(btn.getAttribute("data-bchat-action"));
            }
        });

        document.addEventListener("click", (e) => {
            const opener = e.target.closest("[data-open-bloomar-chat]");
            if (!opener) return;
            e.preventDefault();
            openPanel("nav");
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && ui.open) closePanel();
        });
    }

    function showWelcome() {
        if (els.messages.childElementCount) return;
        const welcome = engine().getWelcome();
        appendMessage({
            role: "bot",
            html: welcome.html,
            text: welcome.text,
            ctas: welcome.ctas,
        });
    }

    function init(userConfig) {
        if (window.__bloomarChatReady) return window.BloomarChat;
        config = { ...config, ...(userConfig || {}) };

        if (!window.BloomarChatKnowledge || !window.BloomarChatMemory || !window.BloomarChatIntents || !window.BloomarChatProviders || !window.BloomarChatEngine) {
            console.error("[BloomarChat] Modules manquants (knowledge / memory / intents / provider / engine).");
        }

        injectMarkup();
        renderQuick();
        bind();
        showWelcome();

        const params = new URLSearchParams(location.search);
        if (params.get("chat") === "1" || location.hash === "#bloomar-chat") {
            setTimeout(() => openPanel("url"), 400);
        }

        window.__bloomarChatReady = true;
        return window.BloomarChat;
    }

    window.BloomarChat = {
        init,
        open: function () {
            openPanel("api");
        },
        close: closePanel,
        toggle() {
            if (ui.open && !ui.minimized) closePanel();
            else openPanel();
        },
        minimize: minimizePanel,
        send: handleUserText,
        configure(partial) {
            config = { ...config, ...(partial || {}) };
        },
        getConfig: () => ({ ...config }),
        getHistory: () => (engine() ? engine().getHistory() : []),
        submitLead,
    };

    window.__bloomarChatScript = true;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => init());
    } else {
        init();
    }
})();
