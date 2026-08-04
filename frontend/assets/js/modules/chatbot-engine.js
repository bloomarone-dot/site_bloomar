/**
 * Bloomar Chat — Moteur conversationnel (orchestrateur)
 *
 * Responsabilités :
 * - coordonner mémoire + knowledge + provider
 * - exposer une API stable pour l’UI
 * - rester interchangeable avec un provider IA
 */
(function (global) {
    "use strict";

    let memory = null;

    function kb() {
        return global.BloomarChatKnowledge;
    }

    function memApi() {
        return global.BloomarChatMemory;
    }

    function provider() {
        return (global.BloomarChatProviders && global.BloomarChatProviders.current()) || global.BloomarChatLocalProvider;
    }

    function ensureMemory() {
        if (!memory) memory = memApi().create();
        return memory;
    }

    function toHtml(text) {
        const safe = String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return safe
            .split(/\n\n+/)
            .map((block) => {
                const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
                const isList = lines.every((l) => /^[•\-\*]/.test(l) || /^[•]/.test(l));
                if (isList) {
                    return (
                        "<ul>" +
                        lines
                            .map((l) => "<li>" + l.replace(/^[•\-\*]\s*/, "") + "</li>")
                            .join("") +
                        "</ul>"
                    );
                }
                return "<p>" + lines.join("<br>") + "</p>";
            })
            .join("");
    }

    async function respond({ message, action }) {
        const m = ensureMemory();
        const knowledge = kb();
        const p = provider();

        if (message) memApi().push(m, "user", message);

        const result = await p.reply({
            message: message || "",
            action: action || null,
            memory: m,
            knowledge,
        });

        const text = result.text || "";
        memApi().push(m, "bot", text);

        return {
            text,
            html: toHtml(text),
            ctas: result.ctas || [],
            lead: result.lead || null,
            memory: m,
            provider: p.id || "local",
        };
    }

    function getWelcome() {
        const knowledge = kb();
        const text = (knowledge && knowledge.welcome) || "Bonjour 👋 Je suis Bloomar.";
        const m = ensureMemory();
        memApi().push(m, "bot", text);
        return {
            text,
            html: toHtml(text),
            ctas: [
                { action: "services", label: "Nos services" },
                { action: "products", label: "Nos produits" },
                { action: "quote", label: "Demander un devis" },
                { action: "appointment", label: "Prendre rendez-vous" },
            ],
        };
    }

    function getQuickActions() {
        return [
            { id: "products", label: "Découvrir nos solutions" },
            { id: "quote", label: "Demander un devis" },
            { id: "appointment", label: "Prendre rendez-vous" },
            { id: "whatsapp", label: "Parler sur WhatsApp" },
            { id: "contact", label: "Nous contacter" },
            { id: "services", label: "Nos services" },
        ];
    }

    function getHistory() {
        return ensureMemory().history.slice();
    }

    function getSummary() {
        return memApi().summary(ensureMemory());
    }

    function reset() {
        memory = memApi().create();
        return memory;
    }

    /**
     * Prépare le branchement IA :
     * BloomarChatEngine.useProvider('openai')
     * après BloomarChatProviders.register('openai', ...)
     */
    function useProvider(id) {
        if (global.BloomarChatProviders) global.BloomarChatProviders.use(id);
    }

    global.BloomarChatEngine = {
        respond,
        getWelcome,
        getQuickActions,
        getHistory,
        getSummary,
        reset,
        useProvider,
        getMemory: ensureMemory,
    };
})(typeof window !== "undefined" ? window : globalThis);
