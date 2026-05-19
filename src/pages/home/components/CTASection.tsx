import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

interface Props { onOpenModal: () => void }

export default function CTASection({ onOpenModal }: Props) {
  const { t } = useLanguage()
  return (
    <section className="py-24 px-5" style={{ background: '#0D0F14' }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6">
          <h2 className="font-extrabold text-white" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.15 }}>
            {t.cta.heading}
            <span className="text-grad"> {t.cta.headingGradient}</span>
          </h2>
          <p className="text-base max-w-xl" style={{ color: '#9CA3AF' }}>{t.cta.sub}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={onOpenModal} className="btn-grad cursor-pointer">
              {t.cta.primary}
            </button>
            <a href="https://wa.me/237600000000" target="_blank" rel="noopener noreferrer"
              className="btn-outline-white cursor-pointer">
              {t.cta.whatsapp}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
