import React, { useState, useCallback, useEffect, useRef } from 'react'
import { PROJECTS } from '../data/portfolio'
import type { Project } from '../types/portfolio'
import WheelSelector from './WheelSelector'
import { SNAP_INTERVAL } from '../utils/wheelMath'

// ── Staggered text cascade on project change ───────────────────────────────
interface MetadataLine {
  text: string
  delay: number
  size: 'label' | 'body' | 'meta' | 'metric'
  color?: string
}

function buildMetadataLines(proj: Project): MetadataLine[] {
  return [
    { text: `0${proj.wheelIndex + 1} / 0${PROJECTS.length}`, delay: 0, size: 'label' },
    { text: proj.categories[0].toUpperCase(), delay: 40, size: 'label', color: proj.accentColor },
    { text: proj.title, delay: 80, size: 'body' },
    { text: proj.subtitle, delay: 120, size: 'meta' },
    { text: '', delay: 150, size: 'meta' },
    { text: proj.role, delay: 190, size: 'meta' },
    { text: '', delay: 220, size: 'meta' },
    ...proj.tools.map((t, i) => ({ text: t, delay: 260 + i * 20, size: 'meta' as const })),
    { text: '', delay: 320, size: 'meta' },
    ...proj.metrics.map((m, i) => ({
      text: `${m.label}: ${m.value}`,
      delay: 360 + i * 25,
      size: 'metric' as const,
      color: proj.accentColor,
    })),
  ]
}

// ── Single animated line ───────────────────────────────────────────────────
interface AnimatedLineProps {
  line: MetadataLine
  projKey: string
}

function AnimatedLine({ line, projKey }: AnimatedLineProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(false)
    if (line.text === '') return
    const t = setTimeout(() => setShow(true), line.delay)
    return () => clearTimeout(t)
  }, [projKey, line.delay])

  if (line.text === '') return <div className="h-3" />

  const baseStyle: React.CSSProperties = {
    transform: show ? 'translateY(0)' : 'translateY(10px)',
    opacity: show ? 1 : 0,
    transition: `transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease`,
    willChange: 'transform, opacity',
  }

  if (line.size === 'label') {
    return (
      <div className="overflow-hidden">
        <div style={{ ...baseStyle, color: line.color ?? '#a39d7b' }}
          className="font-mono text-2xs tracking-label uppercase">
          {line.text}
        </div>
      </div>
    )
  }

  if (line.size === 'body') {
    return (
      <div className="overflow-hidden">
        <div style={baseStyle}
          className="font-sans font-bold text-2xl text-parchment leading-tight tracking-tight">
          {line.text}
        </div>
      </div>
    )
  }

  if (line.size === 'metric') {
    return (
      <div className="overflow-hidden">
        <div style={{ ...baseStyle, color: line.color ?? '#cfccbb' }}
          className="font-mono text-xs tracking-wide">
          › {line.text}
        </div>
      </div>
    )
  }

  // meta
  return (
    <div className="overflow-hidden">
      <div style={baseStyle}
        className="font-mono text-xs text-parchment/50 tracking-tight">
        {line.text}
      </div>
    </div>
  )
}

// ── Narrative text panel ───────────────────────────────────────────────────
interface NarrativePanelProps {
  project: Project
  projKey: string
}

function NarrativePanel({ project, projKey }: NarrativePanelProps) {
  const [lines, setLines] = useState<boolean[]>(Array(project.narrative.length).fill(false))

  useEffect(() => {
    setLines(Array(project.narrative.length).fill(false))
    project.narrative.forEach((_, i) => {
      const t = setTimeout(() => {
        setLines(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, 600 + i * 80)
      return () => clearTimeout(t)
    })
  }, [projKey, project.narrative.length])

  return (
    <div className="space-y-2 mt-4">
      {project.narrative.map((para, i) => (
        <div key={i} className="overflow-hidden">
          <p
            className="font-mono text-xs text-parchment/45 leading-relaxed"
            style={{
              transform: lines[i] ? 'translateY(0)' : 'translateY(8px)',
              opacity: lines[i] ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
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
  const [projKey, setProjKey] = useState('proj-0')
  const keyRef = useRef(0)

  const handleProjectChange = useCallback((index: number) => {
    setActiveIndex(index)
    keyRef.current += 1
    setProjKey(`proj-${index}-${keyRef.current}`)
  }, [])

  const project = PROJECTS[activeIndex]
  const metaLines = buildMetadataLines(project)

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', marginTop: 0, paddingTop: '48px' }}
    >
      {/* ── Horizontal hairline accent ── */}
      <div
        className="absolute left-0 right-0 top-[48px] border-t"
        style={{ borderColor: 'rgba(56, 64, 106, 0.4)' }}
      />

      {/* ── SPLIT LAYOUT ── */}
      <div className="flex h-full">

        {/* ── LEFT 45% — Project Metadata Panel ── */}
        <div
          className="relative flex flex-col justify-center px-8 lg:px-12"
          style={{ width: '45%', borderRight: '1px solid rgba(56, 64, 106, 0.35)' }}
        >
          {/* Top label */}
          <div className="absolute top-6 left-8 lg:left-12">
            <span className="label-caps">WORK /</span>
          </div>

          {/* Project navigation dots */}
          <div className="absolute top-6 right-8 flex items-center gap-2">
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

          {/* ── Animated metadata cascade ── */}
          <div className="space-y-1 mb-6">
            {metaLines.map((line, i) => (
              <AnimatedLine key={`${projKey}-line-${i}`} line={line} projKey={projKey} />
            ))}
          </div>

          {/* ── Narrative text ── */}
          <NarrativePanel key={`${projKey}-narrative`} project={project} projKey={projKey} />

          {/* ── Tags (Awards & Classifications) ── */}
          {(project.tools.length >= 4 || project.categories.includes('Full-Stack Engineering') || (project.awards && project.awards.length > 0)) && (
            <div className="flex flex-wrap gap-2 mt-5">
              {project.tools.length >= 4 && (
                <span
                  className="project-badge"
                  style={{ borderColor: `${project.accentColor}40`, color: project.accentColor }}
                >
                  [Design System Parity]
                </span>
              )}
              {project.categories.includes('Full-Stack Engineering') && (
                <span
                  className="project-badge"
                  style={{ borderColor: `${project.accentColor}40`, color: project.accentColor }}
                >
                  [UI Engineering]
                </span>
              )}
              {project.awards?.map((award) => (
                <span
                  key={award}
                  className="project-badge"
                  style={{ borderColor: `${project.accentColor}40`, color: project.accentColor }}
                >
                  <svg viewBox="0 0 8 8" className="w-1.5 h-1.5">
                    <polygon points="4,0 5,3 8,3 5.5,5 6.5,8 4,6 1.5,8 2.5,5 0,3 3,3" fill="currentColor" />
                  </svg>
                  {award}
                </span>
              ))}
            </div>
          )}

          {/* ── Status badge ── */}
          <div className="absolute bottom-8 left-8 lg:left-12 flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: project.status === 'live' ? '#4ade80' : '#a39d7b',
                boxShadow: project.status === 'live' ? '0 0 6px #4ade80' : 'none',
              }}
            />
            <span className="label-caps">
              {project.status === 'live' ? 'Live' : project.status === 'coming-soon' ? 'Coming Soon' : 'Archived'}
            </span>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps hover:text-parchment transition-colors ml-2 underline underline-offset-2"
              >
                {project.url.replace('https://', '')} ↗
              </a>
            )}
          </div>

          {/* Left edge index line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-32 flex items-center">
            <div
              className="w-px h-full transition-all duration-700"
              style={{ backgroundColor: project.accentColor, opacity: 0.6 }}
            />
          </div>
        </div>

        {/* ── RIGHT 55% — Interactive Wheel ── */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: '55%', background: 'radial-gradient(ellipse at center, rgba(56,64,106,0.1) 0%, transparent 70%)' }}
        >
          {/* Corner coordinate labels */}
          <div className="absolute top-6 left-6 label-caps opacity-40">
            X:{Math.round(300 + Math.cos(activeIndex * (SNAP_INTERVAL * Math.PI / 180)) * 200).toString().padStart(4, '0')}
          </div>
          <div className="absolute top-6 right-6 label-caps opacity-40 text-right">
            Y:{Math.round(300 + Math.sin(activeIndex * (SNAP_INTERVAL * Math.PI / 180)) * 200).toString().padStart(4, '0')}
          </div>
          <div className="absolute bottom-6 left-6 label-caps opacity-40">
            θ:{(Math.round(activeIndex * SNAP_INTERVAL)).toString().padStart(3, '0')}°
          </div>
          <div className="absolute bottom-6 right-6 label-caps opacity-40 text-right">
            R:276
          </div>

          {/* Wheel SVG container */}
          <div
            className="relative"
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
              background: `radial-gradient(ellipse at center, ${project.accentColor}08 0%, transparent 65%)`,
              transition: 'background 0.8s ease',
            }}
          />
        </div>
      </div>
    </section>
  )
}
