// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE A — Formal Full Case Study Page
// Route: /work/:slug
// Layout: 30% sticky metadata sidebar | 70% scrolling editorial content
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'


// ── Thin hairline separator with section label ─────────────────────────────────
function SectionRule({
  index,
  label,
  accentColor,
  mounted,
  mountDelay,
}: {
  index: string
  label: string
  accentColor: string
  mounted: boolean
  mountDelay: number
}) {
  return (
    <div
      className="flex items-center gap-4 mb-8 pb-3"
      style={{
        borderBottom: '1px solid rgba(56,64,106,0.45)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.5s ease ${mountDelay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${mountDelay}ms`,
      }}
    >
      <span className="font-mono text-2xs text-parchment/15 tabular-nums">{index}</span>
      <div className="w-4 h-px" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
      <span className="font-mono text-2xs tracking-label uppercase" style={{ color: `${accentColor}90` }}>
        {label}
      </span>
    </div>
  )
}

// ── Paragraph with left accent rule ───────────────────────────────────────────
function EditorialParagraph({
  text,
  accentColor,
  mounted,
  mountDelay,
}: {
  text: string
  accentColor: string
  mounted: boolean
  mountDelay: number
}) {
  return (
    <div
      className="flex gap-5 py-4"
      style={{
        borderBottom: '1px solid rgba(56,64,106,0.18)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.5s ease ${mountDelay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${mountDelay}ms`,
      }}
    >
      <div
        className="w-px flex-shrink-0 self-stretch mt-1"
        style={{ backgroundColor: accentColor, opacity: 0.2 }}
      />
      <p className="font-mono text-xs text-parchment/55 leading-[1.85] tracking-tight">{text}</p>
    </div>
  )
}

// ── Architecture spec box ──────────────────────────────────────────────────────
function SpecBox({
  children,
  stamp,
  mounted,
  mountDelay,
}: {
  children: React.ReactNode
  accentColor?: string
  stamp: string
  mounted: boolean
  mountDelay: number
}) {
  return (
    <div
      className="relative"
      style={{
        border: `1px solid rgba(163,157,123,0.18)`,
        backgroundColor: 'rgba(28,32,53,0.6)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.5s ease ${mountDelay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${mountDelay}ms`,
      }}
    >
      {/* Corner bracket — top left */}
      <svg
        viewBox="0 0 16 16"
        className="absolute top-0 left-0 w-4 h-4"
        aria-hidden="true"
      >
        <path d="M0 10 L0 0 L10 0" fill="none" stroke="#a39d7b" strokeWidth="0.8" opacity="0.4" />
      </svg>
      {/* Corner bracket — bottom right */}
      <svg
        viewBox="0 0 16 16"
        className="absolute bottom-0 right-0 w-4 h-4"
        aria-hidden="true"
      >
        <path d="M16 6 L16 16 L6 16" fill="none" stroke="#a39d7b" strokeWidth="0.8" opacity="0.4" />
      </svg>

      {/* Stamp */}
      <div
        className="absolute top-2 right-3 font-mono text-2xs tracking-label"
        style={{ color: '#a39d7b', opacity: 0.3 }}
      >
        {stamp}
      </div>

      <div className="px-6 pt-8 pb-6">{children}</div>
    </div>
  )
}

// ── Metric callout ─────────────────────────────────────────────────────────────
function MetricBlock({
  label,
  value,
  accentColor,
}: {
  label: string
  value: string
  accentColor: string
}) {
  return (
    <div
      className="flex flex-col gap-0.5 px-3 py-3 border"
      style={{ borderColor: `${accentColor}25`, backgroundColor: `${accentColor}05` }}
    >
      <span className="font-mono text-2xs tracking-label text-parchment/25 uppercase">{label}</span>
      <span
        className="font-mono font-semibold leading-none"
        style={{ color: accentColor, fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', letterSpacing: '-0.03em' }}
      >
        {value}
      </span>
    </div>
  )
}

// ── Tool chip ──────────────────────────────────────────────────────────────────
function ToolChip({ label, accentColor }: { label: string; accentColor: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 font-mono text-2xs tracking-label rounded-sm border transition-colors duration-200"
      style={{ borderColor: `${accentColor}35`, color: `${accentColor}CC`, backgroundColor: `${accentColor}06` }}
    >
      {label}
    </span>
  )
}

// ── Project-to-project navigation ─────────────────────────────────────────────
function ProjectNav({ current }: { current: number }) {
  const prev = PROJECTS[current - 1]
  const next = PROJECTS[current + 1]
  return (
    <div
      className="flex items-center justify-between pt-10 mt-10"
      style={{ borderTop: '1px solid rgba(56,64,106,0.3)' }}
    >
      {prev ? (
        <Link to={`/work/${prev.id}`} className="group flex items-center gap-3">
          <span className="font-mono text-sm text-parchment/25 group-hover:text-parchment/60 transition-colors">
            ←
          </span>
          <div>
            <p className="font-mono text-2xs tracking-label text-parchment/20 uppercase">Previous</p>
            <p
              className="font-sans font-semibold text-parchment/45 group-hover:text-parchment transition-colors duration-200"
              style={{ letterSpacing: '-0.02em' }}
            >
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={`/work/${next.id}`} className="group flex items-center gap-3 text-right">
          <div>
            <p className="font-mono text-2xs tracking-label text-parchment/20 uppercase">Next</p>
            <p
              className="font-sans font-semibold text-parchment/45 group-hover:text-parchment transition-colors duration-200"
              style={{ letterSpacing: '-0.02em' }}
            >
              {next.title}
            </p>
          </div>
          <span className="font-mono text-sm text-parchment/25 group-hover:text-parchment/60 transition-colors">
            →
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}

// ── Sticky left metadata sidebar (30%) ─────────────────────────────────────────
function MetadataSidebar({
  project,
  projectIndex,
  mounted,
}: {
  project: ReturnType<typeof PROJECTS.find> & object
  projectIndex: number
  mounted: boolean
}) {
  if (!project) return null
  return (
    <aside
      className="lg:w-[30%] px-6 lg:px-10 py-10 flex-shrink-0"
      style={{
        borderRight: '1px solid rgba(56,64,106,0.3)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'opacity 0.6s ease 80ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) 80ms',
      }}
    >
      <div className="sticky top-16 space-y-8">

        {/* Index counter */}
        <div className="flex items-baseline gap-2">
          <span
            className="font-mono font-semibold leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: project.accentColor, letterSpacing: '-0.05em', opacity: 0.9 }}
          >
            {String(projectIndex + 1).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs text-parchment/20">/ {String(PROJECTS.length).padStart(2, '0')}</span>
        </div>

        {/* Project title */}
        <div>
          <h2
            className="font-sans font-black text-parchment leading-none mb-1"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', letterSpacing: '-0.04em' }}
          >
            {project.title}
          </h2>
          <p className="font-mono text-2xs text-parchment/35 leading-relaxed mt-2">{project.subtitle}</p>
        </div>

        {/* Hairline */}
        <div className="h-px" style={{ backgroundColor: 'rgba(56,64,106,0.4)' }} />

        {/* Role */}
        <div>
          <p className="font-mono text-2xs tracking-label text-parchment/25 uppercase mb-1.5">Role</p>
          <p className="font-mono text-xs text-parchment/55 leading-relaxed">{project.role}</p>
        </div>

        {/* Tools */}
        <div>
          <p className="font-mono text-2xs tracking-label text-parchment/25 uppercase mb-2.5">Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tools.map((tool) => (
              <ToolChip key={tool} label={tool} accentColor={project.accentColor} />
            ))}
          </div>
        </div>

        {/* Metrics */}
        {project.metrics.length > 0 && (
          <div>
            <p className="font-mono text-2xs tracking-label text-parchment/25 uppercase mb-2.5">Impact</p>
            <div className="grid grid-cols-2 gap-1.5">
              {project.metrics.map((m) => (
                <MetricBlock key={m.label} label={m.label} value={m.value} accentColor={project.accentColor} />
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {project.awards && project.awards.length > 0 && (
          <div>
            <p className="font-mono text-2xs tracking-label text-parchment/25 uppercase mb-2.5">Recognition</p>
            <div className="space-y-1.5">
              {project.awards.map((award) => (
                <div
                  key={award}
                  className="flex items-center gap-2.5 px-3 py-2 border"
                  style={{ borderColor: `${project.accentColor}25`, backgroundColor: `${project.accentColor}05` }}
                >
                  <svg viewBox="0 0 10 10" className="w-3 h-3 flex-shrink-0" style={{ color: project.accentColor }}>
                    <polygon points="5,0 6.2,3.8 10,3.8 6.9,6.2 8.1,10 5,7.5 1.9,10 3.1,6.2 0,3.8 3.8,3.8" fill="currentColor" />
                  </svg>
                  <span className="font-mono text-2xs tracking-label" style={{ color: project.accentColor }}>
                    {award}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domains */}
        <div>
          <p className="font-mono text-2xs tracking-label text-parchment/25 uppercase mb-2.5">Domains</p>
          <div className="flex flex-wrap gap-1.5">
            {project.categories.map((cat) => (
              <span
                key={cat}
                className="font-mono text-2xs px-2 py-0.5 border rounded-sm"
                style={{ borderColor: 'rgba(56,64,106,0.45)', color: 'rgba(207,204,187,0.4)' }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Hairline */}
        <div className="h-px" style={{ backgroundColor: 'rgba(56,64,106,0.4)' }} />

        {/* Status + CTA */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: project.status === 'live' ? '#4ade80' : '#a39d7b',
                boxShadow: project.status === 'live' ? '0 0 6px #4ade8088' : 'none',
              }}
            />
            <span className="font-mono text-2xs tracking-label text-parchment/35 uppercase">
              {project.status === 'live' ? 'Live Product' : project.status === 'coming-soon' ? 'Coming Soon' : 'Archived'}
            </span>
          </div>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full px-4 py-3 border transition-all duration-300"
              style={{ borderColor: `${project.accentColor}25` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${project.accentColor}70`
                e.currentTarget.style.backgroundColor = `${project.accentColor}08`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${project.accentColor}25`
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span
                className="font-mono text-2xs tracking-label uppercase"
                style={{ color: project.accentColor }}
              >
                Visit Live Product
              </span>
              <span className="font-mono text-xs text-parchment/25 group-hover:text-parchment/60 transition-colors">
                ↗
              </span>
            </a>
          )}
        </div>
      </div>
    </aside>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProjectCaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  const project = PROJECTS.find((p) => p.id === slug)
  const projectIndex = project ? PROJECTS.indexOf(project) : 0

  useEffect(() => {
    window.scrollTo(0, 0)
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [slug])

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-2xs tracking-label text-parchment/30">404 — PROJECT NOT FOUND</p>
          <Link to="/" className="font-mono text-xs text-gold/70 hover:text-gold transition-colors">
            ← Return Home
          </Link>
        </div>
      </div>
    )
  }

  const cs = project.caseStudy
  const acc = project.accentColor

  return (
    <div className="min-h-screen" style={{ paddingTop: '48px' }}>

      {/* ── MASTHEAD ─────────────────────────────────────────────────────────── */}
      <div
        className="relative px-6 lg:px-12 py-8"
        style={{
          borderBottom: '1px solid rgba(56,64,106,0.4)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.5s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Full-width project color top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${acc} 35%, ${acc} 65%, transparent 100%)`,
            opacity: 0.55,
          }}
        />

        {/* Back + index row */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5"
          >
            <svg viewBox="0 0 16 10" className="w-4 h-4 text-parchment/25 group-hover:text-parchment/60 transition-colors">
              <path d="M10 1 L2 5 L10 9" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="2" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-2xs tracking-label text-parchment/30 group-hover:text-parchment/60 uppercase transition-colors">
              Work
            </span>
          </button>

          <span className="font-mono text-2xs text-parchment/15 tabular-nums">
            {String(projectIndex + 1).padStart(2, '0')} — {String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>

        {/* Category tags + status */}
        <div className="flex items-center gap-3 mb-4">
          {project.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="font-mono text-2xs tracking-label uppercase"
              style={{ color: acc, opacity: 0.75 }}
            >
              {cat}
            </span>
          ))}
          {project.status === 'live' && (
            <>
              <div className="w-px h-3 bg-accent/40" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #34d399' }} />
                <span className="font-mono text-2xs tracking-label text-parchment/30">Live</span>
              </div>
            </>
          )}
        </div>

        {/* Display title */}
        <h1
          className="font-sans font-black text-parchment leading-none mb-3"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.05em' }}
        >
          {project.title}
        </h1>

        {/* Subtitle */}
        <p
          className="font-mono text-sm leading-relaxed max-w-2xl"
          style={{ color: `${acc}90` }}
        >
          {project.subtitle}
        </p>

        {/* Role + URL */}
        <div className="flex flex-wrap items-center gap-4 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-px" style={{ backgroundColor: acc, opacity: 0.35 }} />
            <span className="font-mono text-2xs tracking-label text-parchment/35 uppercase">{project.role}</span>
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-2xs tracking-label uppercase transition-colors duration-200"
              style={{ color: `${acc}70` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = acc)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${acc}70`)}
            >
              {project.url.replace('https://', '')} ↗
            </a>
          )}
        </div>
      </div>

      {/* ── BODY — 30/70 column split ──────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row">

        {/* ── LEFT 30% — Sticky metadata sidebar ──────────────────────────────── */}
        <MetadataSidebar project={project} projectIndex={projectIndex} mounted={mounted} />

        {/* ── RIGHT 70% — Scrolling editorial content ─────────────────────────── */}
        <div
          className="flex-1 px-6 lg:px-14 py-12 space-y-16"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.65s ease 120ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) 120ms',
          }}
        >
          {/* §01 Executive Summary */}
          {cs?.executiveSummary && (
            <section>
              <SectionRule index="01" label="Executive Summary" accentColor={acc} mounted={mounted} mountDelay={180} />
              <p
                className="font-sans font-medium text-parchment leading-relaxed"
                style={{
                  fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                  letterSpacing: '-0.01em',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.55s ease 240ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) 240ms',
                }}
              >
                {cs.executiveSummary}
              </p>
            </section>
          )}

          {/* §02 Problem Space */}
          {cs?.problemSpace && cs.problemSpace.length > 0 && (
            <section>
              <SectionRule index="02" label="Problem Space & Scope" accentColor={acc} mounted={mounted} mountDelay={300} />
              <div>
                {cs.problemSpace.map((para, i) => (
                  <EditorialParagraph
                    key={i}
                    text={para}
                    accentColor={acc}
                    mounted={mounted}
                    mountDelay={360 + i * 80}
                  />
                ))}
              </div>
            </section>
          )}

          {/* §03 System Architecture */}
          {cs?.systemArchitecture && cs.systemArchitecture.length > 0 && (
            <section>
              <SectionRule
                index="03"
                label="System Architecture & Design Engineering"
                accentColor={acc}
                mounted={mounted}
                mountDelay={480}
              />

              {/* Stack chips row */}
              <div
                className="flex flex-wrap gap-1.5 mb-6"
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: 'opacity 0.5s ease 540ms',
                }}
              >
                {project.tools.map((tool) => (
                  <ToolChip key={tool} label={tool} accentColor={acc} />
                ))}
              </div>

              {/* Spec box wrapper */}
              <SpecBox accentColor={acc} stamp="[ARCH // DESIGN-ENG]" mounted={mounted} mountDelay={560}>
                <div>
                  {cs.systemArchitecture.map((para, i) => (
                    <EditorialParagraph
                      key={i}
                      text={para}
                      accentColor={acc}
                      mounted={mounted}
                      mountDelay={580 + i * 80}
                    />
                  ))}
                </div>
              </SpecBox>
            </section>
          )}

          {/* §04 Validation & Impact */}
          {cs?.validation && cs.validation.length > 0 && (
            <section>
              <SectionRule index="04" label="Validation & Impact" accentColor={acc} mounted={mounted} mountDelay={700} />

              {/* Metric callouts row */}
              {project.metrics.length > 0 && (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 0.5s ease 760ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) 760ms',
                  }}
                >
                  {project.metrics.map((m) => (
                    <MetricBlock key={m.label} label={m.label} value={m.value} accentColor={acc} />
                  ))}
                </div>
              )}

              <div>
                {cs.validation.map((para, i) => (
                  <EditorialParagraph
                    key={i}
                    text={para}
                    accentColor={acc}
                    mounted={mounted}
                    mountDelay={780 + i * 80}
                  />
                ))}
              </div>
            </section>
          )}

          {/* §05 Roadmap */}
          {cs?.roadmap && (
            <section>
              <SectionRule index="05" label="Roadmap" accentColor={acc} mounted={mounted} mountDelay={900} />
              <div
                className="px-6 py-5 border-l-2"
                style={{
                  borderColor: `${acc}60`,
                  backgroundColor: `${acc}06`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 0.5s ease 960ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) 960ms',
                }}
              >
                <p className="font-mono text-xs text-parchment/55 leading-[1.85] italic">{cs.roadmap}</p>
              </div>
            </section>
          )}

          {/* No case study fallback */}
          {!cs && (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
              <div
                className="w-12 h-12 border rounded-sm flex items-center justify-center"
                style={{ borderColor: `${acc}30` }}
              >
                <span className="font-mono text-xl" style={{ color: `${acc}60` }}>◈</span>
              </div>
              <p className="font-mono text-2xs tracking-label text-parchment/30 uppercase">Case Study In Progress</p>
              <p className="font-mono text-xs text-parchment/20 max-w-xs leading-relaxed">
                {project.narrative[0]}
              </p>
            </div>
          )}

          {/* Project navigation */}
          <ProjectNav current={projectIndex} />
        </div>
      </div>
    </div>
  )
}
