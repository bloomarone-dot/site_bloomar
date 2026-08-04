/**
 * Bloomar Chat — Mémoire conversationnelle
 * Conserve historique, sujet, slots et parcours actifs.
 */
(function (global) {
    "use strict";

    function createMemory() {
        return {
            history: [],
            topic: null,
            sector: null,
            productFocus: null,
            lastIntent: null,
            awaiting: null, // 'sector' | 'confirm_contact' | null
            flow: null, // 'quote' | 'appointment' | null
            flowStep: 0,
            slots: {},
            turn: 0,
        };
    }

    const api = {
        create: createMemory,

        push(memory, role, text) {
            memory.history.push({
                role,
                text: String(text || "").trim(),
                at: Date.now(),
            });
            if (memory.history.length > 40) {
                memory.history = memory.history.slice(-40);
            }
            if (role === "user") memory.turn += 1;
            return memory;
        },

        recent(memory, n) {
            return (memory.history || []).slice(-(n || 8));
        },

        summary(memory) {
            return api
                .recent(memory, 12)
                .map((m) => `${m.role === "user" ? "Visiteur" : "Bloomar"}: ${m.text}`)
                .join("\n");
        },

        setTopic(memory, topic) {
            if (topic) memory.topic = topic;
            return memory;
        },

        setSector(memory, sector) {
            memory.sector = sector || null;
            return memory;
        },

        setProduct(memory, productId) {
            memory.productFocus = productId || null;
            return memory;
        },

        startFlow(memory, flow) {
            memory.flow = flow;
            memory.flowStep = 0;
            memory.awaiting = null;
            memory.slots = {};
            return memory;
        },

        clearFlow(memory) {
            memory.flow = null;
            memory.flowStep = 0;
            memory.awaiting = null;
            return memory;
        },

        resetSoft(memory) {
            memory.awaiting = null;
            return memory;
        },
    };

    global.BloomarChatMemory = api;
})(typeof window !== "undefined" ? window : globalThis);
