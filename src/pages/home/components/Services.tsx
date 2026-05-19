import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

// Configuration unifiée pour un rendu SaaS Premium (Design type Genuka)
const SERVICE_CONFIGS = [
  {
    icon: 'ri-global-line', // Remplacera l'émoji du service 1
    color: '#8B2FC9',
    gradient: 'linear-gradient(135deg, #8B2FC9 0%, #6B3FC0 100%)',
    bgLight: 'rgba(139,47,201,0.06)',
    borderLight: 'rgba(139,47,201,0.2)',
  },
  {
    icon: 'ri-line-chart-line', // Remplacera l'émoji du service 2
    color: '#1A9CB0',
    gradient: 'linear-gradient(135deg, #1A9CB0 0%, #0E7A8C 100%)',
    bgLight: 'rgba(26,156,176,0.06)',
    borderLight: 'rgba(26,156,176,0.2)',
  },
  {
    icon: 'ri-customer-service-2-line', // Remplacera l'émoji du service 3
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    bgLight: 'rgba(245,158,11,0.06)',
    borderLight: 'rgba(245,158,11,0.2)',
  },
  {
    icon: 'ri-printer-line', // Remplacera l'émoji du service 4
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    bgLight: 'rgba(16,185,129,0.06)',
    borderLight: 'rgba(16,185,129,0.2)',
  },
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
            letterSpacing: '-0.02em',
          }}>
            {t.services.heading}{' '}
            <span className="text-grad">{t.services.headingGradient}</span>
          </h2>
          <p style={{
            fontSize: 'clamp(0.875rem,1.5vw,1rem)',
            color: '#6B7280', maxWidth: 520, margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {t.services.sub}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,260px),1fr))',
          gap: 'clamp(16px,2vw,24px)',
        }}>
          {t.services.items.map((s, i) => {
            // Sélection automatique du set de styles selon l'index
            const config = SERVICE_CONFIGS[i % SERVICE_CONFIGS.length]

            return (
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
                  boxShadow: `0 20px 40px ${config.bgLight.replace('0.06', '0.15')}`,
                  borderColor: config.borderLight,
                }}>

                {/* Top Banner avec de vraies icônes (Remix Icon) */}
                <div style={{
                  height: 'clamp(110px,15vw,140px)',
                  background: config.bgLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Cercles décoratifs d'arrière-plan */}
                  <div style={{
                    position: 'absolute', width: 120, height: 120,
                    borderRadius: '50%', top: -30, right: -30,
                    background: config.gradient,
                    opacity: 0.06,
                  }} />
                  <div style={{
                    position: 'absolute', width: 80, height: 80,
                    borderRadius: '50%', bottom: -20, left: -20,
                    background: config.gradient,
                    opacity: 0.06,
                  }} />

                  {/* Numéro de service stylisé en arrière-plan */}
                  <span style={{
                    position: 'absolute', right: 16, bottom: 4,
                    fontSize: '4.5rem', fontWeight: 900,
                    color: 'transparent',
                    WebkitTextStroke: `1px ${config.color}`,
                    opacity: 0.1,
                    lineHeight: 1,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Conteneur de l'icône principale */}
                  <div style={{
                    width: 64, height: 64,
                    borderRadius: 16,
                    background: config.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    position: 'relative', zIndex: 1,
                  }}>
                    <i className={config.icon} style={{ color: '#fff', fontSize: '1.75rem' }} />
                  </div>
                </div>

                {/* Contenu textuel */}
                <div style={{
                  padding: '24px',
                  display: 'flex', flexDirection: 'column',
                  gap: 12, flex: 1,
                }}>

                  {/* Titre */}
                  <h3 style={{
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: '#111827', margin: 0,
                    letterSpacing: '-0.01em',
                  }}>
                    {s.title}
                  </h3>

                  {/* Tagline textuelle avec dégradé */}
                  <p style={{
                    fontSize: '0.75rem', fontWeight: 700, margin: 0,
                    background: config.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}>
                    {s.tagline}
                  </p>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.6, color: '#4B5563',
                    flex: 1, margin: 0,
                  }}>
                    {s.desc}
                  </p>

                  {/* Séparateur fluide */}
                  <div style={{
                    height: 1,
                    background: 'linear-gradient(90deg, #E5E7EB, transparent)',
                    margin: '8px 0 4px',
                  }} />

                  {/* Liste à puces (Features) */}
                  <ul style={{
                    display: 'flex', flexDirection: 'column',
                    gap: 8, margin: 0, padding: 0, listStyle: 'none',
                  }}>
                    {s.features.slice(0, 3).map((f, fi) => (
                      <li key={fi} style={{
                        display: 'flex', alignItems: 'flex-start',
                        gap: 10, fontSize: '0.8rem',
                        color: '#374151', lineHeight: 1.4,
                      }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: config.bgLight,
                          border: `1px solid ${config.color}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: 1,
                        }}>
                          <i className="ri-check-line" style={{
                            fontSize: '0.65rem',
                            color: config.color,
                            fontWeight: 'bold',
                          }} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bouton d'action / En savoir plus */}
                  <Link
                    to={`/services#${s.slug}`}
                    style={{
                      marginTop: 12,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: config.bgLight,
                      border: `1px solid ${config.borderLight}`,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}>
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 700,
                      background: config.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {t.services.learnMore}
                    </span>
                    <i className="ri-arrow-right-line" style={{
                      fontSize: '0.9rem',
                      color: config.color,
                    }} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bouton global du bas */}
        <motion.div {...fadeUp(0.3)} style={{
          marginTop: 'clamp(40px,6vw,64px)',
          textAlign: 'center',
        }}>
          <Link to="/services" style={{ textDecoration: 'none' }}>
            <button className="btn-grad cursor-pointer" style={{ padding: '14px 32px', borderRadius: 10, fontWeight: 600 }}>
              <i className="ri-grid-line" style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Voir tous nos services
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}