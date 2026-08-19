/**
 * BL∞MAR ONE — Internationalisation FR / EN
 */
(function antiFlashTheme() {
  try {
    const t = localStorage.getItem('bloomar-theme');
    if (t) document.documentElement.dataset.theme = t;
  } catch (_) { /* ignore */ }
})();
const I18N = {
  fr: {
    'meta.title': 'Bloomarone | Écosystème technologique pour PME',
    'brand.tagline': "Pilotes d'Infrastructure Financière",
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.projects': 'Réalisations',
    'nav.about': 'À propos',
    'nav.assist': 'Bloomar Assist',
    'nav.pricing': 'Tarifs',
    'nav.resources': 'Ressources',
    'nav.resourcesMobile': 'Ressources & Guides',
    'nav.startProject': 'Démarrer un projet',
    'nav.tagline': 'Une plateforme, mille opportunités.',
    'nav.products': 'Produits',
    'nav.login': 'Se connecter',
    'theme.light': 'Activer le mode clair',
    'theme.dark': 'Activer le mode sombre',
    'sidebar.help': "Besoin d'aide ? Appelez-nous au +237 652 209 175",

    'hero.premiumBadge': 'Technologie • Conseil • Paiement • SaaS • Support',
    'hero.premiumLead': 'Bloomarone conçoit des solutions digitales innovantes pour simplifier vos opérations, renforcer votre performance et accélérer votre croissance.',
    'hero.trust1t': 'Paiements locaux',
    'hero.trust1d': 'MTN MoMo • Orange Money',
    'hero.trust2t': 'Solutions sur mesure',
    'hero.trust2d': 'Web • Mobile • Logiciels',
    'hero.trust3t': 'Produits SaaS',
    'hero.trust3d': "Prêts à l'emploi",
    'hero.trust4t': 'Accompagnement',
    'hero.trust4d': 'Conseil & croissance',
    'hero.trust5t': 'Support de proximité',
    'hero.trust5d': 'Yaoundé • Douala',

    'premium.servicesLabel': 'Nos services officiels',
    'premium.servicesTitle': 'Tout ce dont votre activité a besoin',

    'hero.brand': 'Bloomar ONE',
    'hero.title': 'Des logiciels sur mesure qui accélèrent la croissance de votre entreprise.',
    'hero.desc': 'Bloomarone accompagne les entreprises, écoles et restaurants dans leur transformation digitale grâce à des solutions logicielles innovantes, des applications web et mobiles, des plateformes SaaS et des infrastructures modernes.',
    'hero.cta1': 'Demander une démonstration',
    'hero.cta2': 'Découvrir nos solutions',
    'hero.badge1': 'Développement sur mesure',
    'hero.badge2': 'Produits SaaS',
    'hero.badge3': 'Support & Maintenance',
    'hero.trust': 'Applications sécurisées • Hébergement • Maintenance • Support',

    'services.badge': 'NOS SERVICES',
    'services.title': 'Des solutions digitales complètes pour faire grandir votre business',
    'services.desc': "Nous maîtrisons l'ensemble de la chaîne de valeur numérique pour structurer la conformité locale et débloquer les opportunités financières des PME au Cameroun.",

    'meta.title.services': 'Services | BL∞MAR ONE',
    'meta.title.contact': 'Contact | BL∞MAR ONE',
    'meta.title.about': 'À propos | BL∞MAR ONE',
    'meta.title.pricing': 'Tarifs | BL∞MAR ONE',
    'meta.title.projects': 'Réalisations | BL∞MAR ONE',
    'meta.title.assist': 'Bloomar Assist | BL∞MAR ONE',
    'meta.title.resources': 'Ressources | BL∞MAR ONE',
    'meta.title.legal': 'Mentions légales | BL∞MAR ONE',
    'meta.title.terms': "Conditions d'utilisation | BL∞MAR ONE",

    'svc.badge': 'Nos services',
    'svc.title': 'Des solutions digitales complètes pour votre PME',
    'svc.desc': "De la conception d'applications à l'accompagnement financier, en passant par le SAV et le matériel — BL∞MAR ONE couvre toute la chaîne de valeur numérique des entreprises camerounaises.",
    'svc.tag1': '01 · B.one Payment',
    'svc.tag2': '02 · Web & Mobile',
    'svc.tag3': '03 · Accompagnement',
    'svc.tag4': '04 · SAV',
    'svc.tag5': '05 · Indispensables',
    'svc.s1.title': 'B.one Payment',
    'svc.s1.desc': 'B.one Payment est notre solution de paiement pour encaisser facilement via Mobile Money (MTN MoMo, Orange Money) et fluidifier vos transactions commerciales — en ligne, en boutique ou sur vos applications.',
    'svc.s1.cta': 'Activer B.one Payment',
    'svc.s1.box1': 'Ce que vous gagnez',
    'svc.s1.li1': 'Encaissement MTN MoMo & Orange Money',
    'svc.s1.li2': 'Paiements sécurisés pour sites, apps et points de vente',
    'svc.s1.li3': 'Suivi des transactions et rapprochements simplifiés',
    'svc.s1.li4': "Intégration avec l'écosystème Bloomarone (caisse, e-commerce, SaaS)",
    'svc.s1.box2': 'Pour qui ?',
    'svc.s1.who': 'Commerces, restaurants, écoles, plateformes en ligne et toute entreprise qui veut accepter les paiements mobiles au Cameroun sans friction.',
    'svc.s2.title': 'Solutions Web & Mobile sur mesure',
    'svc.s2.desc': 'Nous concevons et développons des applications adaptées à votre métier : caisse, gestion de stocks, réservations, scolarité, facturation. Chaque solution intègre les moyens de paiement locaux (MTN MoMo, Orange Money) et respecte les contraintes du terrain camerounais.',
    'svc.s2.cta': 'Demander un devis',
    'svc.s2.box1': 'Ce que nous livrons',
    'svc.s2.li1': "Logiciels de gestion d'entreprise (ERP léger, POS, CRM)",
    'svc.s2.li2': 'Applications mobiles Android / iOS pour vos équipes terrain',
    'svc.s2.li3': 'Sites web vitrines et e-commerce avec paiement mobile intégré',
    'svc.s2.li4': 'Tableaux de bord financiers et indicateurs en temps réel',
    'svc.s2.box2': 'Pour qui ?',
    'svc.s2.who': 'Restaurants, hôtels, boutiques, écoles, cabinets et toute PME qui souhaite digitaliser ses opérations sans complexité inutile.',
    'svc.s2.box3': 'Notre méthode',
    'svc.s2.m1': 'Audit de vos processus actuels',
    'svc.s2.m2': 'Prototype et validation avec vos équipes',
    'svc.s2.m3': 'Développement, tests et déploiement',
    'svc.s2.m4': 'Formation et mise en production',
    'svc.s3.title': 'Accompagnement, structuration & croissance',
    'svc.s3.desc': 'Au-delà du logiciel, nous vous aidons à structurer votre activité : comptabilité SYSCOHADA, modélisation financière, analyse de données et détection des fuites de marge. Vous pilotez votre entreprise avec des chiffres fiables.',
    'svc.s3.cta': 'Planifier un diagnostic',
    'svc.s3.box1': 'Prestations incluses',
    'svc.s3.li1': 'Structuration financière, comptable et juridique (OHADA)',
    'svc.s3.li2': 'Modélisation financière : seuil de rentabilité, BFR, trésorerie',
    'svc.s3.li3': 'Business intelligence : tableaux de bord et rapports automatisés',
    'svc.s3.li4': 'Détection des pertes, anomalies de caisse et opportunités de marge',
    'svc.s3.box2': 'Livrables concrets',
    'svc.s3.deliver': "Plan de trésorerie prévisionnel, rapport de rentabilité par activité, recommandations d'optimisation des coûts et feuille de route de croissance sur 12 mois.",
    'svc.s4.title': 'Service après-vente de proximité',
    'svc.s4.desc': "Une équipe humaine basée à Yaoundé vous accompagne au quotidien : assistance technique, formation sur site, maintenance préventive et conseil stratégique. Pas de ticket perdu dans une file d'attente internationale.",
    'svc.s4.cta': 'Contacter le SAV',
    'svc.s4.li1': 'Support en cas de panne ou dysfonctionnement (WhatsApp, téléphone, sur site)',
    'svc.s4.li2': 'Formation et prise en main de vos équipes à Yaoundé et Douala',
    'svc.s4.li3': 'Mises à jour logicielles et correctifs de sécurité',
    'svc.s4.li4': "Conseil stratégique et recommandations d'évolution de vos outils",
    'svc.s4.hoursTitle': "Horaires d'assistance",
    'svc.s4.hours': 'Lundi – Vendredi, 8h00 – 17h00 · Quartier Omnisports, Yaoundé',
    'svc.s5.title': 'Les indispensables',
    'svc.s5.desc': 'Nous fournissons et configurons le matériel essentiel à votre écosystème digital : terminaux de caisse, imprimantes thermiques, pointeuses biométriques et tablettes de commande — testés et compatibles avec nos solutions.',
    'svc.s5.cta': 'Voir les tarifs matériel',
    'svc.s5.i1t': 'Imprimante thermique',
    'svc.s5.i1d': 'Reçus de caisse, tickets cuisine, rechargeable — idéale pour restaurants et boutiques.',
    'svc.s5.i2t': 'Pointeuse biométrique',
    'svc.s5.i2d': 'Suivi des présences et sécurisation des accès pour vos équipes.',
    'svc.s5.i3t': 'Tablettes de commande',
    'svc.s5.i3d': 'Prise de commande en salle, synchronisée avec la cuisine et la caisse.',
    'svc.s5.i4t': 'Terminal POS',
    'svc.s5.i4d': 'Caisse tactile complète avec BL∞MAR ONE préinstallé et configuré.',
    'svc.ctaTitle': 'Prêt à structurer votre activité ?',
    'svc.ctaDesc': 'Parlez-nous de votre projet — nous vous proposons un diagnostic gratuit et une feuille de route adaptée.',
    'svc.ctaBtn': 'Demander mon audit gratuit',

    'footer.services': 'Services',
    'footer.products': 'Produits',
    'footer.links': 'Liens',
    'footer.blog': 'Blog',
    'footer.privacy': 'Politique de confidentialité',
    'footer.hours': 'Lun–Ven : 8h–17h',
    'footer.premiumDesc': 'Des solutions digitales innovantes qui simplifient vos opérations et accélèrent votre croissance.',
    'footer.agency': 'Contact',
    'footer.address': 'Yaoundé, Quartier Omnisports, Cameroun',
    'footer.dev': 'Espace Développeurs',
    'footer.legal': 'Mentions légales',
    'footer.terms': "Conditions d'utilisation",
    'footer.svcPayment': 'B.one Payment',
    'footer.svcWeb': 'Solutions Web & Mobile',
    'footer.svcSupport': 'Accompagnement & Croissance',
    'footer.svcSav': 'Service Après-Vente',
    'footer.svcGear': 'Les Indispensables',
    'footer.contactLink': 'Contact',

    'about.badge': 'NOTRE HISTOIRE',
    'about.title1': 'Tout a commencé par une réalité que nous avons vécue nous-mêmes.',
    'about.p1': "Avant BL∞MAR ONE, nous étions de l'autre côté.",
    'about.p2': "Comme de nombreux entrepreneurs, nous avions lancé notre propre activité avec enthousiasme, ambition et l'envie de construire quelque chose de durable.",
    'about.p3': "Mais au fil du temps, nous avons découvert une réalité que beaucoup d'entrepreneurs africains connaissent bien : une entreprise ne se développe pas uniquement grâce à de bonnes idées.",
    'about.s2.title': 'La leçon qui a tout changé',
    'about.s3.title': 'Une conviction est née',
    'about.s4.title': "BL∞MAR ONE : transformer l'expérience des PME",
    'about.s5.title': "Plus qu'un prestataire, un partenaire de croissance",
    'about.s6.title': 'Notre vision & Notre promesse',

    'contact.badge': 'CONSTRUISEZ VOTRE RÉUSSITE',
    'contact.title': 'Prêt à passer au niveau supérieur ?',
    'contact.desc': 'Parlons de votre projet et construisons ensemble votre réussite digitale au Cameroun. Notre équipe effectue un diagnostic complet de votre structure.',
    'contact.name': 'Votre Nom',
    'contact.company': 'Nom de votre PME',
    'contact.phone': 'Numéro de Téléphone (WhatsApp)',
    'contact.need': "Besoin d'accompagnement ciblé",
    'contact.submit': 'Demander mon audit gratuit',
    'contact.orCall': 'Ou contactez-nous directement :',
    'contact.whatsappNext': 'Demande enregistrée ! Envoyez le message WhatsApp pour que nous la recevions.',
    'contact.whatsappHint': 'Après validation, WhatsApp s’ouvre : cliquez sur Envoyer pour nous transmettre votre demande.',
    'contact.opt1': 'B.one Payment',
    'contact.opt2': 'Solutions Web & Mobile sur Mesure',
    'contact.opt3': 'Accompagnement, Structuration & Croissance',
    'contact.opt4': 'Service Après-Vente (SAV)',
    'contact.opt5': 'Les Indispensables (POS/Caisse)',
    'contact.namePh': 'Ex: Jean-Marc',
    'contact.companyPh': 'Ex: Restaurant LeBon',
    'contact.phonePh': 'Ex: +237 652 209 175',
    'contact.phoneDisplay': '+237 652 209 175',
    'contact.emailDisplay': 'contact@bloomarone.com',
    'contact.whatsapp': 'WhatsApp',

    'pricing.badge': 'STRATÉGIE TARIFAIRE',
    'pricing.title': 'Une tarification simple, adaptée à votre échelle',
    'pricing.desc': 'Commencez sereinement avec notre offre transversale ou sélectionnez le module spécialisé adapté à votre cœur d\'activité professionnelle.',
    'pricing.tabGeneral': 'Essai Gratuit & Plan Starter',
    'pricing.tabSpecialized': 'Solutions Métiers Avancées',
    'pricing.restaurant': 'Restaurants',
    'pricing.boutique': 'Boutiques',
    'pricing.school': 'Écoles',
    'pricing.hotel': 'Hôtels',

    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'footer.rights': 'Tous droits réservés.',
    'footer.desc': 'Partenaire numérique de premier choix au Cameroun, nous vous accompagnons dans votre développement grâce à des solutions numériques innovantes adaptées aux réalités quotidiennes.',

    'cookie.title': 'Nous respectons votre vie privée',
    'cookie.desc': 'Nous utilisons des cookies essentiels et, avec votre accord, des outils de mesure d\'audience pour améliorer votre expérience.',
    'cookie.refuse': 'Continuer sans accepter',
    'cookie.customize': 'Personnaliser',
    'cookie.accept': 'Tout accepter',

    'toast.serverError': 'Impossible de contacter le serveur. Réessayez.',
    'toast.download': 'Téléchargement initialisé pour :',

    'chatbot.placeholder': 'Saisissez une valeur ou posez une question...',
    'chatbot.welcome': 'Bonjour ! Je suis',
    'chatbot.welcomeRole': "votre conseiller expert d'aide au pilotage.",
    'chatbot.hint': 'Cliquez sur une question ci-dessous ou posez votre propre question pour me tester.',
  },
  en: {
    'meta.title': 'Bloomarone | Technology ecosystem for SMEs',
    'brand.tagline': 'Financial Infrastructure Pilots',
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.projects': 'Case Studies',
    'nav.about': 'About',
    'nav.assist': 'Bloomar Assist',
    'nav.pricing': 'Pricing',
    'nav.resources': 'Resources',
    'nav.resourcesMobile': 'Resources & Guides',
    'nav.startProject': 'Start a project',
    'nav.tagline': 'One platform, a thousand opportunities.',
    'nav.products': 'Products',
    'nav.login': 'Sign in',
    'theme.light': 'Enable light mode',
    'theme.dark': 'Enable dark mode',
    'sidebar.help': 'Need help? Call us at +237 652 209 175',

    'hero.premiumBadge': 'Technology • Advisory • Payment • SaaS • Support',
    'hero.premiumLead': 'Bloomarone builds innovative digital solutions to simplify your operations, strengthen performance and accelerate growth.',
    'hero.trust1t': 'Local payments',
    'hero.trust1d': 'MTN MoMo • Orange Money',
    'hero.trust2t': 'Custom solutions',
    'hero.trust2d': 'Web • Mobile • Software',
    'hero.trust3t': 'SaaS products',
    'hero.trust3d': 'Ready to deploy',
    'hero.trust4t': 'Advisory',
    'hero.trust4d': 'Growth & strategy',
    'hero.trust5t': 'Local support',
    'hero.trust5d': 'Yaoundé • Douala',

    'premium.servicesLabel': 'Our official services',
    'premium.servicesTitle': 'Everything your business needs',

    'hero.brand': 'Bloomar ONE',
    'hero.title': 'Custom software that accelerates your business growth.',
    'hero.desc': 'Bloomarone helps companies, schools and restaurants transform digitally with innovative software, web and mobile apps, SaaS platforms and modern infrastructure.',
    'hero.cta1': 'Request a demo',
    'hero.cta2': 'Explore our solutions',
    'hero.badge1': 'Custom development',
    'hero.badge2': 'SaaS products',
    'hero.badge3': 'Support & Maintenance',
    'hero.trust': 'Secure apps • Hosting • Maintenance • Support',

    'services.badge': 'OUR SERVICES',
    'services.title': 'Complete digital solutions to grow your business',
    'services.desc': 'We master the full digital value chain to structure local compliance and unlock financial opportunities for SMEs in Cameroon.',

    'meta.title.services': 'Services | BL∞MAR ONE',
    'meta.title.contact': 'Contact | BL∞MAR ONE',
    'meta.title.about': 'About | BL∞MAR ONE',
    'meta.title.pricing': 'Pricing | BL∞MAR ONE',
    'meta.title.projects': 'Case Studies | BL∞MAR ONE',
    'meta.title.assist': 'Bloomar Assist | BL∞MAR ONE',
    'meta.title.resources': 'Resources | BL∞MAR ONE',
    'meta.title.legal': 'Legal notice | BL∞MAR ONE',
    'meta.title.terms': 'Terms of use | BL∞MAR ONE',

    'svc.badge': 'Our services',
    'svc.title': 'Complete digital solutions for your SME',
    'svc.desc': 'From application design to financial support, including after-sales and hardware — BL∞MAR ONE covers the full digital value chain for Cameroonian businesses.',
    'svc.tag1': '01 · B.one Payment',
    'svc.tag2': '02 · Web & Mobile',
    'svc.tag3': '03 · Advisory',
    'svc.tag4': '04 · Support',
    'svc.tag5': '05 · Essentials',
    'svc.s1.title': 'B.one Payment',
    'svc.s1.desc': 'B.one Payment is our payment solution to collect easily via Mobile Money (MTN MoMo, Orange Money) and streamline your business transactions — online, in-store or in your apps.',
    'svc.s1.cta': 'Activate B.one Payment',
    'svc.s1.box1': 'What you get',
    'svc.s1.li1': 'MTN MoMo & Orange Money collection',
    'svc.s1.li2': 'Secure payments for sites, apps and points of sale',
    'svc.s1.li3': 'Transaction tracking and simplified reconciliation',
    'svc.s1.li4': 'Integration with the Bloomarone ecosystem (POS, e-commerce, SaaS)',
    'svc.s1.box2': 'Who is it for?',
    'svc.s1.who': 'Shops, restaurants, schools, online platforms and any business that wants frictionless mobile payments in Cameroon.',
    'svc.s2.title': 'Custom Web & Mobile solutions',
    'svc.s2.desc': 'We design and build apps tailored to your business: POS, inventory, bookings, schooling, invoicing. Every solution integrates local payment methods (MTN MoMo, Orange Money) and fits Cameroonian field realities.',
    'svc.s2.cta': 'Request a quote',
    'svc.s2.box1': 'What we deliver',
    'svc.s2.li1': 'Business management software (light ERP, POS, CRM)',
    'svc.s2.li2': 'Android / iOS mobile apps for field teams',
    'svc.s2.li3': 'Showcase websites and e-commerce with mobile payments',
    'svc.s2.li4': 'Financial dashboards and real-time KPIs',
    'svc.s2.box2': 'Who is it for?',
    'svc.s2.who': 'Restaurants, hotels, shops, schools, firms and any SME that wants to digitize operations without unnecessary complexity.',
    'svc.s2.box3': 'Our method',
    'svc.s2.m1': 'Audit of your current processes',
    'svc.s2.m2': 'Prototype and validation with your teams',
    'svc.s2.m3': 'Development, testing and deployment',
    'svc.s2.m4': 'Training and go-live',
    'svc.s3.title': 'Advisory, structuring & growth',
    'svc.s3.desc': 'Beyond software, we help you structure your business: SYSCOHADA accounting, financial modeling, data analysis and margin-leak detection. You run your company with reliable numbers.',
    'svc.s3.cta': 'Book a diagnostic',
    'svc.s3.box1': 'Included services',
    'svc.s3.li1': 'Financial, accounting and legal structuring (OHADA)',
    'svc.s3.li2': 'Financial modeling: break-even, working capital, cash flow',
    'svc.s3.li3': 'Business intelligence: dashboards and automated reports',
    'svc.s3.li4': 'Loss detection, cash anomalies and margin opportunities',
    'svc.s3.box2': 'Concrete deliverables',
    'svc.s3.deliver': 'Cash-flow forecast, profitability report by activity, cost optimization recommendations and a 12-month growth roadmap.',
    'svc.s4.title': 'Local after-sales support',
    'svc.s4.desc': 'A human team based in Yaoundé supports you daily: technical assistance, on-site training, preventive maintenance and strategic advice. No ticket lost in an international queue.',
    'svc.s4.cta': 'Contact support',
    'svc.s4.li1': 'Support for outages or issues (WhatsApp, phone, on-site)',
    'svc.s4.li2': 'Training and onboarding for your teams in Yaoundé and Douala',
    'svc.s4.li3': 'Software updates and security patches',
    'svc.s4.li4': 'Strategic advice and evolution recommendations for your tools',
    'svc.s4.hoursTitle': 'Support hours',
    'svc.s4.hours': 'Monday – Friday, 8:00 AM – 5:00 PM · Omnisports district, Yaoundé',
    'svc.s5.title': 'Essentials',
    'svc.s5.desc': 'We supply and configure the hardware essential to your digital ecosystem: POS terminals, thermal printers, biometric clocks and order tablets — tested and compatible with our solutions.',
    'svc.s5.cta': 'See hardware pricing',
    'svc.s5.i1t': 'Thermal printer',
    'svc.s5.i1d': 'Cash receipts, kitchen tickets, rechargeable — ideal for restaurants and shops.',
    'svc.s5.i2t': 'Biometric clock',
    'svc.s5.i2d': 'Attendance tracking and access security for your teams.',
    'svc.s5.i3t': 'Order tablets',
    'svc.s5.i3d': 'In-room ordering, synced with kitchen and cash register.',
    'svc.s5.i4t': 'POS terminal',
    'svc.s5.i4d': 'Complete touch POS with BL∞MAR ONE preinstalled and configured.',
    'svc.ctaTitle': 'Ready to structure your business?',
    'svc.ctaDesc': 'Tell us about your project — we offer a free diagnostic and a tailored roadmap.',
    'svc.ctaBtn': 'Request my free audit',

    'footer.services': 'Our services',
    'footer.products': 'Products',
    'footer.links': 'Links',
    'footer.blog': 'Blog',
    'footer.privacy': 'Privacy policy',
    'footer.hours': 'Mon–Fri: 8am–5pm',
    'footer.premiumDesc': 'Innovative digital solutions that simplify operations and accelerate growth.',
    'footer.agency': 'Contact',
    'footer.address': 'Yaoundé, Omnisports district, Cameroon',
    'footer.dev': 'Developers area',
    'footer.legal': 'Legal notice',
    'footer.terms': 'Terms of use',
    'footer.svcPayment': 'B.one Payment',
    'footer.svcWeb': 'Web & Mobile solutions',
    'footer.svcSupport': 'Advisory & Growth',
    'footer.svcSav': 'After-sales support',
    'footer.svcGear': 'Essentials',
    'footer.contactLink': 'Contact',

    'about.badge': 'OUR STORY',
    'about.title1': 'It all started with a reality we experienced ourselves.',
    'about.p1': 'Before BL∞MAR ONE, we were on the other side.',
    'about.p2': 'Like many entrepreneurs, we launched our own business with enthusiasm, ambition and the desire to build something lasting.',
    'about.p3': 'Over time, we discovered a reality many African entrepreneurs know well: a business does not grow on good ideas alone.',
    'about.s2.title': 'The lesson that changed everything',
    'about.s3.title': 'A conviction was born',
    'about.s4.title': 'BL∞MAR ONE: transforming the SME experience',
    'about.s5.title': 'More than a vendor, a growth partner',
    'about.s6.title': 'Our vision & our promise',

    'contact.badge': 'BUILD YOUR SUCCESS',
    'contact.title': 'Ready to level up?',
    'contact.desc': 'Let\'s talk about your project and build your digital success in Cameroon together. Our team performs a full diagnostic of your structure.',
    'contact.name': 'Your Name',
    'contact.company': 'Company Name',
    'contact.phone': 'Phone Number (WhatsApp)',
    'contact.need': 'Targeted support need',
    'contact.submit': 'Request my free audit',
    'contact.orCall': 'Or contact us directly:',
    'contact.whatsappNext': 'Request saved! Send the WhatsApp message so we receive it.',
    'contact.whatsappHint': 'After submitting, WhatsApp opens — tap Send to deliver your request.',
    'contact.opt1': 'B.one Payment',
    'contact.opt2': 'Custom Web & Mobile Solutions',
    'contact.opt3': 'Support, Structuring & Growth',
    'contact.opt4': 'After-Sales Service (Support)',
    'contact.opt5': 'Essentials (POS/Cash Register)',
    'contact.namePh': 'E.g.: John',
    'contact.companyPh': 'E.g.: LeBon Restaurant',
    'contact.phonePh': 'E.g.: +237 652 209 175',
    'contact.phoneDisplay': '+237 652 209 175',
    'contact.emailDisplay': 'contact@bloomarone.com',
    'contact.whatsapp': 'WhatsApp',

    'pricing.badge': 'PRICING STRATEGY',
    'pricing.title': 'Simple pricing adapted to your scale',
    'pricing.desc': 'Start confidently with our cross-cutting offer or select the specialized module for your core business.',
    'pricing.tabGeneral': 'Free Trial & Starter Plan',
    'pricing.tabSpecialized': 'Advanced Industry Solutions',
    'pricing.restaurant': 'Restaurants',
    'pricing.boutique': 'Retail Shops',
    'pricing.school': 'Schools',
    'pricing.hotel': 'Hotels',

    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    'footer.desc': 'Leading digital partner in Cameroon, we support your growth with innovative solutions adapted to daily realities.',

    'cookie.title': 'We respect your privacy',
    'cookie.desc': 'We use essential cookies and, with your consent, analytics tools to improve your experience.',
    'cookie.refuse': 'Continue without accepting',
    'cookie.customize': 'Customize',
    'cookie.accept': 'Accept all',

    'toast.serverError': 'Unable to reach the server. Please try again.',
    'toast.download': 'Download started for:',

    'chatbot.placeholder': 'Enter a value or ask a question...',
    'chatbot.welcome': 'Hello! I am',
    'chatbot.welcomeRole': 'your expert advisory assistant.',
    'chatbot.hint': 'Click a question below or ask your own to test me.',
  },
};

let currentLang = 'fr';

function t(key) {
  return I18N[currentLang]?.[key] ?? I18N.fr[key] ?? key;
}

function getLang() {
  return currentLang;
}

function getLocale() {
  return currentLang === 'en' ? 'en-US' : 'fr-FR';
}

function updateLangButtons() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle('lang-btn--active', active);
    btn.classList.toggle('bg-bloomar-violet', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('text-slate-600', !active);
    btn.classList.toggle('bg-white', !active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function applyTranslations() {
  document.documentElement.lang = currentLang;

  const page = document.body?.dataset?.page || '';
  const pageTitleMap = {
    index: 'meta.title',
    services: 'meta.title.services',
    contact: 'meta.title.contact',
    'a-propos': 'meta.title.about',
    tarifs: 'meta.title.pricing',
    realisations: 'meta.title.projects',
    assist: 'meta.title.assist',
    ressources: 'meta.title.resources',
    'mentions-legales': 'meta.title.legal',
    'conditions-utilisation': 'meta.title.terms',
  };
  document.title = t(pageTitleMap[page] || 'meta.title');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('select option[data-i18n]').forEach((opt) => {
    opt.textContent = t(opt.dataset.i18n);
  });

  updateLangButtons();
  if (typeof getTheme === 'function' && typeof applyTheme === 'function') {
    applyTheme(getTheme());
  }
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  localStorage.setItem('bloomar-lang', lang);
  applyTranslations();
}

function initLanguage() {
  const saved = localStorage.getItem('bloomar-lang');
  const browser = navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
  setLanguage(saved || browser);
}

document.addEventListener('DOMContentLoaded', initLanguage);
document.addEventListener('layoutReady', applyTranslations);
