import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'
import type { Project } from '../types/portfolio'
import WheelSelector from './WheelSelector'
import { SNAP_INTERVAL } from '../utils/wheelMath'
import { useIntro } from './IntroContext'

// ── Animated Element Wrapper ───────────────────────────────────────────────
interface AnimatedElementProps {
  delay: number
  children: React.ReactNode
  className?: string
}

function AnimatedElement({ delay, children, className = '' }: AnimatedElementProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`overflow-hidden pb-2 -mb-2 ${className}`}>
      <div
        style={{
          transform: show ? 'translateY(0)' : 'translateY(10px)',
          opacity: show ? 1 : 0,
          transition: `transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Narrative text panel ───────────────────────────────────────────────────
interface NarrativePanelProps {
  project: Project
}

function NarrativePanel({ project }: NarrativePanelProps) {
  const [lines, setLines] = useState<boolean[]>(Array(project.narrative.length).fill(false))

  useEffect(() => {
    setLines(Array(project.narrative.length).fill(false))
    const timeouts = project.narrative.map((_, i) => 
      setTimeout(() => {
        setLines(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, 500 + i * 120)
    )
    return () => timeouts.forEach(clearTimeout)
  }, [project.narrative.length])

  return (
    <div className="space-y-4">
      {project.narrative.map((para, i) => (
        <div key={i} className="overflow-hidden pb-2 -mb-2">
          <p
            className="font-mono text-sm text-parchment/60 leading-[1.65] tracking-tight"
            style={{
              transform: lines[i] ? 'translateY(0)' : 'translateY(8px)',
              opacity: lines[i] ? 1 : 0,
              transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
              willChange: 'transform, opacity',
            }}
          >
            {para}
          </p>
        </div>
      ))}
    </div>
  )
}

// ── Main Hero Section ──────────────────────────────────────────────────────
export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [projKey, setProjKey] = useState('proj-0')
  const keyRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleProjectChange = useCallback((index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index)
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsFadingOut(true)
    
    timeoutRef.current = setTimeout(() => {
      setDisplayIndex(index)
      keyRef.current += 1
      setProjKey(`proj-${index}-${keyRef.current}`)
      setIsFadingOut(false)
    }, 300)
  }, [activeIndex])

  const activeProject = PROJECTS[activeIndex]
  const project = PROJECTS[displayIndex]
  const { hasLoaded, phase } = useIntro()
  const showPhase2 = hasLoaded || phase === 'phase02' || phase === 'phase03'
  const isPhase3 = hasLoaded || phase === 'phase03'

  return (
    <section
      id="featured"
      className="relative w-full overflow-x-hidden min-h-[100dvh] lg:h-screen"
      style={{ marginTop: 0, paddingTop: '48px' }}
    >
      {/* ── Horizontal hairline accent ── */}
      {showPhase2 && (
        <div
          className={`absolute left-0 right-0 top-[48px] border-t ${!hasLoaded ? 'animate-slice-x' : ''}`}
          style={{ borderColor: 'rgba(56, 64, 106, 0.4)' }}
        />
      )}

      {/* ── SPLIT LAYOUT ── */}
      <div className="flex flex-col lg:flex-row min-h-full flex-1 relative">
        
        {/* Vertical split line */}
        {showPhase2 && (
          <div 
            className={`hidden lg:block absolute left-[45%] top-0 bottom-0 border-l ${!hasLoaded ? 'animate-slice-y' : ''}`}
            style={{ borderColor: 'rgba(56, 64, 106, 0.35)' }}
          />
        )}

        {/* ── LEFT 45% — Project Metadata Panel ── */}
        <div
          className="relative flex flex-col justify-start px-4 sm:px-6 lg:px-12 min-h-full flex-1 pt-16 sm:pt-20 lg:pt-32 pb-24 lg:pb-24 w-full lg:w-[45%]"
        >
          {showPhase2 && (
            <>
              {/* Top label & Nav dots */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 lg:left-12 right-4 sm:right-6 lg:right-12 flex items-center justify-between">
                <span className="label-caps">FEATURED /</span>
                <div className="flex items-center gap-2">
                  {PROJECTS.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => handleProjectChange(i)}
                      className="group relative"
                      aria-label={p.title}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i === activeIndex ? p.accentColor : '#cfccbb',
                          opacity: i === activeIndex ? 1 : 0.2,
                          transform: i === activeIndex ? 'scale(1.4)' : 'scale(1)',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div 
                key={projKey}
                className="flex-1 flex flex-col justify-start transition-opacity duration-300 ease-in-out"
                style={{ opacity: isFadingOut ? 0 : 1 }}
              >
                {/* 1. Header Cluster (Tight Spacing) */}
                <div className="flex flex-col gap-1 mb-4 sm:mb-8">
                  <AnimatedElement delay={0}>
                    <div className="font-mono text-2xs tracking-label uppercase text-[#a39d7b]">
                      0{project.wheelIndex + 1} / 0{PROJECTS.length}
                    </div>
                  </AnimatedElement>
                  <AnimatedElement delay={60}>
                    <div className="font-mono text-2xs tracking-label uppercase" style={{ color: project.accentColor }}>
                      {project.categories[0]}
                    </div>
                  </AnimatedElement>
                  <AnimatedElement delay={120} className="mt-1">
                    <div className="font-sans font-bold text-4xl text-parchment leading-none tracking-tight">
                      {project.title}
                    </div>
                  </AnimatedElement>
                  <AnimatedElement delay={180}>
                    <div className="font-mono text-sm text-parchment/60 tracking-tight mt-1">
                      {project.subtitle}
                    </div>
                  </AnimatedElement>
                </div>

                {/* 2. Project Metadata Cluster (Tight Spacing) */}
                <div className="flex flex-col gap-2 mb-6 sm:mb-10">
                  <AnimatedElement delay={240}>
                    <div className="flex items-center gap-2 font-mono text-2xs tracking-label text-parchment/50 uppercase">
                      <div className="w-3 h-px" style={{ backgroundColor: project.accentColor, opacity: 0.4 }} />
                      <span>{project.role}</span>
                    </div>
                  </AnimatedElement>
                  
                  <div className="flex flex-col gap-2 my-1">
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.map((t, i) => (
                        <AnimatedElement key={t} delay={280 + i * 30} className="inline-block">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-2xs font-mono tracking-label rounded-sm border cursor-default transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] border-[#38406a80] text-[#cfccbb8c] bg-transparent hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]"
                            style={{
                              '--accent': project.accentColor,
                              '--accent-bg': `${project.accentColor}10`,
                              textBox: 'trim-both cap alphabetic',
                            } as React.CSSProperties}
                          >
                            {t}
                          </span>
                        </AnimatedElement>
                      ))}
                    </div>

                    {/* Classification & Award Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.length >= 4 && (
                        <AnimatedElement delay={280 + project.tools.length * 30} className="inline-block">
                          <span
                            className="font-mono text-2xs tracking-label px-2 py-0.5 border rounded-sm"
                            style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}
                          >
                            [Design System Parity]
                          </span>
                        </AnimatedElement>
                      )}
                      {project.categories.includes('Full-Stack Engineering') && (
                        <AnimatedElement delay={280 + (project.tools.length + 1) * 30} className="inline-block">
                          <span
                            className="font-mono text-2xs tracking-label px-2 py-0.5 border rounded-sm"
                            style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}
                          >
                            [UI Engineering]
                          </span>
                        </AnimatedElement>
                      )}
                      {project.awards?.map((award, i) => (
                        <AnimatedElement key={award} delay={280 + (project.tools.length + 2 + i) * 30} className="inline-block">
                          <span
                            className="font-mono text-2xs tracking-label px-2 py-0.5 border rounded-sm"
                            style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}
                          >
                            ★ {award}
                          </span>
                        </AnimatedElement>
                      ))}
                    </div>
                  </div>

                  {project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {project.metrics.map((m, i) => (
                        <AnimatedElement key={m.label} delay={360 + i * 40}>
                          <div
                            className="flex flex-col gap-0.5 px-3 py-2 rounded-sm border border-[rgba(255,255,255,0.05)] bg-transparent hover:bg-[var(--accent-bg-hover)] transition-colors duration-400"
                            style={{ '--accent-bg-hover': `${project.accentColor}08` } as React.CSSProperties}
                          >
                            <span className="font-mono text-2xs tracking-label text-[#cfccbb4d] uppercase">{m.label}</span>
                            <span
                              className="font-mono text-sm font-medium"
                              style={{ color: project.accentColor }}
                            >
                              {m.value}
                            </span>
                          </div>
                        </AnimatedElement>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3 & 4. Description Block with Macro Margin above */}
                <div className="mb-8">
                  <NarrativePanel project={project} />
                </div>
              </div>

              {/* 5. Status badge & CTA — absolutely positioned at bottom-left */}
              <div 
                key={`status-${projKey}`}
                className="absolute bottom-4 sm:bottom-8 left-4 sm:left-6 lg:left-12 flex flex-wrap items-center gap-y-2 gap-x-3 transition-opacity duration-300 ease-in-out"
                style={{ opacity: isFadingOut ? 0 : 1 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: project.status === 'live' ? '#4ade80' : '#a39d7b',
                      boxShadow: project.status === 'live' ? '0 0 6px #4ade80' : 'none',
                    }}
                  />
                  <span className="label-caps">
                    {project.status === 'live' ? 'Live' : project.status === 'offline' ? 'Offline' : 'Archived'}
                  </span>
                </div>
                {project.url && (
                  <>
                    <div className="w-px h-3 bg-white/20 hidden xs:block" />
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-caps hover:text-parchment transition-colors underline underline-offset-2"
                    >
                      {project.url.replace('https://', '')} ↗
                    </a>
                  </>
                )}
                <div className="w-px h-3 bg-white/20" />
                <Link
                  to={`/work/${project.id}`}
                  className="label-caps transition-opacity hover:opacity-80 underline underline-offset-2"
                  style={{ color: project.accentColor }}
                >
                  Read Case Study →
                </Link>
              </div>

              {/* Left edge index line */}
              <div 
                key={`edge-${projKey}`}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-32 flex items-center transition-opacity duration-300 ease-in-out"
                style={{ opacity: isFadingOut ? 0 : 1 }}
              >
                <div
                  className={`w-px h-full transition-all duration-700 ${!hasLoaded ? 'animate-slice-y' : ''}`}
                  style={{ backgroundColor: project.accentColor, opacity: 0.6 }}
                />
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT 55% — Interactive Wheel ── */}
        <div
          className="relative flex items-center justify-center w-full lg:w-[55%] min-h-[40vh] lg:min-h-0 py-8 sm:py-12 lg:py-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(56,64,106,0.1) 0%, transparent 70%)' }}
        >
          {showPhase2 && (
            <>
          {/* Corner coordinate labels */}
          <div className={`hidden lg:block absolute top-6 left-6 label-caps opacity-40 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
            X:{Math.round(300 + Math.cos(activeIndex * (SNAP_INTERVAL * Math.PI / 180)) * 200).toString().padStart(4, '0')}
          </div>
          <div className={`hidden lg:block absolute top-6 right-6 label-caps opacity-40 text-right ${!hasLoaded ? 'animate-fade-down' : ''}`}>
            Y:{Math.round(300 + Math.sin(activeIndex * (SNAP_INTERVAL * Math.PI / 180)) * 200).toString().padStart(4, '0')}
          </div>
          <div className={`hidden lg:block absolute bottom-6 left-6 label-caps opacity-40 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
            θ:{(Math.round(activeIndex * SNAP_INTERVAL)).toString().padStart(3, '0')}°
          </div>
          <div className={`hidden lg:block absolute bottom-6 right-6 label-caps opacity-40 text-right ${!hasLoaded ? 'animate-fade-down' : ''}`}>
            R:276
          </div>
          </>
          )}

          {isPhase3 && (
            <>
              {/* Left Arrow Button */}
              <div className="absolute left-3 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20">
                <button
                  onClick={() => handleProjectChange((activeIndex - 1 + PROJECTS.length) % PROJECTS.length)}
                  className="p-2 md:p-3 rounded-full border bg-primary/40 backdrop-blur-md transition-all duration-300 group focus:outline-none hover:bg-surface/50 active:scale-95 animate-arrow-left-in"
                  style={{
                    borderColor: `${activeProject.accentColor}33`,
                    color: activeProject.accentColor,
                    boxShadow: '0 0 0px transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = activeProject.accentColor
                    e.currentTarget.style.boxShadow = `0 0 12px ${activeProject.accentColor}33`
                    e.currentTarget.style.color = '#cfccbb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${activeProject.accentColor}33`
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.color = activeProject.accentColor
                  }}
                  aria-label="Previous Project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              </div>

              {/* Right Arrow Button */}
              <div className="absolute right-3 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20">
                <button
                  onClick={() => handleProjectChange((activeIndex + 1) % PROJECTS.length)}
                  className="p-2 md:p-3 rounded-full border bg-primary/40 backdrop-blur-md transition-all duration-300 group focus:outline-none hover:bg-surface/50 active:scale-95 animate-arrow-right-in"
                  style={{
                    borderColor: `${activeProject.accentColor}33`,
                    color: activeProject.accentColor,
                    boxShadow: '0 0 0px transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = activeProject.accentColor
                    e.currentTarget.style.boxShadow = `0 0 12px ${activeProject.accentColor}33`
                    e.currentTarget.style.color = '#cfccbb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${activeProject.accentColor}33`
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.color = activeProject.accentColor
                  }}
                  aria-label="Next Project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Wheel SVG container */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 'var(--wheel-size)', height: 'var(--wheel-size)' }}
          >
            <WheelSelector
              onProjectChange={handleProjectChange}
              activeIndex={activeIndex}
            />
          </div>

          {/* Active project accent glow behind wheel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${activeProject.accentColor}08 0%, transparent 65%)`,
              transition: 'background 0.8s ease',
            }}
          />
        </div>
      </div>
    </section>
  )
}
