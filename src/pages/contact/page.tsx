import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/pages/home/components/Navbar'
import Footer from '@/pages/home/components/Footer'
import ProjectModal from '@/pages/home/components/ProjectModal'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

interface FormData { nom: string; email: string; entreprise: string; service: string; message: string }

export default function ContactPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useLanguage()
  const [form, setForm] = useState<FormData>({ nom: '', email: '', entreprise: '', service: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.nom.trim()) e.nom = t.err_required
    if (!form.email.trim()) e.email = t.err_required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.err_email
    if (!form.service) e.service = t.err_required
    if (!form.message.trim()) e.message = t.err_required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Envoi via WhatsApp en attendant la config email
    const msg = encodeURIComponent(
      `Nouveau message depuis le site BLOOMAR ONE\n\n` +
      `Nom: ${form.nom}\nEmail: ${form.email}\n` +
      `Entreprise: ${form.entreprise || 'Non renseigné'}\n` +
      `Service: ${form.service}\n\nMessage:\n${form.message}`
    )
    // Sauvegarde dans Supabase
    await supabase.from('demandes').insert([{ ...form, source: 'contact' }])
    setLoading(false)
    setSuccess(true)
    // Ouvre WhatsApp avec le message
    window.open(`https://wa.me/237652209175?text=${msg}`, '_blank')
    setForm({ nom: '', email: '', entreprise: '', service: '', message: '' })
  }

  const field = (key: keyof FormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(p => ({ ...p, [key]: e.target.value }))
      if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }))
    },
  })

  const inputCls = (k: keyof FormData) =>
    `w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white ${errors[k] ? 'border-red-400' : 'border-[#E5E7EB] focus:border-[#8B2FC9]'}`

  const contactCards = [
    { icon: 'ri-phone-line', label: t.contact.phoneLabel, value: t.contact.contact_phone, href: `tel:${t.contact.contact_phone}`, color: '#8B2FC9' },
    { icon: 'ri-mail-line', label: t.contact.emailLabel, value: t.contact.contact_email, href: `mailto:${t.contact.contact_email}`, color: '#1A9CB0' },
    { icon: 'ri-map-pin-line', label: t.contact.addressLabel, value: t.contact.contact_address, href: null, color: '#8B2FC9' },
    { icon: 'ri-time-line', label: t.contact.hoursLabel, value: t.contact.hours, href: null, color: '#1A9CB0' },
  ]

  return (
    <>
      <Navbar onOpenModal={() => setModalOpen(true)} />
      <main className="pt-20">

        {/* HERO */}
        <section className="py-20 px-5 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: '#8B2FC9' }}>
              {t.contact.label}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="font-extrabold mb-5" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1, color: '#111827' }}>
              {t.contact.heading}{' '}
              <span className="text-grad">{t.contact.headingGradient}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base leading-relaxed max-w-xl" style={{ color: '#6B7280' }}>
              {t.contact.sub}
            </motion.p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-16 px-5" style={{ background: '#F9FAFB' }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* LEFT — Infos */}
            <div>
              <motion.p {...fadeUp()} className="text-xs font-bold tracking-[0.2em] uppercase mb-6" style={{ color: '#8B2FC9' }}>
                {t.contact.contact_coords}
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {contactCards.map((c, i) => (
                  <motion.div key={c.label} {...fadeUp(i * 0.08)}
                    className="p-5 rounded-2xl bg-white" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${c.color}15` }}>
                      <i className={`${c.icon} text-lg`} style={{ color: c.color }} />
                    </div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#9CA3AF' }}>{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-medium cursor-pointer transition-colors"
                        style={{ color: '#111827' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#8B2FC9')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#111827')}>
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium" style={{ color: '#111827' }}>{c.value}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <motion.a {...fadeUp(0.3)}
                href="https://wa.me/237600000000?text=Bonjour%20BLOOMAR%20ONE%2C%20je%20voudrais%20discuter%20d%27un%20projet"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: '#25D366' }}>
                <i className="ri-whatsapp-line text-xl" />
                {t.contact.contact_wa}
              </motion.a>
              <p className="text-xs text-center mt-3" style={{ color: '#9CA3AF' }}>
                Réponse garantie sous 24h · Disponible 7j/7
              </p>
            </div>

            {/* RIGHT — Form */}
            <motion.div {...fadeUp(0.1)}
              className="bg-white rounded-2xl p-8" style={{ border: '1px solid #E5E7EB' }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-6" style={{ color: '#8B2FC9' }}>
                {t.contact.formTitle}
              </p>

              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)' }}>
                    <i className="ri-check-line text-2xl text-white" />
                  </div>
                  <p className="font-bold text-lg mb-2" style={{ color: '#111827' }}>{t.contact.contact_success}</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Notre équipe vous contacte très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input type="text" placeholder={t.form.namePlaceholder} {...field('nom')}
                        className={inputCls('nom')} style={{ color: '#111827' }} />
                      {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                    </div>
                    <div>
                      <input type="email" placeholder={t.form.emailPlaceholder} {...field('email')}
                        className={inputCls('email')} style={{ color: '#111827' }} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <input type="text" placeholder={t.form.companyPlaceholder} {...field('entreprise')}
                    className={inputCls('entreprise')} style={{ color: '#111827' }} />

                  <div>
                    <select {...field('service')} className={`${inputCls('service')} cursor-pointer`}
                      style={{ color: form.service ? '#111827' : '#9CA3AF' }}>
                      <option value="" disabled>{t.contact.contact_select}</option>
                      {t.form.services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                  </div>

                  <div>
                    <textarea placeholder={t.form.messagePlaceholder} {...field('message')} rows={5}
                      className={`${inputCls('message')} resize-none`} style={{ color: '#111827' }} />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-grad cursor-pointer justify-center w-full disabled:opacity-60">
                    {loading
                      ? <><i className="ri-loader-4-line animate-spin" /> Envoi...</>
                      : <><i className="ri-send-plane-line" /> {t.contact.contact_submit}</>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* MAP placeholder */}
        <section className="py-16 px-5 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp()}
              className="relative h-64 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              {[120, 240, 360].map(s => (
                <div key={s} className="absolute rounded-full" style={{ width: s, height: s, border: '1px solid #E5E7EB' }} />
              ))}
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)' }}>
                  <i className="ri-map-pin-line text-2xl text-white" />
                </div>
                <p className="font-bold text-sm" style={{ color: '#111827' }}>BLOOMAR ONE</p>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{t.contact.contact_address}</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
