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
      paddingTop: 'clamp(72px,10vw,96px)',
      position: 'relative',
    }}>

      {/* Blobs uniquement — SANS grille carrés */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10vw', left: '-10vw',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle,#8B2FC9,transparent)', opacity: 0.06,
        }} />
        <div style={{
          position: 'absolute', bottom: '-10vw', right: '-10vw',
          width: '35vw', height: '35vw', borderRadius: '50%',
          background: 'radial-gradient(circle,#1A9CB0,transparent)', opacity: 0.05,
        }} />
        {/* ❌ La grille carrés est supprimée ici */}
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(24px,4vw,64px) clamp(16px,5vw,40px)',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))',
        gap: 'clamp(32px,5vw,64px)',
        alignItems: 'center',
      }}>

        {/* LEFT — Texte */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px,2.5vw,24px)' }}>

          {/* Badge */}
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
              fontSize: 'clamp(0.6rem,1.1vw,0.72rem)', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B7280',
            }}>
              {t.hero.badge}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1 {...fadeUp(0.1)} style={{
            fontSize: 'clamp(2rem,5.5vw,4.2rem)',
            fontWeight: 800, lineHeight: 1.08, color: '#111827', margin: 0,
          }}>
            {t.hero.headline1}<br />
            <span className="text-grad">{t.hero.headlineGradient}</span>
            {t.hero.headline2}
          </motion.h1>

          {/* Subtitle */}
          <motion.p {...fadeUp(0.2)} style={{
            fontSize: 'clamp(0.875rem,1.6vw,1.05rem)',
            lineHeight: 1.7, color: '#6B7280', maxWidth: '52ch', margin: 0,
          }}>
            {t.hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} style={{
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,1.5vw,12px)',
          }}>
            <button onClick={onOpenModal} className="btn-grad cursor-pointer"
              style={{ fontSize: 'clamp(0.8rem,1.4vw,0.9rem)' }}>
              {t.hero.ctaPrimary}
            </button>
            <a href="/services" className="btn-outline cursor-pointer"
              style={{ fontSize: 'clamp(0.8rem,1.4vw,0.9rem)' }}>
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(0.4)} style={{
            display: 'flex', flexWrap: 'wrap',
            gap: 'clamp(20px,4vw,40px)', paddingTop: 8,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="text-grad" style={{
                  fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800,
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

        {/* RIGHT — Photo fixe + badges flottants */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>

          {/* Badge flottant haut-gauche */}
          <motion.div className="float"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              position: 'absolute',
              left: 'clamp(-8px,-2vw,-4px)',
              top: 'clamp(16px,3vw,32px)',
              zIndex: 20,
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              padding: 'clamp(8px,1.5vw,12px) clamp(12px,2vw,16px)',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
            <i className="ri-shield-check-line text-grad"
              style={{ fontSize: 'clamp(1rem,2vw,1.25rem)' }} />
            <div>
              <p style={{
                fontWeight: 700, fontSize: 'clamp(0.65rem,1.2vw,0.75rem)',
                color: '#111827', margin: 0,
              }}>
                {t.hero.badge1}
              </p>
              <p style={{ fontSize: 'clamp(0.6rem,1vw,0.65rem)', color: '#6B7280', margin: 0 }}>
                Yaoundé, Cameroun
              </p>
            </div>
          </motion.div>

          {/* ✅ PHOTO FIXE à la place du carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 'clamp(280px,40vw,420px)',
              height: 'clamp(320px,50vw,520px)',
             borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(139,47,201,0.15)',
            }}>
           <img
  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=720&h=900&fit=crop&q=80"
  alt="Dashboard BLOOMAR ONE"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
              }}
              loading="eager"
            />
            {/* Overlay dégradé bas */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '35%',
              background: 'linear-gradient(to top, rgba(139,47,201,0.25), transparent)',
            }} />
          </motion.div>

          {/* Badge flottant bas-droite */}
          <motion.div className="float-slow"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute',
              right: 'clamp(-8px,-2vw,-4px)',
              bottom: 'clamp(32px,6vw,48px)',
              zIndex: 20,
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              padding: 'clamp(8px,1.5vw,12px) clamp(12px,2vw,16px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              {['#8B2FC9', '#1A9CB0', '#374151'].map((c, i) => (
                <div key={i} style={{
                  width: 'clamp(20px,2.5vw,26px)', height: 'clamp(20px,2.5vw,26px)',
                  borderRadius: '50%', background: c,
                  border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '0.6rem',
                }}>
                  {['A', 'K', 'F'][i]}
                </div>
              ))}
              <span style={{
                fontWeight: 700, fontSize: 'clamp(0.65rem,1.2vw,0.75rem)',
                color: '#111827', marginLeft: 4,
              }}>
                {t.hero.badge2}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <i key={s} className="ri-star-fill"
                  style={{ fontSize: 'clamp(0.6rem,1vw,0.75rem)', color: '#F59E0B' }} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="bounce-y" style={{
        position: 'absolute',
        bottom: 'clamp(16px,3vw,24px)',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4, color: '#9CA3AF',
      }}>
        <span style={{
          fontSize: 'clamp(0.6rem,1vw,0.7rem)',
          letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>
          {t.hero.scroll}
        </span>
        <i className="ri-arrow-down-line"
          style={{ fontSize: 'clamp(0.875rem,1.5vw,1rem)' }} />
      </div>
    </section>
  )
}