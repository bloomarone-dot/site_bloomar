import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md">
        <p className="font-extrabold text-grad mb-4" style={{ fontSize: '6rem', lineHeight: 1 }}>404</p>
        <h1 className="font-extrabold text-2xl mb-3" style={{ color: '#111827' }}>{t.notfound_h1}</h1>
        <p className="text-sm mb-8" style={{ color: '#6B7280' }}>{t.notfound_sub}</p>
        <Link to="/">
          <button className="btn-grad cursor-pointer">
            <i className="ri-home-line" />
            {t.notfound_btn}
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
