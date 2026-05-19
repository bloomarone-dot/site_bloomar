import { motion } from 'framer-motion'

interface Props {
  name: string; price: string; period?: string
  features: string[]; featured?: boolean; cta: string
  delay?: number; onOpenModal: () => void
}

export default function PricingCard({ name, price, period, features, featured = false, cta, delay = 0, onOpenModal }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="relative flex flex-col p-8 rounded-2xl"
      style={{
        background: '#fff',
        border: featured ? '2px solid #8B2FC9' : '1px solid #E5E7EB',
        transform: featured ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="text-xs font-bold px-4 py-1.5 rounded-full text-white"
            style={{ background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)' }}>
            ✦ Populaire
          </span>
        </div>
      )}

      <p className="font-bold text-base mb-1" style={{ color: '#111827' }}>{name}</p>

      <div className="flex items-end gap-1 mb-6">
        <span className="font-extrabold text-3xl" style={{ color: featured ? '#8B2FC9' : '#111827' }}>
          {price}
        </span>
        {period && <span className="text-sm mb-1" style={{ color: '#9CA3AF' }}>{period}</span>}
      </div>

      <div className="h-px mb-5" style={{ background: '#F3F4F6' }} />

      <ul className="flex flex-col gap-2.5 flex-1 mb-7">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
            <i className="ri-check-line mt-0.5 shrink-0" style={{ color: featured ? '#8B2FC9' : '#6B7280' }} />
            {f}
          </li>
        ))}
      </ul>

      <button onClick={onOpenModal}
        className={`${featured ? 'btn-grad' : 'btn-outline'} cursor-pointer justify-center w-full`}>
        {featured ? <span>{cta}</span> : cta}
      </button>
    </motion.div>
  )
}
