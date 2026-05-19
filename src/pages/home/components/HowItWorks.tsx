import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

export default function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section style={{ padding: 'clamp(48px,8vw,96px) clamp(16px,5vw,40px)', background: '#F9FAFB' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header — centré */}
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
          <p style={{ fontSize: 'clamp(0.65rem,1.2vw,0.75rem)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 12 }}>
            {t.howItWorks.label}
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', fontWeight: 800, color: '#111827', lineHeight: 1.15 }}>
            {t.howItWorks.heading}
            <span className="text-grad">{t.howItWorks.headingGradient}</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,220px),1fr))', gap: 'clamp(24px,4vw,40px)', position: 'relative' }}>

          {/* Ligne connectrice desktop */}
          <div style={{
            display: 'none',
            position: 'absolute',
            top: 28, left: '16%', right: '16%', height: 1,
            background: 'linear-gradient(90deg,#8B2FC9,#1A9CB0)',
          }} className="md-connector" />

          {t.howItWorks.steps.map((s, i) => (
            <motion.div key={s.num} {...fadeUp(i * 0.12)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'clamp(12px,2vw,16px)', position: 'relative', zIndex: 1 }}>

              {/* Cercle numéroté */}
              <div style={{
                width: 'clamp(48px,6vw,60px)', height: 'clamp(48px,6vw,60px)',
                borderRadius: '50%', background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 'clamp(0.875rem,1.8vw,1.125rem)',
                flexShrink: 0,
              }}>
                {s.num}
              </div>

              <h3 style={{ fontWeight: 700, fontSize: 'clamp(0.95rem,1.8vw,1.125rem)', color: '#111827' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 'clamp(0.8rem,1.4vw,0.875rem)', lineHeight: 1.7, color: '#6B7280', maxWidth: 240 }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
