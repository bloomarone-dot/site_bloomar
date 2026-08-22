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
                name: "B.one school",
                sector: "ecole",
                summary:
                    "BLOOSCHOOL aide les établissements scolaires à gérer élèves, notes, communication parents, paiements et pilotage au quotidien.",
                href: "produits.html",
            },
            bloorestaurant: {
                id: "bloorestaurant",
                name: "B.one restaurant",
                sector: "restaurant",
                summary:
                    "BLOORESTAURANT digitalise le restaurant : commandes, caisse, cuisine, stocks et suivi des ventes en FCFA.",
                href: "produits.html",
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
                id: "procom",
                name: "B.one ProCom",
                summary: "Communication interne sécurisée entre équipes, filiales et services.",
            },
            {
                id: "support",
                name: "Support de proximité",
                summary: "Assistance, formation et maintenance.",
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
            "Je suis Bloomar, l’assistante de Bloomarone — je réponds sur nos produits, services, devis et rendez-vous.\n\nVotre question sort de mon périmètre : je ne peux pas répondre à ce sujet personnellement, mais je peux vous orienter vers l’équipe Bloomarone si besoin.",

        welcome:
            "Bonjour 👋 Je suis Bloomar, votre assistante Bloomarone.\n\nJe peux répondre à vos questions sur nos solutions, préparer un devis, un rendez-vous ou vous mettre en contact avec l’équipe.\n\nQue souhaitez-vous faire aujourd’hui ?",
    };

    global.BloomarChatKnowledge = knowledge;
})(typeof window !== "undefined" ? window : globalThis);
