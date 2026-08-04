/**
 * Bloomar Chat — Base de connaissances (faits uniquement)
 * Aucune logique de dialogue ici. Facile à enrichir.
 */
(function (global) {
    "use strict";

    const knowledge = {
        version: "2.0.0",

        company: {
            name: "Bloomarone",
            brand: "BL∞MAR ONE",
            pitch:
                "Bloomarone accompagne les entreprises, écoles et restaurants dans leur transformation digitale avec des logiciels, applications et plateformes adaptés au terrain camerounais.",
            values: [
                "Proximité locale",
                "Solutions concrètes",
                "Accompagnement humain",
                "Fiabilité technique",
            ],
            technologies: [
                "Applications web & mobile",
                "SaaS",
                "ERP / CRM",
                "Cloud",
                "Mobile Money",
                "IA appliquée au métier",
            ],
            contact: {
                phone: "+237 652 209 175",
                whatsapp: "237652209175",
                email: "contact@bloomarone.com",
                address: "Yaoundé, Quartier Omnisports, Cameroun",
                hours: "Lundi – Vendredi, 8h00 – 17h00",
            },
        },

        products: {
            bone_payment: {
                id: "bone_payment",
                name: "B.one Payment",
                sector: "paiement",
                summary:
                    "B.one Payment permet d’encaisser facilement via Mobile Money (MTN MoMo, Orange Money), en ligne ou en point de vente, avec un suivi clair des transactions.",
                href: "services.html#bone-payment",
            },
            blooschool: {
                id: "blooschool",
                name: "BLOOSCHOOL",
                sector: "ecole",
                summary:
                    "BLOOSCHOOL aide les établissements scolaires à gérer élèves, notes, communication parents, paiements et pilotage au quotidien.",
                href: "index.html#blooschool",
            },
            bloorestaurant: {
                id: "bloorestaurant",
                name: "BLOORESTAURANT",
                sector: "restaurant",
                summary:
                    "BLOORESTAURANT digitalise le restaurant : commandes, caisse, cuisine, stocks et suivi des ventes en FCFA.",
                href: "index.html#bloorestaurant",
            },
            assist: {
                id: "assist",
                name: "Bloomar Assist",
                sector: "conseil",
                summary:
                    "Bloomar Assist regroupe des assistants de gestion pour orienter et accélérer certaines décisions métier.",
                href: "assist.html",
            },
        },

        services: [
            {
                id: "payment",
                name: "B.one Payment",
                summary: "Solution de paiement Mobile Money pour encaisser sans friction.",
            },
            {
                id: "web_mobile",
                name: "Développement web & mobile",
                summary: "Sites, applications et outils métier conçus sur mesure.",
            },
            {
                id: "erp_crm_saas",
                name: "ERP, CRM & SaaS",
                summary: "Plateformes pour structurer ventes, clients et opérations.",
            },
            {
                id: "advisory",
                name: "Accompagnement & croissance",
                summary: "Structuration, pilotage financier et feuille de route digitale.",
            },
            {
                id: "support",
                name: "Support & SAV",
                summary: "Assistance de proximité, formation et maintenance.",
            },
        ],

        sectors: [
            { id: "restaurant", label: "Restaurant", product: "bloorestaurant" },
            { id: "ecole", label: "École", product: "blooschool" },
            { id: "commerce", label: "Commerce", product: "bone_payment" },
            { id: "clinique", label: "Clinique", product: null },
            { id: "entreprise", label: "Entreprise", product: null },
            { id: "autre", label: "Autre", product: null },
        ],

        faq: [
            {
                q: "Intervenez-vous au Cameroun ?",
                a: "Oui. Notre équipe est basée à Yaoundé et accompagne des structures partout au Cameroun.",
            },
            {
                q: "Proposez-vous du sur-mesure ?",
                a: "Oui. Nous construisons aussi des solutions adaptées à vos process réels, en plus de nos produits SaaS.",
            },
            {
                q: "Comment démarrer ?",
                a: "Le plus simple est d’échanger sur votre besoin, puis de planifier un devis ou un rendez-vous.",
            },
        ],

        offTopicReply:
            "Je suis spécialisé dans les solutions et services de Bloomarone. Je ne peux malheureusement pas répondre aux questions de culture générale.",

        welcome:
            "Bonjour 👋 Je suis Bloomar, l’assistant de Bloomarone.\n\nJe peux vous présenter nos solutions, répondre à vos questions, préparer un devis ou un rendez-vous.\n\nDites-moi simplement ce que vous cherchez.",
    };

    global.BloomarChatKnowledge = knowledge;
})(typeof window !== "undefined" ? window : globalThis);
