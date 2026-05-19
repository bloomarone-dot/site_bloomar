import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: "Quels sont vos délais de livraison ?",
    a: "Les délais varient selon le projet : un site vitrine est livré en 5 à 10 jours ouvrables. Un logiciel sur mesure ou une application mobile prend généralement 3 à 8 semaines selon la complexité. Nous définissons ensemble un calendrier précis dès le démarrage."
  },
  {
    q: "Comment se déroule le processus de travail ?",
    a: "Nous suivons 4 étapes : Analyse (comprendre vos besoins), Conception (proposer une solution), Déploiement (mise en place rapide), puis Suivi (accompagnement, SAV et optimisation continue)."
  },
  {
    q: "Proposez-vous des tarifs adaptés aux PME camerounaises ?",
    a: "Oui, nos tarifs sont pensés pour le contexte africain. Nous proposons des formules flexibles adaptées à votre budget. Contactez-nous pour un devis personnalisé gratuit et sans engagement."
  },
  {
    q: "Travaillez-vous uniquement à Yaoundé ?",
    a: "Notre siège est à Yaoundé (derrière le Gymnase, Mobile Omnisport), mais nous accompagnons des clients dans tout le Cameroun et en Afrique francophone. Nous travaillons à distance via WhatsApp et visioconférence."
  },
  {
    q: "Que comprend le SAV après livraison ?",
    a: "Notre SAV inclut : support technique en cas de panne, formation de vos équipes à la prise en main des outils, et recommandations pratiques pour optimiser vos process. Nous restons disponibles sur WhatsApp."
  },
  {
    q: "Puis-je intégrer des paiements MoMo et Orange Money ?",
    a: "Absolument. Nous intégrons nativement les solutions de paiement mobile africaines (MTN MoMo, Orange Money) dans tous nos outils — applications mobiles, sites e-commerce et logiciels de gestion."
  },
  {
    q: "Proposez-vous un accompagnement pour la levée de fonds ?",
    a: "Oui, c'est l'un de nos services phares. Nous vous accompagnons dans la structuration comptable, bancaire et juridique de votre dossier pour maximiser vos chances d'obtenir un financement bancaire ou un investissement."
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 px-5 bg-white">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#8B2FC9' }}>FAQ</p>
          <h2 className="font-extrabold mb-3" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#111827' }}>
            Questions fréquentes
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Tout ce que vous devez savoir avant de démarrer avec BLOOMAR ONE.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${open === i ? '#8B2FC9' : '#E5E7EB'}`, transition: 'border-color 0.2s' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
                style={{ background: open === i ? 'rgba(139,47,201,0.04)' : '#fff' }}>
                <span className="font-semibold text-sm pr-4" style={{ color: '#111827' }}>{faq.q}</span>
                <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
                  style={{
                    background: open === i ? 'linear-gradient(135deg,#8B2FC9,#1A9CB0)' : '#F3F4F6',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}>
                  <i className="ri-add-line text-sm" style={{ color: open === i ? '#fff' : '#6B7280' }} />
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}>
                    <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA sous la FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10">
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <a href="https://wa.me/237652209175?text=Bonjour%20BLOOMAR%20ONE%2C%20j%27ai%20une%20question"
            target="_blank" rel="noopener noreferrer"
            className="btn-grad cursor-pointer text-sm">
            <i className="ri-whatsapp-line" />
            Posez-nous directement sur WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
