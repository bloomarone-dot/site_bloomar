import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/pages/home/components/Navbar'
import Footer from '@/pages/home/components/Footer'
import ProjectModal from '@/pages/home/components/ProjectModal'
import { useLanguage } from '@/context/LanguageContext'
import PricingCard from '@/components/PricingCard'
import FAQ from '@/pages/home/components/FAQ'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

const SERVICES_DETAIL = [
  {
    n: '01', emoji: '🌐', slug: 'solutions-web-mobile',
    title: 'Solutions Web & Mobile sur Mesure',
    sub: 'Conception et développement adaptés à vos besoins',
    desc: "Conception et développement de solutions adaptées à vos besoins au quotidien, intégrant la gestion des moyens de paiement.",
    items: ["Logiciels de gestion d'entreprise", 'Gestion des moyens de paiement', 'Applications web et mobile', 'Création de sites web', 'Maintenance & évolution'],
    tags: ['React', 'Python', 'Node.js', 'Mobile', 'Web', 'MoMo'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  },
  {
    n: '02', emoji: '📈', slug: 'accompagnement',
    title: 'Accompagnement',
    sub: 'Structuration et croissance de votre activité',
    desc: "Nous accompagnons votre entreprise dans sa structuration financière et l'exploitation de vos données pour maximiser vos performances.",
    items: ['Structuration financière', 'Structuration comptable', 'Structuration juridique', 'Modélisation financière', "Interprétation des données", 'Détection des pertes et opportunités'],
    tags: ['Finance', 'Data', 'Python', 'Analyse', 'Stratégie'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    n: '03', emoji: '🔧', slug: 'sav',
    title: 'Service Après-Vente',
    sub: 'Assistance technique, formation et conseil',
    desc: "Une continuité de service simple, efficace et professionnelle : assistance technique, formation de vos équipes et recommandations pratiques.",
    items: ['Support en cas de panne ou dysfonctionnement', 'Mise en place des outils', 'Prise en main par vos équipes', 'Recommandations pratiques pour optimiser vos outils et process', 'Conseil stratégique'],
    tags: ['Support', 'Formation', 'Conseil', 'SAV'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
  },
  {
    n: '04', emoji: '🖨️', slug: 'les-indispensables',
    title: 'Les Indispensables',
    sub: "Équipements essentiels pour votre écosystème digital",
    desc: "Commercialisation d'équipements et d'outils utiles pour les opérations courantes de votre écosystème digital.",
    items: ['Imprimante thermique rechargeable', 'PIOS — outil de gestion essentiel'],
    tags: ['Imprimante', 'PIOS', 'Encaissement'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
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
      <main style={{ paddingTop: 'clamp(60px,8vw,80px)' }}>

        {/* HERO */}
        <section style={{ padding: 'clamp(40px,7vw,80px) clamp(16px,5vw,40px)', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 16 }}>
              NOS SERVICES
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontWeight: 800, lineHeight: 1.1, color: '#111827', marginBottom: 16 }}>
              Finance · Technologie ·{' '}
              <span className="text-grad">Performance</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 'clamp(0.875rem,1.5vw,1rem)', color: '#6B7280', maxWidth: 560, lineHeight: 1.7 }}>
              BLOOMAR ONE accompagne les entreprises dans leur structuration et leur transformation digitale grâce à des solutions sur mesure, pratiques et orientées résultats.
            </motion.p>
          </div>
        </section>

        {/* SERVICES */}
        <section style={{ padding: 'clamp(16px,3vw,40px) clamp(16px,5vw,40px)', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {SERVICES_DETAIL.map((s, i) => (
              <motion.div key={s.slug} {...fadeUp(0.05)} id={s.slug}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
                  gap: 'clamp(20px,4vw,40px)',
                  alignItems: 'start',
                  padding: 'clamp(32px,5vw,56px) 0',
                  borderBottom: '1px solid #F3F4F6',
                }}>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 'clamp(40px,5vw,52px)', height: 'clamp(40px,5vw,52px)',
                      borderRadius: 12, background: 'rgba(139,47,201,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 'clamp(1.4rem,3vw,1.8rem)', flexShrink: 0,
                    }}>
                      {s.emoji}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8B2FC9', background: 'rgba(139,47,201,0.08)', padding: '2px 8px', borderRadius: 999 }}>
                          {s.n}
                        </span>
                        <h3 style={{ fontSize: 'clamp(1rem,2.5vw,1.3rem)', fontWeight: 700, color: '#111827', margin: 0 }}>{s.title}</h3>
                      </div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>{s.sub}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 'clamp(0.8rem,1.4vw,0.9rem)', lineHeight: 1.7, color: '#6B7280', marginBottom: 16, maxWidth: 400 }}>{s.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    {s.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.7rem', fontWeight: 500, padding: '3px 10px', borderRadius: 999, background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#6B7280' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => setModalOpen(true)} className="btn-grad cursor-pointer"
                    style={{ fontSize: 'clamp(0.78rem,1.3vw,0.875rem)' }}>
                    Démarrer ce service →
                  </button>
                </div>

                {/* Checklist + Image */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Image */}
                  <div style={{ borderRadius: 16, overflow: 'hidden', height: 'clamp(160px,20vw,220px)' }}>
                    <img src={s.image} alt={s.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy" />
                  </div>
                  {/* Checklist */}
                  <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 16, padding: 'clamp(16px,2.5vw,24px)' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 14 }}>Inclus</p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {s.items.map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 'clamp(0.8rem,1.4vw,0.875rem)', color: '#374151' }}>
                          <i className="ri-check-line" style={{ color: '#8B2FC9', flexShrink: 0, marginTop: 2 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MODE D'INTERVENTION */}
        <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,5vw,40px)', background: '#F9FAFB' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 12 }}>NOTRE APPROCHE</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 800, color: '#111827' }}>Mode d&apos;intervention</h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 'clamp(16px,3vw,24px)' }}>
              {[
                { n: '1', title: 'Analyse', desc: 'Comprendre vos besoins et priorités.', icon: '🔍' },
                { n: '2', title: 'Conception', desc: 'Proposer une solution adaptée.', icon: '💡' },
                { n: '3', title: 'Déploiement', desc: 'Mettre en place rapidement les outils et services.', icon: '🚀' },
                { n: '4', title: 'Suivi', desc: "Assurer l'accompagnement, le SAV et l'optimisation.", icon: '📈' },
              ].map((step, i) => (
                <motion.div key={step.n} {...fadeUp(i * 0.1)}
                  style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 'clamp(20px,3vw,28px)', textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem', margin: '0 auto 12px' }}>
                    {step.n}
                  </div>
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 8 }}>{step.icon}</span>
                  <h3 style={{ fontWeight: 700, fontSize: 'clamp(0.9rem,1.8vw,1rem)', color: '#111827', marginBottom: 6 }}>{step.title}</h3>
                  <p style={{ fontSize: 'clamp(0.78rem,1.3vw,0.85rem)', color: '#6B7280', lineHeight: 1.6 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TARIFS */}
        <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,5vw,40px)', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 12 }}>TARIFS</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>Simple et transparent</h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Contactez-nous pour un devis personnalisé adapté à vos besoins.</p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 'clamp(16px,3vw,24px)', alignItems: 'start' }}>
              {pricing.map((p, i) => (
                <PricingCard key={p.name} {...p} delay={i * 0.1} onOpenModal={() => setModalOpen(true)} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ />

        {/* CTA */}
        <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,5vw,40px)', background: '#0D0F14' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <motion.div {...fadeUp()}>
              <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
                Un projet en tête ?
              </h2>
              <p style={{ fontSize: 'clamp(0.875rem,1.5vw,1rem)', color: '#9CA3AF', marginBottom: 32 }}>
                Discutons de vos besoins et trouvons la solution adaptée.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <button onClick={() => setModalOpen(true)} className="btn-grad cursor-pointer">
                  Démarrer un projet →
                </button>
                <a href="https://wa.me/237652209175" target="_blank" rel="noopener noreferrer"
                  className="btn-outline-white cursor-pointer">
                  💬 WhatsApp
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
