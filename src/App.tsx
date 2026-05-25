import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ArchiveSection from './components/ArchiveSection'
import StudioSection from './components/StudioSection'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import { IntroProvider, useIntro } from './components/IntroContext'
import './index.css'

function AppContent() {
  const { phase } = useIntro()
  const isPhase3 = phase === 'phase03'

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
