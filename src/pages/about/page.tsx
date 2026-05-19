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
      <main className="pt-20">

        {/* HERO */}
        <section className="py-20 px-5 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: '#8B2FC9' }}>
              {t.about.label}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="font-extrabold mb-5" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1, color: '#111827' }}>
              {t.about.heading}{' '}
              <span className="text-grad">{t.about.headingGradient}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base leading-relaxed max-w-xl" style={{ color: '#6B7280' }}>
              {t.about.sub}
            </motion.p>
          </div>
        </section>

        {/* MISSION & VALEURS */}
        <section className="py-20 px-5" style={{ background: '#F9FAFB' }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Mission */}
            <div>
              <motion.p {...fadeUp()} className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: '#8B2FC9' }}>
                {t.about.storyLabel}
              </motion.p>
              <motion.h2 {...fadeUp(0.05)} className="font-extrabold mb-6"
                style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#111827' }}>
                {t.about.storyHeading}
              </motion.h2>
              <div className="flex flex-col gap-4">
                {[t.about.storyText1, t.about.storyText2].map((txt, i) => (
                  <motion.p key={i} {...fadeUp(0.1 + i * 0.08)}
                    className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {txt}
                  </motion.p>
                ))}
              </div>

              {/* Mission / Vision */}
              <div className="mt-8 flex flex-col gap-5">
                {[
                  { label: t.about.missionLabel, title: t.about.missionHeading, text: t.about.missionText },
                  { label: 'VISION', title: t.about.visionHeading, text: t.about.visionText },
                ].map((item, i) => (
                  <motion.div key={i} {...fadeUp(0.2 + i * 0.08)}
                    className="p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
                    <p className="text-xs font-bold tracking-[0.15em] uppercase mb-1" style={{ color: '#8B2FC9' }}>{item.label}</p>
                    <h4 className="font-bold text-base mb-2" style={{ color: '#111827' }}>{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Valeurs */}
            <div>
              <motion.p {...fadeUp()} className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: '#8B2FC9' }}>
                {t.about.valuesLabel}
              </motion.p>
              <motion.h2 {...fadeUp(0.05)} className="font-extrabold mb-6"
                style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#111827' }}>
                {t.about.valuesHeading}
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.about.values.map((v, i) => (
                  <motion.div key={v.title} {...fadeUp(0.1 + i * 0.08)}
                    className="p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
                    <span className="text-2xl block mb-3">{v.icon}</span>
                    <h4 className="font-bold text-sm mb-2" style={{ color: '#111827' }}>{v.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ÉQUIPE */}
        <section className="py-20 px-5 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()} className="mb-12">
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#8B2FC9' }}>
                {t.about.label}
              </p>
              <h2 className="font-extrabold" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#111827' }}>
                {t.about.about_team_h2 ?? 'Les visages derrière Bloomar One'}
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map((m, i) => (
                <motion.div key={m.role} {...fadeUp(i * 0.1)}
                  className="p-7 rounded-2xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl mb-5"
                    style={{ background: m.color }}>
                    {m.initials}
                  </div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-1 text-grad">{m.role}</p>
                  <h3 className="font-bold text-base mb-4" style={{ color: '#111827' }}>{m.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {m.skills.map(s => (
                      <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: '#fff', border: '1px solid #E5E7EB', color: '#6B7280' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-5" style={{ background: '#0D0F14' }}>
          <div className="max-w-2xl mx-auto text-center">
            <motion.div {...fadeUp()}>
              <h2 className="font-extrabold text-white mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
                {t.about.ctaHeading}
              </h2>
              <p className="text-base mb-8" style={{ color: '#9CA3AF' }}>{t.about.ctaSub}</p>
              <button onClick={() => setModalOpen(true)} className="btn-grad cursor-pointer">
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
