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
      // ✅ Augmenté pour donner de l'espace de respiration sous la nouvelle grande Navbar
      paddingTop: 'clamp(90px,12vw,120px)', 
      position: 'relative',
    }}>

      {/* Arrière-plan : Flous de couleurs (Blobs) */}
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
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(24px,4vw,64px) clamp(16px,5vw,40px)',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))',
        gap: 'clamp(40px,6vw,80px)', // ✅ Espace augmenté entre le texte et l'image pour aérer la page
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
            fontSize: 'clamp(2.2rem,5vw,3.8rem)', // ✅ Taille légèrement adoucie pour un rendu plus premium et lisible
            fontWeight: 800, lineHeight: 1.12, color: '#111827', margin: 0,
            letterSpacing: '-0.02em',
          }}>
            {t.hero.headline1}<br />
            <span className="text-grad">{t.hero.headlineGradient}</span>
            {t.hero.headline2}
          </motion.h1>

          {/* Descriptif / Sous-titre */}
          <motion.p {...fadeUp(0.2)} style={{
            fontSize: 'clamp(0.9rem,1.5vw,1.05rem)',
            lineHeight: 1.7, color: '#4B5563', maxWidth: '50ch', margin: 0,
          }}>
            {t.hero.subtitle}
          </motion.p>

          {/* Actions / Boutons */}
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

          {/* Statistiques clés de confiance */}
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

        {/* DROITE — Contenu Visuel Authentique */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>

          {/* Badge flottant : Preuve Sociale Locale */}
          <motion.div className="float"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              position: 'absolute',
              left: 'clamp(-10px, -2vw, 0px)',
              top: 'clamp(20px, 4vw, 40px)',
              zIndex: 20,
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            }}>
            <i className="ri-shield-check-line" style={{ fontSize: '1.25rem', color: '#1A9CB0' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.75rem', color: '#111827', margin: 0 }}>
                {t.hero.badge1}
              </p>
              <p style={{ fontSize: '0.65rem', color: '#6B7280', margin: 0 }}>
                Yaoundé, Cameroun
              </p>
            </div>
          </motion.div>

          {/* VISUEL PRINCIPAL : Image de terrain humaine */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '440px',
              height: 'clamp(340px, 45vw, 480px)',
              borderRadius: '20px', // ✅ Bords plus arrondis pour un aspect plus moderne et doux
              overflow: 'hidden',
              boxShadow: '0 30px 70px rgba(139,47,201,0.12)',
            }}>
            <img
              // ✅ Changement pour une image montrant un vrai commerce de terrain, chaleureux et humain
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
              alt="Gestion de commerce concret avec Bloomar One"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              loading="eager"
            />
            {/* Overlay d'intégration des couleurs de la marque */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '40%',
              background: 'linear-gradient(to top, rgba(26,156,176,0.2), transparent)',
            }} />
          </motion.div>

          {/* Badge flottant : Confiance et Notation */}
          <motion.div className="float-slow"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute',
              right: 'clamp(-10px, -2vw, 0px)',
              bottom: 'clamp(20px, 5vw, 40px)',
              zIndex: 20,
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              padding: '12px 16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              {['#8B2FC9', '#1A9CB0', '#374151'].map((c, i) => (
                <div key={i} style={{
                  width: 24, height: 24,
                  borderRadius: '50%', background: c,
                  border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '0.6rem',
                }}>
                  {['A', 'K', 'F'][i]}
                </div>
              ))}
              <span style={{
                fontWeight: 700, fontSize: '0.75rem', color: '#111827', marginLeft: 4,
              }}>
                {t.hero.badge2}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <i key={s} className="ri-star-fill" style={{ fontSize: '0.7rem', color: '#F59E0B' }} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicateur de défilement (Scroll) */}
      <div className="bounce-y" style={{
        position: 'absolute',
        bottom: 'clamp(12px,2vw,20px)',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4, color: '#9CA3AF',
      }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {t.hero.scroll}
        </span>
        <i className="ri-arrow-down-line" style={{ fontSize: '0.9rem' }} />
      </div>
    </section>
  )
}