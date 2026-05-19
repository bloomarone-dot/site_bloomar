import { createContext, useContext, useState, ReactNode } from 'react'

export type Lang = 'fr' | 'en'

interface ServiceItem {
  emoji: string; title: string; slug: string; tagline: string
  desc: string; features: string[]
}
interface StepItem { num: string; title: string; desc: string }
interface ValueItem { icon: string; title: string; desc: string }
interface NavLink { label: string; href: string }

interface T {
  nav: { home: string; services: string; about: string; contact: string; cta: string }
  hero: {
    badge: string; headline1: string; headlineGradient: string; headline2: string
    subtitle: string; ctaPrimary: string; ctaSecondary: string
    stat1: string; stat1Label: string; stat2: string; stat2Label: string
    stat3: string; stat3Label: string; scroll: string; badge1: string; badge2: string
  }
  marquee: string[]
  services: { label: string; heading: string; headingGradient: string; sub: string; learnMore: string; items: ServiceItem[] }
  howItWorks: { label: string; heading: string; headingGradient: string; steps: StepItem[] }
  reviews: { label: string; heading: string; headingGradient: string; empty: string; emptySub: string; ctaLabel: string }
  cta: { heading: string; headingGradient: string; sub: string; primary: string; whatsapp: string }
  footer: {
    tagline: string; nav: string; servicesCol: string; contactCol: string
    copyright: string; madeWith: string; links: NavLink[]; servicesList: string[]
    email: string; phone: string; address: string
  }
  form: {
    title: string; name: string; email: string; company: string; service: string
    message: string; submit: string; success: string; close: string; services: string[]
    namePlaceholder: string; emailPlaceholder: string; companyPlaceholder: string; messagePlaceholder: string
  }
  contact: {
    label: string; heading: string; headingGradient: string; sub: string
    formTitle: string; mapTitle: string; addressLabel: string; phoneLabel: string
    emailLabel: string; hoursLabel: string; hours: string
    contact_coords: string; contact_phone: string; contact_email: string
    contact_address: string; contact_wa: string; contact_select: string
    contact_submit: string; contact_success: string
  }
  about: {
    label: string; heading: string; headingGradient: string; sub: string
    storyLabel: string; storyHeading: string; storyText1: string; storyText2: string
    valuesLabel: string; valuesHeading: string; values: ValueItem[]
    missionLabel: string; missionHeading: string; missionText: string
    visionHeading: string; visionText: string
    ctaHeading: string; ctaSub: string; ctaBtn: string
    about_team_h2?: string
  }
  pricing_label: string; pricing_h2: string; pricing_sub: string; pricing_popular: string
  pricing_starter: string; pricing_pro: string; pricing_enterprise: string
  pricing_free: string; pricing_pro_price: string; pricing_enterprise_price: string
  pricing_month: string
  pricing_cta_starter: string; pricing_cta_pro: string; pricing_cta_enterprise: string
  services_page_label: string; services_page_h1a: string; services_page_h1b: string; services_page_sub: string
  services_page_cta_h2: string; services_page_cta_sub: string
  notfound_h1: string; notfound_sub: string; notfound_btn: string
  err_required: string; err_email: string
}

const SERVICES_FR: ServiceItem[] = [
  {
    emoji: '🌐',
    slug: 'solutions-web-mobile',
    title: 'Solutions Web & Mobile sur Mesure',
    tagline: 'Conception et développement adaptés à vos besoins',
    desc: "Conception et développement de solutions adaptées à vos besoins au quotidien, intégrant la gestion des moyens de paiement.",
    features: [
      "Logiciels de gestion d'entreprise",
      'Gestion des moyens de paiement',
      'Création de sites web',
      'Maintenance & évolution',
    ],
  },
  {
    emoji: '📈',
    slug: 'accompagnement',
    title: 'Accompagnement',
    tagline: 'Structuration et croissance de votre activité',
    desc: "Nous accompagnons votre entreprise dans sa structuration financière et l'exploitation de vos données pour maximiser vos performances.",
    features: [
      'Structuration financière',
      'Structuration comptable',
      'Structuration juridique',
      'Modélisation financière',
      "Interprétation des données",
      'Détection des pertes et opportunités',
    ],
  },
  {
    emoji: '🎯',
    slug: 'strategie-product',
    title: 'Stratégie & Product',
    tagline: 'Cadrage, exécution et business development',
    desc: "Une approche pragmatique pour valider vos modèles, piloter le déploiement opérationnel de vos outils et accélérer votre pénétration sur le marché.",
    features: [
      'Alignement des processus métiers',
      'Cadrage produit et roadmap opérationnelle',
      'Développement des opportunités business',
      'Optimisation de la chaîne de valeur',
    ],
  },
  {
    emoji: '🖨️',
    slug: 'les-indispensables',
    title: 'Les Indispensables',
    tagline: "Équipements essentiels pour votre écosystème digital",
    desc: "Commercialisation d'équipements et d'outils utiles pour les opérations courantes de votre écosystème digital.",
    features: [
      'Imprimante thermique rechargeable',
      'POS',
    ],
  },
]

const SERVICES_EN: ServiceItem[] = [
  {
    emoji: '🌐',
    slug: 'solutions-web-mobile',
    title: 'Tailored Web & Mobile Solutions',
    tagline: 'Design and development adapted to your needs',
    desc: 'Design and development of solutions adapted to your daily needs, integrating payment method management.',
    features: [
      'Business management software',
      'Payment method management',
      'Website creation',
      'Maintenance & evolution',
    ],
  },
  {
    emoji: '📈',
    slug: 'accompagnement',
    title: 'Consulting & Growth',
    tagline: 'Structuring and business growth',
    desc: 'We support your business in its financial structuring and data exploitation to maximize your performance.',
    features: [
      'Financial structuring',
      'Accounting structuring',
      'Legal structuring',
      'Financial modeling',
      'Data interpretation',
      'Loss and opportunity detection',
    ],
  },
  {
    emoji: '🎯',
    slug: 'strategie-product',
    title: 'Strategy & Product',
    tagline: 'Scoping, execution and business development',
    desc: 'A pragmatic approach to validate models, drive operational tool deployment and accelerate market entry.',
    features: [
      'Business process alignment',
      'Product scoping and operational roadmap',
      'Business development opportunities',
      'Value chain optimization',
    ],
  },
  {
    emoji: '🖨️',
    slug: 'les-indispensables',
    title: 'The Essentials',
    tagline: 'Essential equipment for your digital ecosystem',
    desc: 'Commercialization of useful equipment and tools for the current operations of your digital ecosystem.',
    features: [
      'Rechargeable thermal printer',
      'POS',
    ],
  },
]

const fr: T = {
  nav: { home: 'Accueil', services: 'Services', about: 'À Propos', contact: 'Contact', cta: 'Démarrer un projet' },
  hero: {
    badge: 'BLOOMAR ONE · Yaoundé, Cameroun',
    headline1: 'Votre business,', headlineGradient: 'propulsé', headline2: ' par le digital',
    subtitle: "BLOOMAR ONE accompagne les entreprises dans leur structuration financière et leur transformation digitale — solutions sur mesure, pratiques et orientées résultats.",
    ctaPrimary: 'Démarrer un projet →', ctaSecondary: 'Voir nos services',
    stat1: '50+', stat1Label: 'Projets livrés',
    stat2: '100%', stat2Label: 'Clients satisfaits',
    stat3: '2026', stat3Label: 'Fondée à Yaoundé',
    scroll: 'Explorer', badge1: 'BLOOMAR ONE · Yaoundé', badge2: '50+ clients',
  },
  marquee: ['Solutions Web & Mobile', 'Accompagnement', 'Stratégie & Product', 'Les Indispensables', 'MoMo & Orange Money', 'Python · React · Node.js'],
  services: {
    label: 'NOS SERVICES', heading: 'Des solutions pour', headingGradient: ' chaque business',
    sub: "Finance, technologie, performance — nous bâtissons des outils qui font vraiment la différence pour votre entreprise.",
    learnMore: 'En savoir plus →', items: SERVICES_FR,
  },
  howItWorks: {
    label: 'NOTRE PROCESSUS', heading: 'Simple, rapide', headingGradient: ' et efficace',
    steps: [
      { num: '01', title: 'Parlez-nous de votre projet', desc: "Un appel découverte gratuit pour comprendre vos besoins, votre contexte et vos objectifs. Aucun engagement." },
      { num: '02', title: 'Nous construisons ensemble', desc: "Notre équipe conçoit et développe votre solution avec des points réguliers, en toute transparence." },
      { num: '03', title: 'Lancez et évoluez', desc: "Votre produit is livré et déployé. Nous restons disponibles pour la maintenance et l'évolution." },
    ],
  },
  reviews: {
    label: 'TÉMOIGNAGES', heading: 'Ce que disent', headingGradient: ' nos clients',
    empty: 'Soyez parmi les premiers à partager votre expérience',
    emptySub: 'Nous travaillons activement sur nos premiers projets. Vos retours seront précieux.',
    ctaLabel: 'Laisser un avis',
  },
  cta: {
    heading: 'Prêt à digitaliser', headingGradient: ' votre business ?',
    sub: 'Discutons de votre projet — consultation gratuite, sans engagement.',
    primary: 'Démarrer maintenant →', whatsapp: '💬 WhatsApp',
  },
  footer: {
    tagline: "Finance · Technologie · Performance — votre partenaire de croissance en Afrique.",
    nav: 'Navigation', servicesCol: 'Services', contactCol: 'Contact',
    copyright: '© 2026 BLOOMAR ONE. Tous droits réservés.',
    madeWith: '',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'À Propos', href: '/a-propos' },
      { label: 'Contact', href: '/contact' },
    ],
    servicesList: ['Solutions Web & Mobile', 'Accompagnement', 'Stratégie & Product', 'Les Indispensables'],
    email: 'contact@bloomarone.com',
    phone: '+237 652 209 175',
    address: "Derrière le Gymnase, à côté de l'Hôtel grand Président, Mobile Omnisport, Yaoundé",
  },
  form: {
    title: 'Démarrer un projet', name: 'Nom complet', email: 'Adresse e-mail',
    company: "Nom de l'entreprise", service: 'Service souhaité', message: 'Décrivez votre projet',
    submit: 'Envoyer la demande',
    success: 'Votre demande a bien été envoyée ! WhatsApp va s\'ouvrir pour confirmer.',
    close: 'Fermer',
    services: ['Solutions Web & Mobile sur Mesure', 'Accompagnement', 'Stratégie & Product', 'Les Indispensables', 'Autre'],
    namePlaceholder: 'Jean Dupont',
    emailPlaceholder: 'jean@monentreprise.com',
    companyPlaceholder: 'Mon Entreprise SARL',
    messagePlaceholder: 'Décrivez votre projet, vos besoins et vos objectifs...',
  },
  contact: {
    label: 'CONTACTEZ-NOUS', heading: 'Parlons de', headingGradient: ' votre projet',
    sub: "Que vous ayez une idée précise ou un simple besoin de cadrage, notre équipe est là pour vous guider.",
    formTitle: 'Envoyez-nous un message', mapTitle: 'Nous trouver',
    addressLabel: 'Adresse', phoneLabel: 'WhatsApp', emailLabel: 'E-mail', hoursLabel: 'Disponibilité',
    hours: 'Lun–vendredi  · 9h–18h',
    contact_coords: 'NOS COORDONNÉES',
    contact_phone: '+237 652 209 175',
    contact_email: 'contact@bloomarone.com',
    contact_address: "Derrière le Gymnase, à côté de l'Hôtel grand Président, Mobile Omnisport, Yaoundé, Cameroun",
    contact_wa: 'Discuter sur WhatsApp',
    contact_select: 'Choisir un service',
    contact_submit: 'Envoyer le message →',
    contact_success: "Message envoyé ! WhatsApp va s'ouvrir pour confirmer.",
  },
  about: {
    label: 'À PROPOS', heading: 'Nous croyons en un digital africain', headingGradient: ' souverain',
    sub: "BLOOMAR ONE est née d'une conviction : l'Afrique mérite des outils digitaux pensés pour elle.",
    storyLabel: 'NOTRE HISTOIRE', storyHeading: "Nés à Yaoundé, pensés pour l'Afrique",
    storyText1: "BLOOMAR ONE est née à Yaoundé en 2026, portée par une équipe de développeurs et designers camerounais qui en avaient assez de voir les entrepreneurs locaux se battre avec des outils inadaptés, trop chers, ou simplement inaccessibles.",
    storyText2: "Notre mission : démocratiser le digital en Afrique. Nous construisons des sites web qui convertissent, des applications qui fonctionnent même sans connexion, et des logiciels qui parlent le langage du terrain .",
    valuesLabel: 'NOS VALEURS', valuesHeading: 'Ce qui nous guide chaque jour',
    values: [
      { icon: '🌱', title: 'Innovation Locale', desc: "Des solutions adaptées aux réalités africaines, pas des copies de l'Occident." },
      { icon: '🔒', title: 'Fiabilité', desc: 'Nos produits sont testés pour fonctionner dans des conditions réseau difficiles.' },
      { icon: '🤝', title: 'Proximité', desc: 'Joignables sur WhatsApp, disponible 24/24.' },
      { icon: '🚀', title: 'Excellence', desc: 'Chaque projet est livré avec soin, dans les délais.' },
    ],
    missionLabel: 'MISSION', missionHeading: 'Démocratiser le digital en Afrique',
    missionText: "Rendre les outils digitaux accessibles à tous les entrepreneurs africains, quelle que soit leur taille ou leur secteur.",
    visionHeading: 'Devenir le partenaire de référence',
    visionText: "Être le partenaire de référence en Afrique centrale, reconnue pour la qualité, la proximité et l'impact de ses solutions.",
    ctaHeading: 'Travaillons ensemble',
    ctaSub: 'Votre projet mérite une équipe qui comprend vos réalités.',
    ctaBtn: 'Démarrer un projet →',
    about_team_h2: 'Les visages derrière Bloomar One',
  },
  pricing_label: 'TARIFS', pricing_h2: 'Simple et transparent',
  pricing_sub: 'Contactez-nous pour un devis personnalisé adapté à vos besoins.',
  pricing_popular: 'Populaire',
  pricing_starter: 'Starter', pricing_pro: 'Pro', pricing_enterprise: 'Entreprise',
  pricing_free: 'Sur devis', pricing_pro_price: 'Sur devis', pricing_enterprise_price: 'Sur devis',
  pricing_month: '',
  pricing_cta_starter: 'Demander un devis', pricing_cta_pro: 'Demander un devis', pricing_cta_enterprise: 'Nous contacter',
  services_page_label: 'NOS SERVICES',
  services_page_h1a: 'Finance · Technologie ·', services_page_h1b: 'Performance',
  services_page_sub: "BLOOMAR ONE accompagne les entreprises dans leur structuration financière et leur transformation digitale grâce à des solutions sur mesure, pratiques et orientées résultats.",
  services_page_cta_h2: 'Un projet en tête ?',
  services_page_cta_sub: 'Discutons de vos besoins et trouvons la solution adaptée.',
  notfound_h1: 'Page introuvable', notfound_sub: "Cette page n'existe pas.", notfound_btn: "Retour à l'accueil",
  err_required: 'Ce champ est requis', err_email: 'Email invalide',
}

const en: T = {
  nav: { home: 'Home', services: 'Services', about: 'About', contact: 'Contact', cta: 'Start a project' },
  hero: {
    badge: 'BLOOMAR ONE · Yaoundé, Cameroon',
    headline1: 'Your business,', headlineGradient: 'powered', headline2: ' by digital',
    subtitle: "BLOOMAR ONE supports companies in their financial structuring and digital transformation through tailored, practical, results-oriented solutions.",
    ctaPrimary: 'Start a project →', ctaSecondary: 'Our services',
    stat1: '50+', stat1Label: 'Projects delivered',
    stat2: '100%', stat2Label: 'Client satisfaction',
    stat3: '2026', stat3Label: 'Founded in Yaoundé',
    scroll: 'Explore', badge1: 'BLOOMAR ONE · Yaoundé', badge2: '50+ clients',
  },
  marquee: ['Web & Mobile Solutions', 'Consulting & Growth', 'Strategy & Product', 'The Essentials', 'MoMo & Orange Money', 'Python · React · Node.js'],
  services: {
    label: 'OUR SERVICES', heading: 'Solutions for', headingGradient: ' every business',
    sub: "Finance, technology, performance — we build tools that make a real difference for your company.",
    learnMore: 'Learn more →', items: SERVICES_EN,
  },
  howItWorks: {
    label: 'OUR PROCESS', heading: 'Simple, fast', headingGradient: ' and effective',
    steps: [
      { num: '01', title: 'Tell us about your project', desc: "A free discovery call to understand your needs, context and goals. No commitment." },
      { num: '02', title: 'We build together', desc: "Our team designs and develops your solution with regular check-ins, fully transparent." },
      { num: '03', title: 'Launch and grow', desc: "Your product is delivered and deployed." },
    ],
  },
  reviews: {
    label: 'TESTIMONIALS', heading: 'What our', headingGradient: ' clients say',
    empty: 'Be among the first to share your experience',
    emptySub: 'We are actively working on our first projects. Your feedback will be invaluable.',
    ctaLabel: 'Leave a review',
  },
  cta: {
    heading: 'Ready to digitize', headingGradient: ' your business?',
    sub: "Let's discuss your project — free consultation, no commitment.",
    primary: 'Get started →', whatsapp: '💬 WhatsApp',
  },
  footer: {
    tagline: "Finance · Technology · Performance — your growth partner in Africa.",
    nav: 'Navigation', servicesCol: 'Services', contactCol: 'Contact',
    copyright: '© 2026 BLOOMAR ONE. All rights reserved.',
    madeWith: '',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/a-propos' },
      { label: 'Contact', href: '/contact' },
    ],
    servicesList: ['Web & Mobile Solutions', 'Consulting & Growth', 'Strategy & Product', 'The Essentials'],
    email: 'contact@bloomarone.com',
    phone: '+237 652 209 175',
    address: "Behind the Gymnasium, next to Hôtel Président, Mobile Omnisport, Yaoundé",
  },
  form: {
    title: 'Start a project', name: 'Full name', email: 'Email address',
    company: 'Company name', service: 'Desired service', message: 'Describe your project',
    submit: 'Send request',
    success: 'Your request has been sent! WhatsApp will open to confirm.',
    close: 'Close',
    services: ['Web & Mobile Solutions', 'Consulting & Growth', 'Strategy & Product', 'The Essentials', 'Other'],
    namePlaceholder: 'John Doe',
    emailPlaceholder: 'john@mycompany.com',
    companyPlaceholder: 'My Company Ltd',
    messagePlaceholder: 'Describe your project, needs and goals...',
  },
  contact: {
    label: 'CONTACT US', heading: "Let's talk about", headingGradient: ' your project',
    sub: "Whether you have a precise idea or just need product scoping, our team is here to guide you.",
    formTitle: 'Send us a message', mapTitle: 'Find us',
    addressLabel: 'Address', phoneLabel: 'WhatsApp', emailLabel: 'Email', hoursLabel: 'Availability',
    hours: 'Mon–Fri · 9am–6pm',
    contact_coords: 'OUR DETAILS',
    contact_phone: '+237 652 209 175',
    contact_email: 'contact@bloomarone.com',
    contact_address: "Behind the Gymnasium, next to Hôtel Président, Mobile Omnisport, Yaoundé, Cameroon",
    contact_wa: 'Chat on WhatsApp',
    contact_select: 'Choose a service',
    contact_submit: 'Send message →',
    contact_success: 'Message sent! WhatsApp will open to confirm.',
  },
  about: {
    label: 'ABOUT', heading: 'We believe in a sovereign', headingGradient: ' African digital',
    sub: "BLOOMAR ONE was born from a conviction: Africa deserves digital tools built for it.",
    storyLabel: 'OUR STORY', storyHeading: 'Born in Yaoundé, built for Africa',
    storyText1: "BLOOMAR ONE was born in Yaoundé in 2026, driven by a team of Cameroonian developers and designers tired of seeing local entrepreneurs struggle with inadequate, overpriced, or inaccessible tools.",
    storyText2: "Our mission: democratize digital in Africa. We build websites that convert, apps that work offline, and software that speaks the local language.",
    valuesLabel: 'OUR VALUES', valuesHeading: 'What guides us every day',
    values: [
      { icon: '🌱', title: 'Local Innovation', desc: "Solutions adapted to African realities, not copies of the West." },
      { icon: '🔒', title: 'Reliability', desc: 'Our products are tested to work in difficult network conditions.' },
      { icon: '🤝', title: 'Proximity', desc: 'Reachable on WhatsApp, available 24/7.' },
      { icon: '🚀', title: 'Excellence', desc: 'Every project delivered with care, on time.' },
    ],
    missionLabel: 'MISSION', missionHeading: 'Democratize digital in Africa',
    missionText: "Make digital tools accessible to all African entrepreneurs, regardless of their size or sector.",
    visionHeading: 'Become the reference partner',
    visionText: "Be the leading agency in Central Africa, recognized for quality, proximity and impact.",
    ctaHeading: "Let's work together",
    ctaSub: 'Your project deserves a team that understands your reality.',
    ctaBtn: 'Start a project →',
    about_team_h2: 'The faces behind Bloomar One',
  },
  pricing_label: 'PRICING', pricing_h2: 'Simple and transparent',
  pricing_sub: 'Contact us for a personalized quote tailored to your needs.',
  pricing_popular: 'Popular',
  pricing_starter: 'Starter', pricing_pro: 'Pro', pricing_enterprise: 'Enterprise',
  pricing_free: 'On request', pricing_pro_price: 'On request', pricing_enterprise_price: 'On request',
  pricing_month: '',
  pricing_cta_starter: 'Request a quote', pricing_cta_pro: 'Request a quote', pricing_cta_enterprise: 'Contact us',
  services_page_label: 'OUR SERVICES',
  services_page_h1a: 'Finance · Technology ·', services_page_h1b: 'Performance',
  services_page_sub: "BLOOMAR ONE supports companies in their financial structuring and digital transformation through tailored, practical, results-oriented solutions.",
  services_page_cta_h2: 'Have a project in mind?',
  services_page_cta_sub: "Let's discuss your needs and find the right solution.",
  notfound_h1: 'Page not found', notfound_sub: "This page doesn't exist.", notfound_btn: 'Back to home',
  err_required: 'This field is required', err_email: 'Invalid email',
}

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: T }
const LanguageContext = createContext<Ctx>({ lang: 'fr', setLang: () => {}, t: fr })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: lang === 'fr' ? fr : en }}>
      <LanguageContext.Provider value={{ lang, setLang, t: lang === 'fr' ? fr : en }}>
        {children}
      </LanguageContext.Provider>
    </LanguageContext.Provider>
  )
}

export function useLanguage() { return useContext(LanguageContext) }