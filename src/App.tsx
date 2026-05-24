import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProjectsGrid from './components/ProjectsGrid'
import StudioSection from './components/StudioSection'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      {/* Persistent nav */}
      <Header />

      <main className="flex-1 flex flex-col">
        {/* § 1 — Wheel hero: 100vh split */}
        <HeroSection />

        {/* § 2 — Asymmetric projects + experiments grid */}
        <ProjectsGrid />

        {/* § 3 — All off-a-whim experiments */}
        <StudioSection />

        {/* § 4 — 3-column About / Foundations */}
        <AboutSection />
      </main>

      {/* § 5 — Baseline footer */}
      <Footer />
    </div>
  )
}
