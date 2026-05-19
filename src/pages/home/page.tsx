import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarqueeStrip from './components/MarqueeStrip'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import Reviews from './components/Reviews'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import ProjectModal from './components/ProjectModal'

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Navbar onOpenModal={() => setModalOpen(true)} />
      <main>
        <Hero onOpenModal={() => setModalOpen(true)} />
        <MarqueeStrip />
        <Services onOpenModal={() => setModalOpen(true)} />
        <HowItWorks />
        <Reviews />
        <CTASection onOpenModal={() => setModalOpen(true)} />
      </main>
      <Footer />
      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
