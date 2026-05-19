import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

const GRADIENTS = [
  'linear-gradient(135deg, #8B2FC9 0%, #6B3FC0 100%)',
  'linear-gradient(135deg, #1A9CB0 0%, #0E7A8C 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  'linear-gradient(135deg, #10B981 0%, #059669 100%)',
]

const BG_LIGHTS = [
  'rgba(139,47,201,0.06)',
  'rgba(26,156,176,0.06)',
  'rgba(245,158,11,0.06)',
  'rgba(16,185,129,0.06)',
]

interface Props { onOpenModal: () => void }

export default function Services({ onOpenModal }: Props) {
  const { t } = useLanguage()

  return (
    <section style={{
      padding: 'clamp(48px,8vw,96px) clamp(16px,5vw,40px)',
      background: '#F9FAFB',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
          <p style={{
            fontSize: 'clamp(0.65rem,1.2vw,0.75rem)', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#8B2FC9', marginBottom: 12,
          }}>
            {t.services.label}
          </p>
          <h2 style={{
            fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', fontWeight: 800,
            color: '#111827', lineHeight: 1.15, marginBottom: 12,
          }}>
            {t.services.heading}
            <span className="text-grad">{t.services.headingGradient}</span>
          </h2>
          <p style={{
            fontSize: 'clamp(0.875rem,1.5vw,1rem)',
            color: '#6B7280', maxWidth: 520, margin: '0 auto',
          }}>
            {t.services.sub}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,260px),1fr))',
          gap: 'clamp(12px,2vw,20px)',
        }}>
          {t.services.items.map((s, i) => (
            <motion.div key={s.slug} {...fadeUp(i * 0.08)}
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 20,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                cursor: 'pointer',
              }}
              whileHover={{
                y: -6,
                boxShadow: '0 20px 40px rgba(139,47,201,0.12)',
                borderColor: 'rgba(139,47,201,0.3)',
              }}>

              {/* Top Banner avec emoji — remplace la photo */}
              <div style={{
                height: 'clamp(100px,14vw,130px)',
                background: BG_LIGHTS[i % BG_LIGHTS.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Cercles décoratifs */}
                <div style={{
                  position: 'absolute', width: 120, height: 120,
                  borderRadius: '50%', top: -30, right: -30,
                  background: GRADIENTS[i % GRADIENTS.length],
                  opacity: 0.08,
                }} />
                <div style={{
                  position: 'absolute', width: 80, height: 80,
                  borderRadius: '50%', bottom: -20, left: -20,
                  background: GRADIENTS[i % GRADIENTS.length],
                  opacity: 0.08,
                }} />

                {/* Numéro en fond */}
                <span style={{
                  position: 'absolute', right: 16, bottom: 8,
                  fontSize: '4rem', fontWeight: 900,
                  color: 'transparent',
                  WebkitTextStroke: `1px ${i === 0 ? '#8B2FC9' : i === 1 ? '#1A9CB0' : i === 2 ? '#F59E0B' : '#10B981'}`,
                  opacity: 0.12,
                  lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Emoji principal */}
                <div style={{
                  width: 72, height: 72,
                  borderRadius: 18,
                  background: GRADIENTS[i % GRADIENTS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  position: 'relative', zIndex: 1,
                }}>
                  {s.emoji}
                </div>
              </div>

              {/* Contenu */}
              <div style={{
                padding: 'clamp(16px,2vw,22px)',
                display: 'flex', flexDirection: 'column',
                gap: 10, flex: 1,
              }}>

                {/* Titre */}
                <h3 style={{
                  fontWeight: 700,
                  fontSize: 'clamp(0.9rem,1.6vw,1rem)',
                  color: '#111827', margin: 0,
                }}>
                  {s.title}
                </h3>

                {/* Tagline */}
                <p style={{
                  fontSize: '0.72rem', fontWeight: 600, margin: 0,
                  background: GRADIENTS[i % GRADIENTS.length],
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {s.tagline}
                </p>

                {/* Description */}
                <p style={{
                  fontSize: 'clamp(0.78rem,1.3vw,0.85rem)',
                  lineHeight: 1.65, color: '#6B7280',
                  flex: 1, margin: 0,
                }}>
                  {s.desc}
                </p>

                {/* Séparateur */}
                <div style={{
                  height: 1,
                  background: 'linear-gradient(90deg, #E5E7EB, transparent)',
                  margin: '4px 0',
                }} />

                {/* Features */}
                <ul style={{
                  display: 'flex', flexDirection: 'column',
                  gap: 6, margin: 0, padding: 0, listStyle: 'none',
                }}>
                  {s.features.slice(0, 3).map((f, fi) => (
                    <li key={fi} style={{
                      display: 'flex', alignItems: 'center',
                      gap: 8, fontSize: 'clamp(0.72rem,1.2vw,0.78rem)',
                      color: '#374151',
                    }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: BG_LIGHTS[i % BG_LIGHTS.length],
                        border: `1px solid ${i === 0 ? '#8B2FC9' : i === 1 ? '#1A9CB0' : i === 2 ? '#F59E0B' : '#10B981'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <i className="ri-check-line" style={{
                          fontSize: '0.6rem',
                          color: i === 0 ? '#8B2FC9' : i === 1 ? '#1A9CB0' : i === 2 ? '#F59E0B' : '#10B981',
                        }} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={`/services#${s.slug}`}
                  style={{
                    marginTop: 8,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: BG_LIGHTS[i % BG_LIGHTS.length],
                    border: `1px solid ${i === 0 ? 'rgba(139,47,201,0.2)' : i === 1 ? 'rgba(26,156,176,0.2)' : i === 2 ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 600,
                    background: GRADIENTS[i % GRADIENTS.length],
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {t.services.learnMore}
                  </span>
                  <i className="ri-arrow-right-line" style={{
                    fontSize: '0.875rem',
                    color: i === 0 ? '#8B2FC9' : i === 1 ? '#1A9CB0' : i === 2 ? '#F59E0B' : '#10B981',
                  }} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA bas */}
        <motion.div {...fadeUp(0.3)} style={{
          marginTop: 'clamp(32px,5vw,48px)',
          textAlign: 'center',
        }}>
          <Link to="/services">
            <button className="btn-grad cursor-pointer">
              <i className="ri-grid-line" style={{ marginRight: 8 }} />
              Voir tous nos services
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}