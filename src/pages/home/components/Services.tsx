import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

// Photos Unsplash libres de droits — contexte business africain
const SERVICE_PHOTOS = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', // finance/banking
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', // data analytics
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', // coding
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80', // mobile payment
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', // website
]

interface Props { onOpenModal: () => void }

export default function Services({ onOpenModal }: Props) {
  const { t } = useLanguage()

  return (
    <section style={{ padding: 'clamp(48px,8vw,96px) clamp(16px,5vw,40px)', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header — centré */}
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
          <p style={{ fontSize: 'clamp(0.65rem,1.2vw,0.75rem)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 12 }}>
            {t.services.label}
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', fontWeight: 800, color: '#111827', lineHeight: 1.15, marginBottom: 12 }}>
            {t.services.heading}
            <span className="text-grad">{t.services.headingGradient}</span>
          </h2>
          <p style={{ fontSize: 'clamp(0.875rem,1.5vw,1rem)', color: '#6B7280', maxWidth: 520, margin: '0 auto' }}>
            {t.services.sub}
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px),1fr))', gap: 'clamp(12px,2vw,20px)' }}>
          {t.services.items.map((s, i) => (
            <motion.div key={s.slug} {...fadeUp(i * 0.07)}
              style={{
                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16,
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.3s, border-color 0.3s',
                cursor: 'pointer',
              }}
              whileHover={{ y: -6, borderColor: 'rgba(139,47,201,0.35)' }}>

              {/* Photo */}
              <div style={{ height: 'clamp(140px,18vw,180px)', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={SERVICE_PHOTOS[i] || SERVICE_PHOTOS[0]}
                  alt={s.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {/* Overlay gradient */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(139,47,201,0.25), transparent)',
                }} />
                {/* Emoji badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(255,255,255,0.92)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem',
                }}>
                  {s.emoji}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 'clamp(14px,2vw,20px)', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: 'clamp(0.9rem,1.6vw,1rem)', color: '#111827' }}>{s.title}</h3>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {s.tagline}
                </p>
                <p style={{ fontSize: 'clamp(0.78rem,1.3vw,0.85rem)', lineHeight: 1.65, color: '#6B7280', flex: 1 }}>
                  {s.desc}
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {s.features.slice(0, 3).map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(0.72rem,1.2vw,0.78rem)', color: '#6B7280' }}>
                      <i className="ri-check-line" style={{ color: '#8B2FC9', fontSize: '0.875rem', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/services#${s.slug}`}
                  style={{ fontSize: 'clamp(0.78rem,1.3vw,0.875rem)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {t.services.learnMore}
                  <i className="ri-arrow-right-line" style={{ fontSize: '0.875rem' }} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA centré */}
        <motion.div {...fadeUp(0.3)} style={{ marginTop: 'clamp(32px,5vw,48px)', textAlign: 'center' }}>
          <Link to="/services">
            <button className="btn-grad cursor-pointer">
              <i className="ri-grid-line" />
              Voir tous nos services
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
