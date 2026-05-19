import { Link } from 'react-router-dom'
import BloLogo from './BloLogo'
import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer style={{ background: '#1A1A2E', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <BloLogo size="lg" />
            <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{t.footer.tagline}</p>
            <div className="flex gap-3 mt-1">
              {[
                { icon: 'ri-facebook-box-line', href: 'https://www.facebook.com/profile.php?id=61588999585653' },
                { icon: 'ri-instagram-line', href: 'https://www.instagram.com/bloomarone/' },
                { icon: 'ri-linkedin-box-line', href: 'https://www.linkedin.com/company/bloomar-one/' },
                { icon: 'ri-whatsapp-line', href: 'https://wa.me/237652209175' },
              ].map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#8B2FC9')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
                  <i className={`${s.icon} text-base`} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: '#6B7280' }}>
              {t.footer.nav}
            </p>
            <ul className="flex flex-col gap-3">
              {t.footer.links.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm transition-colors cursor-pointer"
                    style={{ color: '#9CA3AF' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: '#6B7280' }}>
              {t.footer.servicesCol}
            </p>
            <ul className="flex flex-col gap-3">
              {t.footer.servicesList.map(s => (
                <li key={s}>
                  <Link to="/services" className="text-sm transition-colors cursor-pointer"
                    style={{ color: '#9CA3AF' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-5" style={{ color: '#6B7280' }}>
              {t.footer.contactCol}
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <i className="ri-mail-line text-sm mt-0.5 shrink-0" style={{ color: '#8B2FC9' }} />
                <a href={`mailto:${t.footer.email}`} className="text-sm transition-colors cursor-pointer"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
                  {t.footer.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="ri-whatsapp-line text-sm mt-0.5 shrink-0" style={{ color: '#1A9CB0' }} />
                <a href={`https://wa.me/${t.footer.phone.replace(/\s/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm transition-colors cursor-pointer"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
                  {t.footer.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="ri-map-pin-line text-sm mt-0.5 shrink-0" style={{ color: '#8B2FC9' }} />
                <span className="text-sm" style={{ color: '#9CA3AF' }}>{t.footer.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-5">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: '#6B7280' }}>{t.footer.copyright}</p>
          <p className="text-xs" style={{ color: '#6B7280' }}>{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  )
}
