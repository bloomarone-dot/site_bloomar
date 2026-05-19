"use client"
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BloLogo from './BloLogo'
import { useLanguage } from '@/context/LanguageContext'

interface Props { onOpenModal: () => void }

export default function Navbar({ onOpenModal }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { t, lang, setLang } = useLanguage()
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/services', label: t.nav.services },
    { href: '/a-propos', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ]

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #E5E7EB' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: `0 clamp(16px,4vw,40px)`,
        height: 'clamp(60px,8vw,80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <BloLogo size="md" />
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,3vw,32px)' }}
          className="hidden md:flex">
          {links.map(l => (
            <Link key={l.href} to={l.href} style={{
              fontSize: 'clamp(0.78rem,1.3vw,0.9rem)',
              fontWeight: 500, color: isActive(l.href) ? '#8B2FC9' : '#374151',
              textDecoration: 'none', transition: 'color 0.15s', cursor: 'pointer',
            }}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 'clamp(8px,1.5vw,12px)' }}>
          <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            style={{
              fontSize: 'clamp(0.65rem,1.1vw,0.75rem)', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: 'clamp(4px,0.8vw,6px) clamp(8px,1.5vw,12px)',
              borderRadius: 8, border: '1px solid #E5E7EB',
              background: 'transparent', color: '#6B7280', cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#8B2FC9')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E7EB')}>
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button onClick={onOpenModal} className="btn-grad cursor-pointer"
            style={{ fontSize: 'clamp(0.78rem,1.3vw,0.875rem)', padding: 'clamp(8px,1.2vw,11px) clamp(14px,2.5vw,22px)' }}>
            {t.nav.cta}
          </button>
        </div>

        {/* Burger mobile */}
        <button className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', padding: 8 }} aria-label="Menu">
          <i className={`${open ? 'ri-close-line' : 'ri-menu-line'}`}
            style={{ fontSize: 'clamp(1.25rem,4vw,1.5rem)', color: '#111827' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              background: '#fff', borderTop: '1px solid #E5E7EB',
              padding: 'clamp(16px,4vw,24px) clamp(16px,5vw,40px)',
              display: 'flex', flexDirection: 'column', gap: 'clamp(12px,3vw,16px)',
            }}>
            {links.map(l => (
              <Link key={l.href} to={l.href} style={{
                fontSize: 'clamp(0.9rem,3.5vw,1rem)', fontWeight: 500,
                color: isActive(l.href) ? '#8B2FC9' : '#111827',
                textDecoration: 'none', padding: '4px 0', cursor: 'pointer',
              }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                style={{
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '6px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
                  background: 'transparent', color: '#6B7280', cursor: 'pointer',
                }}>
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
              <button onClick={onOpenModal} className="btn-grad cursor-pointer"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}>
                {t.nav.cta}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
