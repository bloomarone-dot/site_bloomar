/**
 * Bloomar Chat — Catalogue d'intentions (facile à enrichir)
 *
 * Chaque intention :
 * - id / category
 * - examples  : formulations naturelles
 * - patterns  : regex strings
 * - weight
 * - build(ctx): { text, ctas }
 * - flow?     : 'quote' | 'appointment'
 */
(function (global) {
    "use strict";

    function C() {
        return {
            services: { action: "services", label: "Nos services" },
            products: { action: "products", label: "Nos produits" },
            about: { action: "about", label: "Présentation" },
            quote: { action: "quote", label: "Demander un devis" },
            appointment: { action: "appointment", label: "Prendre rendez-vous" },
            whatsapp: { action: "whatsapp", label: "WhatsApp" },
            payment: { action: "product_payment", label: "B.one Payment" },
            school: { action: "product_school", label: "B.one school" },
            restaurant: { action: "product_restaurant", label: "B.one restaurant" },
            software: { action: "need_software", label: "Sur mesure" },
        };
    }

    function sectorButtons(knowledge) {
        return (knowledge.sectors || []).map((s) => ({
            action: "sector:" + s.id,
            label: s.label,
        }));
    }

    const INTENTS = [
        {
            id: "greeting",
            category: "Salutations",
            weight: 40,
            examples: ["bonjour", "bonsoir", "salut", "hello", "hey", "coucou", "hi", "bonne journee", "bonjour bloomar", "bonsoir bloomar"],
            patterns: ["^bonjour\\b", "^bonsoir\\b", "^salut\\b", "^hello\\b", "^hey\\b", "^coucou\\b"],
            build() {
                return {
                    text: "Bonjour 👋 Comment puis-je vous aider aujourd’hui ?",
                    ctas: [C().products, C().services, C().quote],
                };
            },
        },
        {
            id: "thanks",
            category: "Remerciements",
            weight: 35,
            examples: ["merci", "merci beaucoup", "thanks", "thank you", "c est gentil", "super merci"],
            patterns: ["^merci\\b", "\\bthanks\\b", "\\bthank you\\b"],
            build() {
                return {
                    text: "Avec plaisir. Je reste disponible si vous avez besoin d’autre chose.",
                    ctas: [C().quote, C().appointment],
                };
            },
        },
        {
            id: "bye",
            category: "Salutations",
            weight: 35,
            examples: ["au revoir", "a bientot", "bye", "bonne continuation", "a plus"],
            patterns: ["\\bau revoir\\b", "\\ba bientot\\b", "^bye\\b"],
            build() {
                return {
                    text: "À bientôt. Belle journée à vous.",
                    ctas: [C().whatsapp],
                };
            },
        },
        {
            id: "off_topic",
            category: "Question hors sujet",
            weight: 70,
            examples: [
                "qui est samuel etoo",
                "qui est elon musk",
                "qui a gagne la coupe du monde",
                "quelle est la capitale du japon",
                "capitale du japon",
            ],
            patterns: [
                "^qui est (?!vous\\b|tu\\b|bloomar|bloomarone)",
                "coupe du monde",
                "capitale du",
                "capitale de",
                "elon musk",
                "samuel et",
                "etot",
                "etoo",
                "\\bmessi\\b",
                "\\bronaldo\\b",
                "\\bmeteo\\b",
                "\\btemps qu il fait\\b",
                "raconte.*blague",
                "qui a gagne",
                "president des",
                "president de la",
            ],
            build(ctx) {
                const msg = String((ctx && ctx.message) || "").toLowerCase();
                let prefix = "";
                if (/samuel\s*et?o{1,2}|etot|etoo/.test(msg)) {
                    prefix =
                        "Vous parlez probablement de Samuel Eto'o — je ne peux pas répondre aux questions personnelles ou sportives.\n\n";
                }
                return {
                    text:
                        prefix +
                        ((ctx.knowledge && ctx.knowledge.offTopicReply) ||
                            "Je suis spécialisée dans Bloomarone. Recentrons sur vos besoins professionnels."),
                    ctas: [C().products, C().services, C().quote, C().whatsapp],
                };
            },
        },
        {
            id: "about",
            category: "Présentation Bloomarone",
            weight: 55,
            examples: [
                "vous faites dans quoi",
                "vous faites quoi",
                "que faites vous",
                "que faites vous exactement",
                "qui etes vous",
                "qui es tu",
                "presentez bloomarone",
                "presente bloomarone",
                "presentation de bloomarone",
                "c est quoi bloomarone",
                "cest quoi bloomarone",
                "qu est ce que bloomarone",
                "parlez moi de bloomarone",
                "a propos de bloomarone",
                "votre entreprise",
                "votre societe",
                "vous etes qui",
                "bloomarone c est quoi",
                "dans quel domaine travaillez vous",
                "quel est votre metier",
            ],
            patterns: [
                "faites dans quoi",
                "faites quoi",
                "que faites",
                "qui etes",
                "qui es tu",
                "vous etes qui",
                "presente.*bloomar",
                "c ?est quoi bloomar",
                "a propos",
                "votre entreprise",
                "votre societe",
                "domaine.*travaille",
            ],
            build(ctx) {
                const pitch = ctx.knowledge.company.pitch;
                ctx.memory.topic = "about";
                return {
                    text:
                        pitch +
                        "\n\nEn clair : nous aidons les entreprises à digitaliser concrètement leur activité, avec des produits prêts à l’emploi et du sur-mesure quand c’est nécessaire.\n\nVous préférez que je vous parle de nos produits ou de nos services ?",
                    ctas: [C().products, C().services, C().appointment],
                };
            },
        },
        {
            id: "services",
            category: "Services",
            weight: 50,
            examples: [
                "quels sont vos services",
                "vos services",
                "nos services",
                "que proposez vous",
                "quelles sont vos offres",
                "vous proposez quoi",
                "liste des services",
                "services disponibles",
                "offres de service",
            ],
            patterns: [
                "vos services",
                "nos services",
                "que proposez",
                "quelles? sont vos offres",
                "proposez quoi",
                "\\bservices\\b",
            ],
            build(ctx) {
                ctx.memory.topic = "services";
                return {
                    text:
                        "Nous proposons notamment B.one Payment, le développement web & mobile, B.one ProCom pour vos équipes, des solutions ERP/CRM/SaaS, et un support de proximité.\n\nVous cherchez plutôt un produit prêt à l’emploi, ou une solution conçue pour votre métier ?",
                    ctas: [C().products, C().software, C().quote],
                };
            },
        },
        {
            id: "products",
            category: "Produits",
            weight: 50,
            examples: [
                "quels logiciels developpez vous",
                "vos logiciels",
                "vos produits",
                "vos solutions",
                "quelles solutions",
                "logiciels que vous developpez",
                "decouvrir nos solutions",
                "ecosysteme",
                "produits bloomarone",
            ],
            patterns: [
                "logiciels? developp",
                "vos logiciels",
                "vos produits",
                "vos solutions",
                "quelles solutions",
                "\\becosysteme\\b",
            ],
            build(ctx) {
                ctx.memory.topic = "products";
                return {
                    text:
                        "Nous développons principalement BLOOSCHOOL pour les établissements scolaires, BLOORESTAURANT pour les restaurants, B.one Payment pour les paiements Mobile Money, ainsi que des solutions sur mesure selon vos besoins.\n\nLequel vous intéresse le plus ?",
                    ctas: [C().school, C().restaurant, C().payment, C().software],
                };
            },
        },
        {
            id: "need_software",
            category: "Produits",
            weight: 48,
            examples: [
                "je veux un logiciel",
                "je veux une application",
                "je cherche un logiciel",
                "j ai besoin d un logiciel",
                "creer une application",
                "developper une application",
                "faire un logiciel",
                "besoin d une app",
            ],
            patterns: [
                "je veux un logiciel",
                "je veux une application",
                "cherche un logiciel",
                "besoin d.?un logiciel",
                "creer une application",
                "developper une? (app|application|logiciel)",
            ],
            build(ctx) {
                ctx.memory.awaiting = "sector";
                ctx.memory.topic = "software";
                return {
                    text: "Très bien. Pour vous orienter correctement : pour quel secteur d’activité ?",
                    ctas: sectorButtons(ctx.knowledge),
                };
            },
        },
        {
            id: "pricing",
            category: "Tarifs",
            weight: 46,
            examples: ["tarifs", "vos tarifs", "prix", "combien ca coute", "c est combien", "cout", "grille tarifaire"],
            patterns: ["\\btarifs?\\b", "\\bprix\\b", "combien", "\\bcout\\b"],
            build(ctx) {
                ctx.memory.topic = "pricing";
                return {
                    text:
                        "Les tarifs dépendent du produit et de l’ampleur du projet. Le plus fiable est un devis adapté à votre besoin.\n\nJe peux vous orienter vers la page tarifs, ou démarrer un devis ici.",
                    ctas: [{ href: "tarifs.html", label: "Voir les tarifs" }, C().quote, C().appointment],
                };
            },
        },
        {
            id: "quote",
            category: "Devis",
            weight: 54,
            examples: ["devis", "demander un devis", "je veux un devis", "obtenir un devis", "faire un devis", "estimation", "chiffrage"],
            patterns: ["\\bdevis\\b", "\\bestimation\\b", "\\bchiffrage\\b"],
            flow: "quote",
            build() {
                return { text: "__FLOW_QUOTE__", ctas: [] };
            },
        },
        {
            id: "appointment",
            category: "Rendez-vous",
            weight: 54,
            examples: ["rendez vous", "prendre rendez vous", "rdv", "planifier un appel", "meeting", "visio", "je veux un rendez vous"],
            patterns: ["rendez ?vous", "\\brdv\\b", "\\bmeeting\\b", "\\bvisio\\b"],
            flow: "appointment",
            build() {
                return { text: "__FLOW_APPOINTMENT__", ctas: [] };
            },
        },
        {
            id: "whatsapp",
            category: "WhatsApp",
            weight: 47,
            examples: ["whatsapp", "whats app", "parler sur whatsapp", "continuer sur whatsapp", "ecrire sur whatsapp"],
            patterns: ["\\bwhats ?app\\b", "^wa$"],
            build() {
                return {
                    text: "Bien sûr. Je vous ouvre WhatsApp avec le contexte de notre échange.",
                    ctas: [{ action: "whatsapp", label: "Continuer sur WhatsApp", wa: true }],
                };
            },
        },
        {
            id: "support",
            category: "Support",
            weight: 44,
            examples: ["support", "sav", "assistance", "aide technique", "probleme technique", "besoin daide"],
            patterns: ["\\bsupport\\b", "\\bsav\\b", "aide technique", "assistance"],
            build(ctx) {
                return {
                    text:
                        "Notre support est humain et local. L’équipe vous accompagne pour l’assistance, la formation et la maintenance (" +
                        ctx.knowledge.company.contact.hours +
                        ").\n\nJe peux vous mettre en relation maintenant si vous voulez.",
                    ctas: [C().whatsapp, C().appointment],
                };
            },
        },
        {
            id: "contact",
            category: "FAQ",
            weight: 44,
            examples: ["contact", "nous contacter", "comment vous joindre", "vos coordonnees", "joindre bloomarone"],
            patterns: ["\\bcontact\\b", "vous joindre", "coordonnees"],
            build(ctx) {
                const c = ctx.knowledge.company.contact;
                return {
                    text:
                        "Voici nos coordonnées :\n\nTéléphone / WhatsApp : " +
                        c.phone +
                        "\nEmail : " +
                        c.email +
                        "\nAdresse : " +
                        c.address,
                    ctas: [C().whatsapp, C().appointment, { href: "contact.html", label: "Page Contact" }],
                };
            },
        },
        {
            id: "phone",
            category: "FAQ",
            weight: 42,
            examples: ["telephone", "votre numero", "numero de telephone", "appeler"],
            patterns: ["\\btelephone\\b", "votre numero", "\\bappeler\\b"],
            build(ctx) {
                return {
                    text: "Notre numéro est le " + ctx.knowledge.company.contact.phone + ".",
                    ctas: [{ href: "tel:+237652209175", label: "Appeler", external: true }, C().whatsapp],
                };
            },
        },
        {
            id: "email",
            category: "FAQ",
            weight: 42,
            examples: ["email", "votre email", "adresse mail", "mail"],
            patterns: ["\\bemail\\b", "adresse mail", "(^|\\s)mail(\\s|$)"],
            build(ctx) {
                return {
                    text: "Notre email est " + ctx.knowledge.company.contact.email + ".",
                    ctas: [{ href: "mailto:contact@bloomarone.com", label: "Écrire", external: true }, C().quote],
                };
            },
        },
        {
            id: "address",
            category: "FAQ",
            weight: 42,
            examples: ["adresse", "ou etes vous", "localisation", "ou vous trouvez"],
            patterns: ["\\badresse\\b", "ou etes", "localisation"],
            build(ctx) {
                const c = ctx.knowledge.company.contact;
                return {
                    text: "Nous sommes à " + c.address + ". Horaires : " + c.hours + ".",
                    ctas: [C().appointment, C().whatsapp],
                };
            },
        },
        {
            id: "faq",
            category: "FAQ",
            weight: 38,
            examples: ["faq", "questions frequentes", "foire aux questions"],
            patterns: ["\\bfaq\\b", "questions frequentes"],
            build(ctx) {
                const items = (ctx.knowledge.faq || []).slice(0, 3);
                const body = items.map((f) => f.q + "\n" + f.a).join("\n\n");
                return {
                    text: body || "Posez-moi votre question, je vous réponds directement.",
                    ctas: [C().quote, C().appointment, C().whatsapp],
                };
            },
        },
        {
            id: "product_payment",
            category: "Produits",
            weight: 49,
            examples: ["b.one payment", "bone payment", "paiement", "mobile money", "mtn momo", "orange money"],
            patterns: ["b\\.?one", "bone payment", "mobile money", "\\bmomo\\b", "orange money", "\\bpaiement\\b"],
            build(ctx) {
                const p = ctx.knowledge.products.bone_payment;
                ctx.memory.productFocus = "bone_payment";
                ctx.memory.topic = "product:bone_payment";
                return {
                    text: p.summary + "\n\nSouhaitez-vous un devis ou un échange avec l’équipe ?",
                    ctas: [C().quote, C().appointment, { href: p.href, label: "Voir la page" }],
                };
            },
        },
        {
            id: "product_school",
            category: "Produits",
            weight: 49,
            examples: ["blooschool", "ecole", "gestion scolaire", "logiciel ecole"],
            patterns: ["blooschool", "gestion scolaire", "\\becole\\b", "scolaire"],
            build(ctx) {
                const p = ctx.knowledge.products.blooschool;
                ctx.memory.productFocus = "blooschool";
                ctx.memory.sector = "ecole";
                ctx.memory.topic = "product:blooschool";
                return {
                    text: p.summary + "\n\nJe peux vous accompagner pour une démo, un devis ou un rendez-vous.",
                    ctas: [C().quote, C().appointment, { href: p.href, label: "Voir B.one school" }],
                };
            },
        },
        {
            id: "product_restaurant",
            category: "Produits",
            weight: 49,
            examples: ["bloorestaurant", "restaurant", "resto", "gestion restaurant"],
            patterns: ["bloorestaurant", "\\brestaurant\\b", "\\bresto\\b"],
            build(ctx) {
                const p = ctx.knowledge.products.bloorestaurant;
                ctx.memory.productFocus = "bloorestaurant";
                ctx.memory.sector = "restaurant";
                ctx.memory.topic = "product:bloorestaurant";
                return {
                    text: p.summary + "\n\nSouhaitez-vous que je prépare un devis ou un rendez-vous ?",
                    ctas: [C().quote, C().appointment, { href: p.href, label: "Voir B.one restaurant" }],
                };
            },
        },
        {
            id: "general",
            category: "Conversation générale",
            weight: 12,
            examples: ["ok", "d accord", "je vois", "continue", "et ensuite"],
            patterns: ["^ok$", "^d accord$", "^je vois$", "^continue$"],
            build(ctx) {
                if (ctx.memory.productFocus && ctx.knowledge.products[ctx.memory.productFocus]) {
                    const p = ctx.knowledge.products[ctx.memory.productFocus];
                    return {
                        text: "Très bien. On reste sur " + p.name + ". Vous voulez un détail, un devis, ou un rendez-vous ?",
                        ctas: [C().quote, C().appointment, C().services],
                    };
                }
                if (ctx.memory.topic === "services" || ctx.memory.topic === "about") {
                    return {
                        text: "Parfait. Je peux détailler nos produits, nos services, ou démarrer un devis. Que préférez-vous ?",
                        ctas: [C().products, C().services, C().quote],
                    };
                }
                return {
                    text: "Dites-moi simplement ce que vous recherchez : une présentation, un produit, un devis ou un rendez-vous.",
                    ctas: [C().about, C().products, C().quote],
                };
            },
        },
    ];

    global.BloomarChatIntents = {
        list: INTENTS,
        getById(id) {
            return INTENTS.find((i) => i.id === id) || null;
        },
    };
})(typeof window !== "undefined" ? window : globalThis);
