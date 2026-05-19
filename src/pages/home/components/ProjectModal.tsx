import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/context/LanguageContext'

interface Props { open: boolean; onClose: () => void }

interface FormData {
  nom: string; email: string; entreprise: string; service: string; message: string
}

export default function ProjectModal({ open, onClose }: Props) {
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
    const msg = encodeURIComponent(
      `Nouveau projet depuis BLOOMAR ONE\n\n` +
      `Nom: ${form.nom}\nEmail: ${form.email}\n` +
      `Entreprise: ${form.entreprise || 'Non renseigné'}\n` +
      `Service: ${form.service}\n\nMessage:\n${form.message}`
    )
    await supabase.from('demandes').insert([{ ...form, source: 'modal' }])
    setLoading(false)
    setSuccess(true)
    window.open(`https://wa.me/237652209175?text=${msg}`, '_blank')
    setTimeout(() => {
      setSuccess(false)
      setForm({ nom: '', email: '', entreprise: '', service: '', message: '' })
      onClose()
    }, 2000)
  }

  const field = (key: keyof FormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(p => ({ ...p, [key]: e.target.value }))
      if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }))
    },
  })

  const inputCls = (k: keyof FormData) =>
    `w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${errors[k] ? 'border-red-400' : 'border-[#E5E7EB] focus:border-[#8B2FC9]'}`

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#E5E7EB]">
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#111827' }}>{t.form.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Réponse sous 24h · Sans engagement</p>
              </div>
              <button onClick={onClose} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <i className="ri-close-line text-xl" style={{ color: '#6B7280' }} />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6">
              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)' }}>
                    <i className="ri-check-line text-2xl text-white" />
                  </div>
                  <p className="font-bold text-lg mb-2" style={{ color: '#111827' }}>{t.form.success}</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Notre équipe vous contacte très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      <option value="" disabled>{t.form.service}</option>
                      {t.form.services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                  </div>

                  <div>
                    <textarea placeholder={t.form.messagePlaceholder} {...field('message')} rows={4}
                      className={`${inputCls('message')} resize-none`} style={{ color: '#111827' }} />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-grad cursor-pointer justify-center w-full disabled:opacity-60">
                    {loading
                      ? <><i className="ri-loader-4-line animate-spin" /> Envoi en cours...</>
                      : <><i className="ri-send-plane-line" /> {t.form.submit}</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
