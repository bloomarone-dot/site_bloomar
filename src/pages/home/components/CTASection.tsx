import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

interface Props { onOpenModal: () => void }

export default function CTASection({ onOpenModal }: Props) {
  const { t } = useLanguage()
  
  return (
    // ✅ Passage à un fond légèrement plus doux/moderne ou blanc épuré pour éviter le style "IA générique"
    <section className="py-24 px-5" style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6">
          
          {/* Titre principal */}
          <h2 className="font-extrabold text-gray-900" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {t.cta.heading}
            <span className="text-grad"> {t.cta.headingGradient}</span>
          </h2>
          
          {/* Sous-titre descriptif */}
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: '#4B5563' }}>
            {t.cta.sub}
          </p>
          
          {/* Zone des boutons d'action */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {/* Bouton principal (Modal de contact) */}
            <button onClick={onOpenModal} className="btn-grad cursor-pointer" style={{ padding: '12px 28px', borderRadius: '10px', fontWeight: 600 }}>
              {t.cta.primary}
            </button>
            
            {/* Bouton secondaire WhatsApp (Corrigé avec ton vrai numéro de téléphone du terrain) */}
            <a href="https://wa.me/237652209175" target="_blank" rel="noopener noreferrer"
              className="cursor-pointer"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px', 
                borderRadius: '10px', 
                fontWeight: 600,
                border: '1px solid #D1D5DB',
                background: '#fff',
                color: '#374151',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#8B2FC9';
                e.currentTarget.style.color = '#8B2FC9';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.color = '#374151';
              }}
            >
              <i className="ri-whatsapp-line text-lg" style={{ color: '#25D366' }} />
              {t.cta.whatsapp}
            </a>
          </div>
          
        </motion.div>
      </div>
    </section>
  )
}