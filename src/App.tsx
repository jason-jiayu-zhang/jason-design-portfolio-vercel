import { useEffect, useLayoutEffect, useRef } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ArchiveSection from './components/ArchiveSection'
import StudioSection from './components/StudioSection'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import { IntroProvider, useIntro } from './components/IntroContext'
import './index.css'

const SCROLL_KEY = 'home_scroll_y'

function AppContent() {
  const { phase } = useIntro()
  const isPhase3 = phase === 'phase03'
  const restoredRef = useRef(false)

  // Save scroll position continuously while on this page
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Once phase3 content is rendered, restore saved scroll position (only once)
  useLayoutEffect(() => {
    if (!isPhase3 || restoredRef.current) return
    restoredRef.current = true
    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10))
    }
  }, [isPhase3])

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      {/* Persistent nav */}
      <Header />

      <main className="flex-1 flex flex-col">
        {/* § 1 — Wheel featured: 100vh split */}
        <HeroSection />

        {isPhase3 && (
          <>
            {/* § 2 — Studio section: off-a-whim experiments */}
            <StudioSection />

            {/* § 3 — Archive section: masterlist of all work */}
            <ArchiveSection />

            {/* § 4 — 3-column About / Foundations */}
            <AboutSection />
          </>
        )}
      </main>

      {/* § 5 — Baseline footer */}
      {isPhase3 && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <IntroProvider>
      <AppContent />
    </IntroProvider>
  )
}
