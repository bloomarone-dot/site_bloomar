/**
 * Bloomar Chat — Provider local
 * Utilise BloomarChatIntents pour détecter l'intention puis construire la réponse.
 */
(function (global) {
    "use strict";

    const QUOTE_STEPS = [
        { key: "name", ask: "Très bien. Pour commencer, quel est votre prénom et votre nom ?" },
        { key: "company", ask: "Parfait. Quelle est votre entreprise ?" },
        { key: "projectType", ask: "Quel type de projet souhaitez-vous chiffrer ?" },
        { key: "budget", ask: "Avez-vous une idée de budget estimatif ?" },
        { key: "description", ask: "En quelques mots, que voulez-vous accomplir avec ce projet ?" },
        { key: "email", ask: "Quel email dois-je utiliser pour le suivi ?" },
        { key: "phone", ask: "Et votre numéro de téléphone (idéalement WhatsApp) ?" },
    ];

    const APPT_STEPS = [
        { key: "name", ask: "Avec plaisir. Quel est votre nom ?" },
        { key: "company", ask: "Quelle est votre entreprise ?" },
        { key: "phone", ask: "Sur quel numéro pouvons-nous vous joindre ?" },
        { key: "email", ask: "Quel est votre email ?" },
        { key: "project", ask: "De quel projet aimeriez-vous parler lors du rendez-vous ?" },
        { key: "date", ask: "Quelle date vous conviendrait ? (ex. 15/08/2026)" },
        { key: "time", ask: "Et à quelle heure ? (ex. 10h30)" },
    ];

    const MIN_SCORE = 24;

    function norm(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/['’]/g, " ")
            .replace(/[^a-z0-9@+.\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function tokenize(n) {
        return n.split(" ").filter((t) => t.length > 1);
    }

    function detectSector(n, knowledge) {
        if (/(restaurant|resto|food|bloorestaurant)/.test(n)) return "restaurant";
        if (/(ecole|scolaire|college|lycee|universite|blooschool|eleves)/.test(n)) return "ecole";
        if (/(commerce|boutique|magasin|retail)/.test(n)) return "commerce";
        if (/(clinique|hopital|sante|medical)/.test(n)) return "clinique";
        if (/(entreprise|pme|societe|startup)/.test(n)) return "entreprise";
        if (/(^|\s)autre(\s|$)/.test(n)) return "autre";
        const hit = (knowledge.sectors || []).find((s) => n === norm(s.label) || n === s.id);
        return hit ? hit.id : null;
    }

    function scoreIntent(n, tokens, intent, memory) {
        let score = 0;
        const examples = (intent.examples || []).map(norm);

        for (let i = 0; i < examples.length; i++) {
            const ex = examples[i];
            if (!ex) continue;
            if (n === ex) {
                score += 140;
                break;
            }
            if (n.includes(ex) || (ex.length > 8 && ex.includes(n) && n.length >= 6)) {
                score += 95;
            } else {
                const exTokens = tokenize(ex);
                if (exTokens.length) {
                    let hit = 0;
                    for (let j = 0; j < exTokens.length; j++) {
                        if (tokens.includes(exTokens[j]) || n.includes(exTokens[j])) hit += 1;
                    }
                    const ratio = hit / exTokens.length;
                    if (ratio >= 0.8 && hit >= 2) score += 70;
                    else if (ratio >= 0.6 && hit >= 2) score += 40;
                }
            }
        }

        const patterns = intent.patterns || [];
        for (let i = 0; i < patterns.length; i++) {
            try {
                if (new RegExp(patterns[i], "i").test(n)) score += 85;
            } catch (_) {
                /* ignore bad pattern */
            }
        }

        // Bonus contexte
        if (memory && memory.topic) {
            if (memory.topic === "services" && intent.id === "services") score += 8;
            if (memory.topic === "products" && intent.id === "products") score += 8;
            if (String(memory.topic).indexOf("product:") === 0 && intent.id.indexOf("product_") === 0) score += 6;
        }

        score += Number(intent.weight || 0) * 0.2;
        return score;
    }

    function resolveIntent(message, memory) {
        const catalog = global.BloomarChatIntents && global.BloomarChatIntents.list;
        if (!catalog || !catalog.length) return null;

        const n = norm(message);
        if (!n) return global.BloomarChatIntents.getById("greeting");

        const tokens = tokenize(n);
        let best = null;
        let bestScore = 0;

        for (let i = 0; i < catalog.length; i++) {
            const intent = catalog[i];
            const s = scoreIntent(n, tokens, intent, memory);
            if (s > bestScore) {
                bestScore = s;
                best = intent;
            }
        }

        if (!best || bestScore < MIN_SCORE) {
            // Contexte : continuer intelligemment, jamais la phrase générique interdite
            if (memory && memory.productFocus) {
                return global.BloomarChatIntents.getById("general");
            }
            if (memory && (memory.topic === "services" || memory.topic === "about" || memory.topic === "products")) {
                return global.BloomarChatIntents.getById("general");
            }
            // Question "qui est X" non capturée → hors sujet
            if (/^qui est\b/.test(n) && !/^qui etes\b/.test(n) && !/\bvous\b/.test(n)) {
                return global.BloomarChatIntents.getById("off_topic");
            }
            return global.BloomarChatIntents.getById("about");
        }

        return best;
    }

    function handleSector(sectorId, knowledge, memory) {
        memory.sector = sectorId;
        memory.awaiting = null;
        const sector = (knowledge.sectors || []).find((s) => s.id === sectorId);
        if (sector && sector.product && knowledge.products[sector.product]) {
            const p = knowledge.products[sector.product];
            memory.productFocus = sector.product;
            memory.topic = "product:" + sector.product;
            return {
                text:
                    "Merci, c’est plus clair. Pour un projet « " +
                    sector.label +
                    " », je vous oriente vers " +
                    p.name +
                    ".\n\n" +
                    p.summary +
                    "\n\nSouhaitez-vous un devis ou un rendez-vous ?",
                ctas: [
                    { action: "quote", label: "Demander un devis" },
                    { action: "appointment", label: "Prendre rendez-vous" },
                    { href: p.href, label: "En savoir plus" },
                ],
            };
        }
        memory.topic = "custom:" + sectorId;
        return {
            text:
                "Compris — un projet pour le secteur « " +
                (sector ? sector.label : sectorId) +
                " ». Nous pouvons le construire sur mesure.\n\nVous préférez un devis, ou un court rendez-vous pour cadrer le besoin ?",
            ctas: [
                { action: "quote", label: "Demander un devis" },
                { action: "appointment", label: "Prendre rendez-vous" },
                { action: "whatsapp", label: "WhatsApp" },
            ],
        };
    }

    function startFlow(memory, kind) {
        memory.flow = kind;
        memory.flowStep = 0;
        memory.slots = {};
        memory.awaiting = null;
        const first = (kind === "quote" ? QUOTE_STEPS : APPT_STEPS)[0];
        const intro =
            kind === "quote"
                ? "Avec plaisir. Je vais vous poser quelques questions, une par une, pour préparer un devis clair."
                : "Parfait. On avance pas à pas pour réserver un créneau avec l’équipe.";
        return { text: intro + "\n\n" + first.ask, ctas: [] };
    }

    function wrapSummary(memory, kind) {
        const s = memory.slots;
        let text;
        if (kind === "quote") {
            text =
                "Voici le récapitulatif de votre demande de devis :\n\n" +
                "• Nom : " + (s.name || "—") + "\n" +
                "• Entreprise : " + (s.company || "—") + "\n" +
                "• Projet : " + (s.projectType || "—") + "\n" +
                "• Budget : " + (s.budget || "—") + "\n" +
                "• Description : " + (s.description || "—") + "\n" +
                "• Email : " + (s.email || "—") + "\n" +
                "• Téléphone : " + (s.phone || "—") + "\n\n" +
                "Je peux transmettre cela à l’équipe. Confirmez-vous ?";
        } else {
            text =
                "Voici le récapitulatif de votre rendez-vous :\n\n" +
                "• Nom : " + (s.name || "—") + "\n" +
                "• Entreprise : " + (s.company || "—") + "\n" +
                "• Téléphone : " + (s.phone || "—") + "\n" +
                "• Email : " + (s.email || "—") + "\n" +
                "• Projet : " + (s.project || "—") + "\n" +
                "• Date : " + (s.date || "—") + "\n" +
                "• Heure : " + (s.time || "—") + "\n\n" +
                "Est-ce bien correct ?";
        }
        memory.flow = null;
        memory.flowStep = 0;
        memory.awaiting = "confirm_" + kind;
        return {
            text,
            ctas: [
                { action: "confirm_" + kind, label: "Confirmer et envoyer" },
                { action: kind === "quote" ? "quote" : "appointment", label: "Recommencer" },
                { action: "whatsapp", label: "Envoyer sur WhatsApp" },
            ],
            lead: { kind, data: { ...s } },
        };
    }

    function continueFlow(message, memory, kind) {
        const steps = kind === "quote" ? QUOTE_STEPS : APPT_STEPS;
        const step = steps[memory.flowStep];
        if (!step) return wrapSummary(memory, kind);

        const value = String(message || "").trim();
        if (!value) return { text: step.ask, ctas: [] };

        memory.slots[step.key] = value;
        memory.flowStep += 1;
        if (memory.flowStep >= steps.length) return wrapSummary(memory, kind);
        return { text: steps[memory.flowStep].ask, ctas: [] };
    }

    function runIntent(intent, message, memory, knowledge) {
        if (!intent) {
            return global.BloomarChatIntents.getById("about").build({ memory, knowledge, message });
        }

        if (intent.flow === "quote") return startFlow(memory, "quote");
        if (intent.flow === "appointment") return startFlow(memory, "appointment");

        const built = intent.build({ memory, knowledge, message });
        if (built.text === "__FLOW_QUOTE__") return startFlow(memory, "quote");
        if (built.text === "__FLOW_APPOINTMENT__") return startFlow(memory, "appointment");
        return built;
    }

    async function reply(ctx) {
        const knowledge = ctx.knowledge || global.BloomarChatKnowledge;
        const memory = ctx.memory;
        const message = String(ctx.message || "").trim();
        const action = ctx.action || null;
        const n = norm(message);

        if (action) {
            if (action.startsWith("sector:")) {
                return handleSector(action.split(":")[1], knowledge, memory);
            }
            if (action === "confirm_quote" || action === "confirm_appointment") {
                const kind = action === "confirm_quote" ? "quote" : "appointment";
                memory.awaiting = null;
                return {
                    text: "Merci. Votre demande est prête. Vous pouvez l’envoyer à l’équipe via WhatsApp, ou continuer ici.",
                    ctas: [
                        { action: "whatsapp", label: "Envoyer sur WhatsApp", wa: true },
                        { action: "services", label: "Continuer" },
                    ],
                    lead: { kind, data: { ...memory.slots }, confirmed: true },
                };
            }

            const map = {
                devis: "quote",
                quote: "quote",
                rdv: "appointment",
                appointment: "appointment",
                rendez_vous: "appointment",
                solutions: "products",
                produits: "products",
                products: "products",
                services: "services",
                about: "about",
                need_software: "need_software",
                product_payment: "product_payment",
                product_school: "product_school",
                product_restaurant: "product_restaurant",
                blooschool: "product_school",
                bloorestaurant: "product_restaurant",
                bone_payment: "product_payment",
                whatsapp: "whatsapp",
                contact: "contact",
                pricing: "pricing",
                support: "support",
                faq: "faq",
            };
            const id = map[action] || action;
            const intent = global.BloomarChatIntents.getById(id);
            memory.lastIntent = id;
            return runIntent(intent, message, memory, knowledge);
        }

        if (memory.flow === "quote" || memory.flow === "appointment") {
            return continueFlow(message, memory, memory.flow);
        }

        if (memory.awaiting === "sector") {
            const sector = detectSector(n, knowledge);
            if (sector) return handleSector(sector, knowledge, memory);
            return {
                text: "Je n’ai pas bien saisi le secteur. Choisissez simplement parmi ces options :",
                ctas: (knowledge.sectors || []).map((s) => ({ action: "sector:" + s.id, label: s.label })),
            };
        }

        // Étapes 1-3 : lire → comprendre → catégoriser
        const intent = resolveIntent(message, memory);
        memory.lastIntent = intent ? intent.id : null;
        memory.lastCategory = intent ? intent.category : null;
        return runIntent(intent, message, memory, knowledge);
    }

    const LocalProvider = {
        id: "local-v3-intents",
        reply,
        resolveIntent,
        QUOTE_STEPS,
        APPT_STEPS,
    };

    const Providers = {
        _active: "local",
        _map: { local: LocalProvider },
        register(id, provider) {
            this._map[id] = provider;
        },
        use(id) {
            if (this._map[id]) this._active = id;
        },
        current() {
            return this._map[this._active] || LocalProvider;
        },
    };

    global.BloomarChatLocalProvider = LocalProvider;
    global.BloomarChatProviders = Providers;
})(typeof window !== "undefined" ? window : globalThis);
