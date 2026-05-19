import { useLanguage } from '@/context/LanguageContext'

export default function MarqueeStrip() {
  const { t } = useLanguage()
  const items = [...t.marquee, ...t.marquee]

  return (
    <div className="overflow-hidden py-5" style={{ background: '#0D0F14' }}>
      <div className="marquee-track">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-6 shrink-0">
            <span className="text-sm font-semibold tracking-wide whitespace-nowrap text-white">{item}</span>
            <span className="w-2 h-2 rotate-45 shrink-0"
              style={{ background: 'linear-gradient(135deg,#8B2FC9,#1A9CB0)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
