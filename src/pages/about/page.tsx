import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/pages/home/components/Navbar'
import Footer from '@/pages/home/components/Footer'
import ProjectModal from '@/pages/home/components/ProjectModal'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

const team = [
  { initials: 'B', color: '#8B2FC9', role: 'Fondateur & CEO', title: 'Direction & Vision Produit', skills: ['Stratégie', 'Product', 'Business Dev'] },
  { initials: 'D', color: '#1A9CB0', role: 'Lead Développeur', title: 'Architecture & Dev', skills: ['React', 'Node.js', 'Supabase'] },
  { initials: 'A', color: '#374151', role: 'UI/UX Designer', title: 'Design & Branding', skills: ['Figma', 'Design System', 'Motion'] },
]

export default function AboutPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      <Navbar onOpenModal={() => setModalOpen(true)} />
      <main className="pt-20" style={{ background: '#FFF' }}>

        {/* HERO SECTION */}
        <section style={{ padding: 'clamp(48px,8vw,96px) clamp(16px,5vw,40px)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: '#8B2FC9' }}>
              {t.about.label}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="font-extrabold mb-6" style={{ fontSize: 'clamp(2rem,5vw,3.8rem)', lineHeight: 1.15, color: '#111827', letterSpacing: '-0.02em' }}>
              {t.about.heading}{' '}
              <span className="text-grad">{t.about.headingGradient}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base leading-relaxed max-w-2xl" style={{ color: '#6B7280', fontSize: 'clamp(0.95rem,1.5vw,1.1rem)' }}>
              {t.about.sub}
            </motion.p>
          </div>
        </section>

        {/* SECTION HISTOIRE (Plein écran pour plus d'impact) */}
        <section style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,5vw,40px)', background: '#F9FAFB', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <motion.p {...fadeUp()} className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#8B2FC9' }}>
              {t.about.storyLabel}
            </motion.p>
            <motion.h2 {...fadeUp(0.05)} className="font-extrabold mb-6"
              style={{ fontSize: 'clamp(1.6rem,3.2vw,2.4rem)', color: '#111827', letterSpacing: '-0.01em' }}>
              {t.about.storyHeading}
            </motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,380px), 1fr))', gap: 24 }}>
              <motion.p {...fadeUp(0.1)} className="text-sm leading-relaxed" style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {t.about.storyText1}
              </motion.p>
              <motion.p {...fadeUp(0.15)} className="text-sm leading-relaxed" style={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {t.about.storyText2}
              </motion.p>
            </div>
          </div>
        </section>

        {/* SECTION MISSION, VISION & VALEURS */}
        <section style={{ padding: 'clamp(48px,8vw,96px) clamp(16px,5vw,40px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px), 1fr))', gap: '40px', alignItems: 'start' }}>
              
              {/* Bloc Gauche : Mission & Vision */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: t.about.missionLabel, title: t.about.missionHeading, text: t.about.missionText },
                  { label: 'VISION', title: t.about.visionHeading, text: t.about.visionText },
                ].map((item, i) => (
                  <motion.div key={i} {...fadeUp(i * 0.1)}
                    style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: 20, padding: 28 }}
                    whileHover={{ y: -4, borderColor: 'rgba(139,47,201,0.3)', boxShadow: '0 12px 30px rgba(0,0,0,0.04)' }}>
                    <p className="text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: '#8B2FC9' }}>{item.label}</p>
                    <h4 className="font-extrabold text-base mb-3" style={{ color: '#111827', letterSpacing: '-0.01em' }}>{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{item.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Bloc Droite : Nos Valeurs */}
              <div>
                <motion.p {...fadeUp()} className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#8B2FC9' }}>
                  {t.about.valuesLabel}
                </motion.p>
                <motion.h2 {...fadeUp(0.05)} className="font-extrabold mb-6"
                  style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#111827', letterSpacing: '-0.01em' }}>
                  {t.about.valuesHeading}
                </motion.h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px), 1fr))', gap: 16 }}>
                  {t.about.values.map((v, i) => (
                    <motion.div key={v.title} {...fadeUp(0.1 + i * 0.08)}
                      style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 20, padding: 24 }}
                      whileHover={{ y: -4, background: '#FFF', borderColor: 'rgba(139,47,201,0.2)', boxShadow: '0 12px 30px rgba(0,0,0,0.04)' }}>
                      <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: 12 }}>{v.icon}</span>
                      <h4 className="font-bold text-sm mb-2" style={{ color: '#111827' }}>{v.title}</h4>
                      <p className="text-xs leading-relaxed" style={{ color: '#6B7280', lineHeight: 1.5 }}>{v.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION ÉQUIPE */}
        <section style={{ padding: 'clamp(48px,8vw,96px) clamp(16px,5vw,40px)', background: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ marginBottom: 48, textAlign: 'center' }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#8B2FC9' }}>
                L'ÉQUIPE
              </p>
              <h2 className="font-extrabold" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: '#111827', letterSpacing: '-0.02em' }}>
                {t.about.about_team_h2 ?? 'Les visages derrière Bloomar One'}
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px), 1fr))', gap: 24 }}>
              {team.map((m, i) => (
                <motion.div key={m.role} {...fadeUp(i * 0.1)}
                  style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}
                  whileHover={{ y: -6, borderColor: 'rgba(139,47,201,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                  
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 800, fontSize: '1.25rem', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}>
                    {m.initials}
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-1 text-grad" style={{ display: 'inline-block' }}>{m.role}</p>
                    <h3 className="font-bold text-base" style={{ color: '#111827', margin: 0 }}>{m.title}</h3>
                  </div>

                  <div style={{ height: 1, background: 'linear-gradient(90deg, #E5E7EB, transparent)' }} />

                  <div className="flex flex-wrap gap-2" style={{ marginTop: 'auto' }}>
                    {m.skills.map(s => (
                      <span key={s} className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#4B5563' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION CTA */}
        <section style={{ padding: 'clamp(64px,10vw,120px) clamp(16px,5vw,40px)', background: '#0D0F14', position: 'relative', overflow: 'hidden' }}>
          {/* Lueur d'arrière-plan subtile */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,47,201,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <motion.div {...fadeUp()}>
              <h2 className="font-extrabold text-white mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {t.about.ctaHeading}
              </h2>
              <p className="text-base mb-8" style={{ color: '#9CA3AF', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>{t.about.ctaSub}</p>
              <button onClick={() => setModalOpen(true)} className="btn-grad cursor-pointer" style={{ padding: '14px 36px', borderRadius: 12, fontWeight: 600 }}>
                {t.about.ctaBtn}
              </button>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}