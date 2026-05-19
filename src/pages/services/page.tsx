import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/pages/home/components/Navbar'
import Footer from '@/pages/home/components/Footer'
import ProjectModal from '@/pages/home/components/ProjectModal'
import { useLanguage } from '@/context/LanguageContext'
import PricingCard from '@/components/PricingCard'
import FAQ from '@/pages/home/components/FAQ'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
})

const SERVICES_DETAIL = [
  {
    n: '01', iconClass: 'ri-global-line', slug: 'solutions-web-mobile',
    title: 'Solutions Web & Mobile sur Mesure',
    sub: 'Conception et développement adaptés à vos besoins',
    desc: "Conception et développement de solutions adaptées à vos besoins au quotidien, intégrant la gestion des moyens de paiement.",
    items: ["Logiciels de gestion d'entreprise", 'Gestion des moyens de paiement', 'Applications web et mobile', 'Création de sites web', 'Maintenance & évolution'],
    tags: ['React', 'Python', 'Node.js', 'Mobile', 'Web', 'MoMo'],
  },
  {
    n: '02', iconClass: 'ri-line-chart-line', slug: 'accompagnement',
    title: 'Accompagnement Stratégique',
    sub: 'Structuration et croissance de votre activité',
    desc: "Nous accompagnons votre entreprise dans sa structuration financière et l'exploitation de vos données pour maximiser vos performances.",
    items: ['Structuration financière', 'Structuration comptable', 'Structuration juridique', 'Modélisation financière', "Interprétation des données", 'Détection des pertes et opportunités'],
    tags: ['Finance', 'Data', 'Python', 'Analyse', 'Stratégie'],
  },
  {
    n: '03', iconClass: 'ri-customer-service-2-line', slug: 'sav',
    title: 'Service Après-Vente & Suivi',
    sub: 'Assistance technique, formation et conseil',
    desc: "Une continuité de service simple, efficace et professionnelle : assistance technique, formation de vos équipes et recommandations pratiques.",
    items: ['Support en cas de panne ou dysfonctionnement', 'Mise en place des outils', 'Prise en main par vos équipes', 'Recommandations pratiques pour optimiser vos outils et process', 'Conseil stratégique'],
    tags: ['Support', 'Formation', 'Conseil', 'SAV'],
  },
  {
    n: '04', iconClass: 'ri-printer-line', slug: 'les-indispensables',
    title: 'Les Indispensables Digitaux',
    sub: "Équipements essentiels pour votre écosystème",
    desc: "Commercialisation d'équipements et d'outils utiles pour les opérations courantes de votre écosystème digital.",
    items: ['Imprimante thermique rechargeable', 'POS — outil de gestion essentiel'],
    tags: ['Imprimante', 'POS', 'Encaissement'],
  },
]

const pricing = [
  {
    name: 'Starter', price: 'Sur devis', period: '',
    features: ['Consultation initiale gratuite', 'Audit de vos besoins', 'Devis personnalisé', 'Support email'],
    cta: 'Demander un devis', featured: false,
  },
  {
    name: 'Pro', price: 'Sur devis', period: '',
    features: ['Tout du Starter', 'Accompagnement mensuel', 'Solution sur mesure incluse', 'Support WhatsApp prioritaire', 'Rapports mensuels'],
    cta: 'Demander un devis', featured: true,
  },
  {
    name: 'Entreprise', price: 'Sur devis', period: '',
    features: ['Tout du Pro', 'Équipe dédiée', 'Solutions illimitées', 'SLA garanti', 'Onboarding complet'],
    cta: 'Nous contacter', featured: false,
  },
]

export default function ServicesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <Navbar onOpenModal={() => setModalOpen(true)} />
      
      <main style={{ background: '#fff', paddingTop: 'clamp(90px,12vw,120px)' }}>

        {/* HERO SECTION ÉPURÉE */}
        <section style={{ padding: 'clamp(60px,10vw,100px) clamp(16px,5vw,40px)', background: 'radial-gradient(circle at top right, rgba(139,47,201,0.03), transparent 40%)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 16 }}>
              EXPERTISES & IMPACT
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 'clamp(2.2rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.15, color: '#111827', marginBottom: 24, letterSpacing: '-0.02em' }}>
              Finance · Technologie · <span className="text-grad">Performance</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: '#4B5563', maxWidth: 700, margin: '0 auto', lineHeight: 1.75 }}>
              BLOOMAR ONE accompagne les entreprises dans leur structuration et leur transformation digitale grâce à des solutions sur mesure, pratiques et orientées résultats.
            </motion.p>
          </div>
        </section>

        {/* SERVICES SECTION - SANS IMAGES, STYLE CARTES ASYMÉTRIQUES */}
        <section style={{ padding: '0 clamp(16px,5vw,40px) clamp(60px,10vw,120px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
            {SERVICES_DETAIL.map((s, i) => (
              <motion.div key={s.slug} {...fadeUp(0.05)} id={s.slug}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
                  gap: 'clamp(32px,6vw,64px)',
                  alignItems: 'center',
                  padding: 'clamp(40px,6vw,64px)',
                  background: i % 2 === 0 ? '#F9FAFB' : '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 24,
                  boxShadow: i % 2 === 0 ? 'none' : '0 10px 30px rgba(0,0,0,0.02)',
                }}>

                {/* Bloc Principal d'Information */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <div style={{
                      width: 56, height: 56,
                      borderRadius: 16, 
                      background: 'linear-gradient(135deg, rgba(139,47,201,0.1), rgba(26,156,176,0.05))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', color: '#8B2FC9', flexShrink: 0,
                    }}>
                      <i className={s.iconClass} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1A9CB0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        SERVICE {s.n}
                      </span>
                      <h3 style={{ fontSize: 'clamp(1.25rem,2.5vw,1.6rem)', fontWeight: 800, color: '#111827', margin: '2px 0 0' }}>
                        {s.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#8B2FC9', marginBottom: 12 }}>{s.sub}</p>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#4B5563', marginBottom: 24 }}>{s.desc}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {s.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.7rem', fontWeight: 600, padding: '4px 12px', borderRadius: 8, background: '#fff', border: '1px solid #E5E7EB', color: '#4B5563' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button onClick={() => setModalOpen(true)} className="btn-grad cursor-pointer"
                    style={{ padding: '12px 24px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600 }}>
                    Démarrer ce service →
                  </button>
                </div>

                {/* Bloc Liste d'Inclusions Premium (Remplace l'image) */}
                <div style={{ 
                  background: i % 2 === 0 ? '#fff' : '#F9FAFB', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: 20, 
                  padding: 'clamp(24px,4vw,36px)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
                }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A9CB0', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A9CB0' }} /> Périmètre d&apos;intervention
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, padding: 0, margin: 0 }}>
                    {s.items.map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.925rem', color: '#374151', lineHeight: 1.4 }}>
                        <i className="ri-checkbox-circle-fill" style={{ color: '#8B2FC9', fontSize: '1.1rem', marginTop: 1, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION ETAPES / PROGRES DISCRÈTE */}
        <section style={{ padding: 'clamp(60px,10vw,100px) clamp(16px,5vw,40px)', background: '#F9FAFB', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'clamp(40px,8vw,64px)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 12 }}>NOTRE PROCESSUS</p>
              <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Une méthodologie claire et transparente</h2>
            </motion.div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 32 }}>
              {[
                { n: '1', title: 'Analyse terrain', desc: 'Comprendre précisément vos réalités de gestion, vos besoins et vos priorités opérationnelles.', icon: 'ri-search-eye-line' },
                { n: '2', title: 'Conception agile', desc: 'Définir et structurer une solution technologique ou financière parfaitement adaptée.', icon: 'ri-magic-line' },
                { n: '3', title: 'Déploiement direct', desc: 'Mettre en place rapidement les outils sur vos points d&apos;activité sans perturber le quotidien.', icon: 'ri-rocket-2-line' },
                { n: '4', title: 'Suivi & SAV continu', desc: "Assurer un accompagnement de proximité, la formation des équipes et l&apos;optimisation des résultats.", icon: 'ri-heart-pulse-line' },
              ].map((step, i) => (
                <motion.div key={step.n} {...fadeUp(i * 0.1)}
                  style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 20, padding: 32, position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ 
                    position: 'absolute', top: -16, left: 32,
                    width: 36, height: 36, borderRadius: 10, 
                    background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 800, color: '#fff', fontSize: '0.85rem' 
                  }}>
                    {step.n}
                  </div>
                  <i className={step.icon} style={{ fontSize: '2rem', display: 'block', marginBottom: 16, marginTop: 8, background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                  <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GRILLE DE TARIFS MODERNE */}
        <section style={{ padding: 'clamp(60px,10vw,100px) clamp(16px,5vw,40px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'clamp(40px,8vw,64px)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 12 }}>TARIFS</p>
              <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: '#111827', marginBottom: 12, letterSpacing: '-0.02em' }}>Des formules adaptées à votre échelle</h2>
              <p style={{ fontSize: '1rem', color: '#4B5563' }}>Contactez-nous pour obtenir une estimation budgétaire claire et sur mesure.</p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 32, alignItems: 'start' }}>
              {pricing.map((p, i) => (
                <PricingCard key={p.name} {...p} delay={i * 0.1} onOpenModal={() => setModalOpen(true)} />
              ))}
            </div>
          </div>
        </section>

        {/* ACCORDIONS FAQ */}
        <FAQ />

        {/* APPEL À L'ACTION LUMINEUX ET PROFESSIONNEL */}
        <section style={{ padding: 'clamp(60px,10vw,100px) clamp(16px,5vw,40px)', background: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <motion.div {...fadeUp()}>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, color: '#111827', marginBottom: 16, letterSpacing: '-0.02em' }}>
                Prêt à structurer et accélérer votre activité ?
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#4B5563', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
                Discutons de vos besoins spécifiques lors d&apos;un premier échange sans engagement.
              </p>
              <div style={{ //  La version corrigée :
display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16}}>
                <button onClick={() => setModalOpen(true)} className="btn-grad cursor-pointer" style={{ padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem' }}>
                  Démarrer un projet →
                </button>
                <a href="https://wa.me/237652209175" target="_blank" rel="noopener noreferrer"
                  className="cursor-pointer"
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px', 
                    borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', border: '1px solid #D1D5DB', 
                    background: '#fff', color: '#374151', textDecoration: 'none' 
                  }}>
                  <i className="ri-whatsapp-line" style={{ color: '#25D366', fontSize: '1.25rem' }} />
                  Échanger sur WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}