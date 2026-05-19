import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
})

interface Props { onOpenModal: () => void }

export default function Hero({ onOpenModal }: Props) {
  const { t } = useLanguage()

  const stats = [
    { val: t.hero.stat1, label: t.hero.stat1Label },
    { val: t.hero.stat2, label: t.hero.stat2Label },
    { val: t.hero.stat3, label: t.hero.stat3Label },
  ]

  return (
    <section style={{
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: '#fff',
      paddingTop: 'clamp(90px,12vw,120px)', 
      position: 'relative',
    }}>

      {/* Arrière-plan : Flous légers premium */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-5vw', right: '-5vw',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle,#8B2FC9,transparent)', opacity: 0.04,
        }} />
        <div style={{
          position: 'absolute', bottom: '-10vw', left: '-10vw',
          width: '35vw', height: '35vw', borderRadius: '50%',
          background: 'radial-gradient(circle,#1A9CB0,transparent)', opacity: 0.04,
        }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(24px,4vw,64px) clamp(16px,5vw,40px)',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,460px),1fr))',
        gap: 'clamp(40px,6vw,64px)', 
        alignItems: 'center',
      }}>

        {/* GAUCHE — Contenu textuel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px,2.5vw,24px)' }}>
          
          {/* Badge de statut */}
          <motion.div {...fadeUp(0)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start',
          }}>
            <div style={{ position: 'relative', width: 10, height: 10 }}>
              <span className="ping" style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)', opacity: 0.6,
              }} />
              <span style={{
                position: 'relative', display: 'block', width: 10, height: 10,
                borderRadius: '50%', background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)',
              }} />
            </div>
            <span style={{
              fontSize: 'clamp(0.65rem,1.1vw,0.75rem)', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4B5563',
            }}>
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Titre Principal H1 */}
          <motion.h1 {...fadeUp(0.1)} style={{
            fontSize: 'clamp(2.2rem,4.5vw,3.6rem)',
            fontWeight: 800, lineHeight: 1.15, color: '#111827', margin: 0,
            letterSpacing: '-0.02em',
          }}>
            {t.hero.headline1}<br />
            <span className="text-grad">{t.hero.headlineGradient}</span>
            {t.hero.headline2}
          </motion.h1>

          {/* Descriptif */}
          <motion.p {...fadeUp(0.2)} style={{
            fontSize: 'clamp(0.9rem,1.5vw,1.05rem)',
            lineHeight: 1.7, color: '#4B5563', maxWidth: '50ch', margin: 0,
          }}>
            {t.hero.subtitle}
          </motion.p>

          {/* Actions */}
          <motion.div {...fadeUp(0.3)} style={{
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px,1.5vw,16px)',
          }}>
            <button onClick={onOpenModal} className="btn-grad cursor-pointer"
              style={{ fontSize: 'clamp(0.8rem,1.4vw,0.9rem)', padding: '12px 28px', borderRadius: 10 }}>
              {t.hero.ctaPrimary}
            </button>
            <a href="/services" className="btn-outline cursor-pointer"
              style={{ fontSize: 'clamp(0.8rem,1.4vw,0.9rem)', padding: '12px 28px', borderRadius: 10 }}>
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          {/* Statistiques clés */}
          <motion.div {...fadeUp(0.4)} style={{
            display: 'flex', flexWrap: 'wrap',
            gap: 'clamp(24px,5vw,48px)', paddingTop: 12,
            borderTop: '1px solid #F3F4F6', marginTop: 8
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="text-grad" style={{
                  fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800,
                }}>
                  {s.val}
                </span>
                <span style={{
                  fontSize: 'clamp(0.7rem,1.2vw,0.8rem)', fontWeight: 500, color: '#6B7280',
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* DROITE — VISUEL DASHBOARD MODERN COPIÉ SUR LES STANDARDS DE GENUKA */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
          
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              position: 'relative',
              width: '100%',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 20,
              padding: '16px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
          >
            {/* Barre supérieure style Mac/Navigateur comme Genuka */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, borderBottom: '1px solid #E5E7EB', paddingBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
              <div style={{ marginLeft: 12, background: '#E5E7EB', padding: '2px 16px', borderRadius: 6, fontSize: '0.65rem', color: '#6B7280', fontFamily: 'monospace' }}>
                bloomar.one/dashboard/analytics
              </div>
            </div>

            {/* Faux Graphiques & Éléments Data UI Ultra Pro */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, border: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 600 }}>Chiffre d&apos;Affaires</span>
                <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>4,250,000 F</p>
                <span style={{ fontSize: '0.6rem', color: '#10B981', fontWeight: 700 }}>+12.4% ce mois</span>
              </div>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, border: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 600 }}>Commandes POS</span>
                <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>1,120</p>
                <span style={{ fontSize: '0.6rem', color: '#8B2FC9', fontWeight: 700 }}>98.2% complété</span>
              </div>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, border: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 600 }}>Ruptures Évitées</span>
                <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>24 Alertes</p>
                <span style={{ fontSize: '0.6rem', color: '#1A9CB0', fontWeight: 700 }}>Stock optimisé</span>
              </div>
            </div>

            {/* Section Graphique Principal Linéaire Épuré */}
            <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #F3F4F6', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>Performance de Croissance</span>
                <div style={{ display: 'flex', gap: 8, fontSize: '0.65rem', fontWeight: 600 }}>
                  <span style={{ color: '#8B2FC9' }}>● Ventes</span>
                  <span style={{ color: '#1A9CB0' }}>● Prévisions</span>
                </div>
              </div>
              {/* Simulation de courbes vectorielles minimalistes en CSS pur */}
              <div style={{ width: '100%', height: 100, position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '6%' }}>
                {[35, 45, 30, 60, 75, 50, 90, 65, 85, 70, 95, 100].map((h, idx) => (
                  <div key={idx} style={{ width: '100%', position: 'relative', height: `${h}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
                    <div style={{ width: '100%', height: '70%', background: 'linear-gradient(to top, rgba(139,47,201,0.2), #8B2FC9)', borderRadius: '2px 2px 0 0' }} />
                    <div style={{ width: '100%', height: '30%', background: '#1A9CB0', borderRadius: '2px 2px 0 0', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Badge de confiance de proximité superposé */}
          <motion.div className="float-slow"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              position: 'absolute',
              bottom: -20,
              right: 20,
              background: '#111827',
              borderRadius: 12,
              padding: '12px 20px',
              color: '#fff',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <i className="ri-flashlight-line" style={{ color: '#1A9CB0', fontSize: '1.2rem' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Multi-boutiques synchronisées en direct</span>
          </motion.div>
        </div>

      </div>
    </section>
  )
}