import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/context/LanguageContext'

interface Avis { id: string; nom: string; entreprise?: string; note: number; commentaire: string; created_at: string }
interface ReviewFormData { nom: string; entreprise: string; note: number; commentaire: string }

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

const COLORS = ['#8B2FC9', '#1A9CB0', '#374151', '#6B7280']

export default function Reviews() {
  const { t } = useLanguage()
  const [avis, setAvis] = useState<Avis[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ReviewFormData>({ nom: '', entreprise: '', note: 5, commentaire: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<ReviewFormData>>({})

  const loadAvis = () => {
    // Pas de filtre approved — affiche tout directement
    supabase.from('avis').select('*')
      .order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { if (data) setAvis(data) })
  }

  useEffect(() => { loadAvis() }, [])

  const validate = () => {
    const e: Partial<ReviewFormData> = {}
    if (!form.nom.trim()) e.nom = 'Nom requis'
    if (!form.commentaire.trim()) e.commentaire = 'Commentaire requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    if (editingId) {
      // Modification
      await supabase.from('avis').update({
        nom: form.nom, entreprise: form.entreprise,
        note: form.note, commentaire: form.commentaire,
      }).eq('id', editingId)
    } else {
      // Nouvel avis — approved: true directement
      await supabase.from('avis').insert([{ ...form, approved: true }])
    }

    setLoading(false)
    setShowForm(false)
    setEditingId(null)
    setForm({ nom: '', entreprise: '', note: 5, commentaire: '' })
    loadAvis() // Recharge immédiatement
  }

  const openEdit = (a: Avis) => {
    setForm({ nom: a.nom, entreprise: a.entreprise || '', note: a.note, commentaire: a.commentaire })
    setEditingId(a.id)
    setShowForm(true)
  }

  const openNew = () => {
    setForm({ nom: '', entreprise: '', note: 5, commentaire: '' })
    setEditingId(null)
    setShowForm(true)
  }

  return (
    <section style={{ padding: 'clamp(48px,8vw,96px) clamp(16px,5vw,40px)', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header centré */}
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
          <p style={{ fontSize: 'clamp(0.65rem,1.2vw,0.75rem)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B2FC9', marginBottom: 12 }}>
            {t.reviews.label}
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', fontWeight: 800, color: '#111827', lineHeight: 1.15 }}>
            {t.reviews.heading}<span className="text-grad">{t.reviews.headingGradient}</span>
          </h2>
        </motion.div>

        {avis.length === 0 ? (
          <motion.div {...fadeUp(0.1)} style={{ textAlign: 'center', padding: 'clamp(32px,5vw,64px)', background: '#F9FAFB', borderRadius: 20, border: '1px solid #E5E7EB', maxWidth: 520, margin: '0 auto' }}>
            <i className="ri-chat-smile-3-line" style={{ fontSize: '3rem', display: 'block', marginBottom: 16, color: '#8B2FC9' }} />
            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 8 }}>{t.reviews.empty}</p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 24 }}>{t.reviews.emptySub}</p>
            <button onClick={openNew} className="btn-grad cursor-pointer">
              <i className="ri-edit-line" /> {t.reviews.ctaLabel}
            </button>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 'clamp(12px,2vw,20px)' }}>
            {avis.map((a, i) => (
              <motion.div key={a.id} {...fadeUp(i * 0.08)}
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 16, padding: 'clamp(16px,2.5vw,24px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Étoiles */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <i key={s} className={`ri-star-${s < a.note ? 'fill' : 'line'}`} style={{ fontSize: '0.875rem', color: '#F59E0B' }} />
                  ))}
                </div>
                <p style={{ fontSize: 'clamp(0.8rem,1.4vw,0.875rem)', lineHeight: 1.7, color: '#374151', flex: 1 }}>
                  &ldquo;{a.commentaire}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: COLORS[i % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                      {a.nom[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', margin: 0 }}>{a.nom}</p>
                      {a.entreprise && <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{a.entreprise}</p>}
                    </div>
                  </div>
                  {/* Bouton modifier */}
                  <button onClick={() => openEdit(a)} className="cursor-pointer"
                    style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: 8, padding: '4px 10px', fontSize: '0.7rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="ri-edit-line" /> Modifier
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bouton laisser un avis */}
        {avis.length > 0 && (
          <motion.div {...fadeUp(0.3)} style={{ marginTop: 'clamp(24px,4vw,40px)', textAlign: 'center' }}>
            <button onClick={openNew} className="btn-outline cursor-pointer">
              <i className="ri-edit-line" /> {t.reviews.ctaLabel}
            </button>
          </motion.div>
        )}

        {/* Modal avis / modification */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.5)' }}
              onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,4vw,32px)', width: '100%', maxWidth: 440 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', margin: 0 }}>
                    {editingId ? 'Modifier mon avis' : 'Laisser un avis'}
                  </h3>
                  <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <i className="ri-close-line" style={{ fontSize: '1.25rem', color: '#6B7280' }} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <input type="text" placeholder="Votre nom *" value={form.nom}
                      onChange={e => setForm(p => ({ ...p, nom: e.target.value }))}
                      style={{ width: '100%', border: `1px solid ${errors.nom ? '#f87171' : '#E5E7EB'}`, borderRadius: 12, padding: '10px 14px', fontSize: '0.875rem', outline: 'none', color: '#111827', boxSizing: 'border-box' }} />
                    {errors.nom && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.nom}</p>}
                  </div>
                  <input type="text" placeholder="Entreprise (optionnel)" value={form.entreprise}
                    onChange={e => setForm(p => ({ ...p, entreprise: e.target.value }))}
                    style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 12, padding: '10px 14px', fontSize: '0.875rem', outline: 'none', color: '#111827', boxSizing: 'border-box' }} />
                  {/* Étoiles */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6B7280' }}>Note :</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setForm(p => ({ ...p, note: n }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', padding: 0 }}>
                          <i className={`ri-star-${n <= form.note ? 'fill' : 'line'}`} style={{ color: n <= form.note ? '#F59E0B' : '#D1D5DB' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <textarea placeholder="Votre commentaire *" value={form.commentaire} rows={4}
                      onChange={e => setForm(p => ({ ...p, commentaire: e.target.value }))}
                      style={{ width: '100%', border: `1px solid ${errors.commentaire ? '#f87171' : '#E5E7EB'}`, borderRadius: 12, padding: '10px 14px', fontSize: '0.875rem', outline: 'none', resize: 'none', color: '#111827', boxSizing: 'border-box' }} />
                    {errors.commentaire && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.commentaire}</p>}
                  </div>
                  <button type="submit" disabled={loading} className="btn-grad cursor-pointer justify-center"
                    style={{ opacity: loading ? 0.6 : 1 }}>
                    {loading
                      ? <><i className="ri-loader-4-line animate-spin" /> Envoi...</>
                      : <><i className="ri-check-line" /> {editingId ? 'Mettre à jour' : 'Publier mon avis'}</>}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
