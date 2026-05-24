import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS, EXPERIMENTS } from '../data/portfolio'
import type { Project, Experiment } from '../types/portfolio'

// ─── Spring hover hook ────────────────────────────────────────────────────────
// Returns { isHovered, handlers } — drives spring scale/opacity transitions
function useSpringHover() {
  const [hovered, setHovered] = useState(false)
  return {
    isHovered: hovered,
    handlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  }
}

// ─── SVG border-draw component ────────────────────────────────────────────────
// Animates a fine perimeter line on hover using stroke-dashoffset
function DrawBorder({ active }: { active: boolean }) {
  // Total perimeter of a rect is 2*(w+h) — we use 100% via viewBox so ~400 units
  const PERIM = 400
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <rect
        x="0.5" y="0.5" width="99" height="99"
        fill="none"
        stroke="#38406a"
        strokeWidth="0.8"
        strokeDasharray={PERIM}
        strokeDashoffset={active ? 0 : PERIM}
        style={{
          transition: active
            ? 'stroke-dashoffset 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'stroke-dashoffset 0.35s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      />
    </svg>
  )
}

// ─── Tech tag chip ────────────────────────────────────────────────────────────
function TechTag({ label, accentColor, delay }: { label: string; accentColor: string; delay: number }) {
  const { isHovered, handlers } = useSpringHover()
  return (
    <span
      {...handlers}
      className="inline-flex items-center gap-1 px-2 py-0.5 text-2xs font-mono tracking-label rounded-sm border cursor-default transition-all"
      style={{
        borderColor: isHovered ? accentColor : 'rgba(56,64,106,0.5)',
        color: isHovered ? accentColor : 'rgba(207,204,187,0.55)',
        backgroundColor: isHovered ? `${accentColor}10` : 'transparent',
        transitionDuration: '220ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${delay}ms`,
        textBox: 'trim-both cap alphabetic',
      } as React.CSSProperties}
    >
      {label}
    </span>
  )
}

// ─── Case Study Card (Template Unit A) ────────────────────────────────────────
function CaseStudyCard({ project }: { project: Project }) {
  const { isHovered, handlers } = useSpringHover()
  const [tagVisible, setTagVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const onEnter = useCallback(() => {
    handlers.onMouseEnter()
    timerRef.current = setTimeout(() => setTagVisible(true), 80)
  }, [handlers])

  const onLeave = useCallback(() => {
    handlers.onMouseLeave()
    clearTimeout(timerRef.current)
    setTagVisible(false)
  }, [handlers])

  const engineering = project.categories.includes('Full-Stack Engineering')
  const isDesignSystem = project.tools.length >= 4

  return (
    <div
      className="relative flex flex-col h-full group cursor-pointer overflow-hidden border border-transparent"
      style={{
        background: isHovered
          ? `linear-gradient(135deg, #252a44 0%, #1c2035 100%)`
          : 'linear-gradient(135deg, #1e2238 0%, #1c2035 100%)',
        borderColor: isHovered ? `${project.accentColor}30` : 'rgba(56,64,106,0.3)',
        transform: isHovered ? 'scale(1.015)' : 'scale(1)',
        boxShadow: isHovered ? `0 24px 64px -12px ${project.accentColor}18, 0 0 0 1px ${project.accentColor}15` : '0 4px 24px -4px rgba(0,0,0,0.4)',
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease, background 0.4s ease',
        willChange: 'transform',
        borderRadius: '2px',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${project.accentColor} 50%, transparent 100%)`,
          opacity: isHovered ? 0.8 : 0.2,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Index + category header strip */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-accent/15">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xs tracking-label text-parchment/25">
            {String(project.wheelIndex + 1).padStart(2, '0')}
          </span>
          <div className="w-3 h-px bg-accent/30" />
          {project.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="font-mono text-2xs tracking-label uppercase"
              style={{ color: project.accentColor, opacity: 0.8 }}
            >
              {cat}
            </span>
          ))}
        </div>
        {project.status === 'live' && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #34d399' }} />
            <span className="font-mono text-2xs tracking-label text-parchment/30">Live</span>
          </div>
        )}
        {project.status === 'coming-soon' && (
          <span className="font-mono text-2xs tracking-label text-gold/50">Coming Soon</span>
        )}
      </div>

      {/* Main body */}
      <div className="flex-1 flex flex-col gap-4 p-6">

        {/* Title block */}
        <div>
          <h2
            className="font-sans font-black text-parchment leading-none mb-2"
            style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              letterSpacing: '-0.04em',
              color: isHovered ? '#fff' : '#cfccbb',
              transition: 'color 0.3s ease',
            }}
          >
            {project.title}
          </h2>
          <p
            className="font-mono text-xs leading-relaxed"
            style={{ color: `${project.accentColor}99` }}
          >
            {project.subtitle}
          </p>
        </div>

        {/* Role */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-px" style={{ backgroundColor: project.accentColor, opacity: 0.4 }} />
          <span className="font-mono text-2xs tracking-label text-parchment/40 uppercase">{project.role}</span>
        </div>

        {/* Full narrative */}
        <div className="space-y-2.5 flex-1">
          {project.narrative.map((para, i) => (
            <p
              key={i}
              className="font-mono text-xs text-parchment/50 leading-relaxed"
              style={{
                opacity: isHovered ? (i === 0 ? 0.75 : 0.5) : 0.45,
                transform: isHovered ? 'translateY(0)' : 'translateY(2px)',
                transition: `opacity 0.4s ease ${i * 40}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 40}ms`,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-0.5 px-3 py-2 rounded-sm border border-accent/20"
              style={{
                backgroundColor: isHovered ? `${project.accentColor}08` : 'transparent',
                transition: 'background-color 0.4s ease',
              }}
            >
              <span className="font-mono text-2xs tracking-label text-parchment/30 uppercase">{m.label}</span>
              <span
                className="font-mono text-sm font-medium"
                style={{ color: project.accentColor }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Tech stack + engineering badges */}
        <div className="space-y-2">
          {/* Staggered reveal tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tools.map((tool, i) => (
              <TechTag key={tool} label={tool} accentColor={project.accentColor} delay={i * 15} />
            ))}
          </div>

          {/* Engineering classification tags — appear on hover */}
          <div
            className="flex flex-wrap gap-1.5"
            style={{
              opacity: tagVisible ? 1 : 0,
              transform: tagVisible ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {isDesignSystem && (
              <span className="font-mono text-2xs tracking-label px-2 py-0.5 border rounded-sm"
                style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}>
                [Design System Parity]
              </span>
            )}
            {engineering && (
              <span className="font-mono text-2xs tracking-label px-2 py-0.5 border rounded-sm"
                style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}>
                [UI Engineering]
              </span>
            )}
            {project.awards?.map((award) => (
              <span key={award} className="font-mono text-2xs tracking-label px-2 py-0.5 border rounded-sm"
                style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}>
                ★ {award}
              </span>
            ))}
          </div>
        </div>

        {/* CTA link */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link self-start mt-auto"
          >
            <span className="relative font-mono text-xs tracking-label uppercase"
              style={{ color: project.accentColor }}>
              {project.url.replace('https://', '')}
              <span
                className="absolute -bottom-px left-0 right-0 h-px"
                style={{
                  background: project.accentColor,
                  transform: 'scaleX(0)',
                  transformOrigin: 'center',
                  transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
                }}
              />
            </span>
            <style>{`a:hover .link-underline { transform: scaleX(1) !important; }`}</style>
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Experiment Cell (Template Unit B) ────────────────────────────────────────
const EXPERIMENT_GLYPHS = ['◈', '⬡', '◉', '⬢', '◎', '⬟', '◐']

function ExperimentCell({ exp, index }: { exp: Experiment; index: number }) {
  const { isHovered, handlers } = useSpringHover()

  return (
    <div
      className="relative flex flex-col justify-between p-4 min-h-[200px] h-full cursor-pointer overflow-hidden"
      style={{
        background: isHovered ? '#1e2238' : '#1a1e30',
        transition: 'background 0.4s cubic-bezier(0.22,1,0.36,1)',
        borderRadius: '2px',
      }}
      {...handlers}
    >
      {/* SVG border draw on hover */}
      <DrawBorder active={isHovered} />

      {/* Glyph — center focal point */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-mono select-none"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: '#cfccbb',
            opacity: isHovered ? 0.06 : 0.04,
            transform: isHovered ? 'scale(1.1) rotate(15deg)' : 'scale(1) rotate(0deg)',
            transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {EXPERIMENT_GLYPHS[index % EXPERIMENT_GLYPHS.length]}
        </span>
      </div>

      {/* Top metadata */}
      <div className="relative z-10">
        <p
          className="font-mono text-2xs tracking-label uppercase"
          style={{
            color: isHovered ? '#cfccbb' : 'rgba(207,204,187,0.3)',
            transition: 'color 0.3s ease',
          }}
        >
          {exp.contextLabel}
        </p>
        <div
          className="mt-1 text-2xs font-mono"
          style={{
            color: 'rgba(207,204,187,0.15)',
            transition: 'color 0.3s ease 60ms',
          }}
        >
          [{String(index + 1).padStart(2, '0')}_{exp.year}]
        </div>
      </div>

      {/* Bottom label */}
      <div className="relative z-10">
        <p
          className="font-sans font-medium text-sm leading-tight"
          style={{
            color: isHovered ? '#cfccbb' : 'rgba(207,204,187,0.5)',
            transform: isHovered ? 'translateY(0)' : 'translateY(2px)',
            transition: 'color 0.3s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {exp.title}
        </p>
        <p
          className="font-mono text-2xs mt-0.5"
          style={{
            color: isHovered ? 'rgba(207,204,187,0.45)' : 'rgba(207,204,187,0.2)',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
            transition: 'color 0.3s ease 40ms, opacity 0.35s ease 40ms, transform 0.4s cubic-bezier(0.22,1,0.36,1) 40ms',
          }}
        >
          {exp.description}
        </p>
      </div>
    </div>
  )
}
export default function ProjectsGrid() {
  const publishedCount = EXPERIMENTS.filter((e) => e.category === 'published').length
  const conceptualCount = EXPERIMENTS.filter((e) => e.category === 'conceptual').length

  return (
    <section id="work" className="relative py-20 px-6 lg:px-10">

      {/* Section label */}
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-accent/25">
        <div className="flex items-center gap-4">
          <span className="label-caps">FEATURED PRODUCTS</span>
          <div className="w-px h-4 bg-accent/40" />
          <span className="font-mono text-2xs text-parchment/25">CASE STUDIES + EXPERIMENTS</span>
        </div>
        <span className="label-caps opacity-30">
          {PROJECTS.length} PRODUCTS / {publishedCount} PUBLISHED / {conceptualCount} CONCEPTUAL
        </span>
      </div>

      {/* ── Mobile Layout (Single Column) ─────────────────────────────────────────── */}
      <div className="flex flex-col lg:hidden w-full gap-3">
        <div className="w-full">
          <Link to={`/work/${PROJECTS[0].id}`} className="block h-full">
            <CaseStudyCard project={PROJECTS[0]} />
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-1/2"><Link to={`/studio/${EXPERIMENTS[0].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[0]} index={0} /></Link></div>
          <div className="w-full sm:w-1/2"><Link to={`/studio/${EXPERIMENTS[1].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[1]} index={1} /></Link></div>
        </div>
        <div className="w-full">
          <Link to={`/work/${PROJECTS[1].id}`} className="block h-full">
            <CaseStudyCard project={PROJECTS[1]} />
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-1/2"><Link to={`/studio/${EXPERIMENTS[2].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[2]} index={2} /></Link></div>
          <div className="w-full sm:w-1/2"><Link to={`/studio/${EXPERIMENTS[3].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[3]} index={3} /></Link></div>
        </div>
        <div className="w-full">
          <Link to={`/work/${PROJECTS[2].id}`} className="block h-full">
            <CaseStudyCard project={PROJECTS[2]} />
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-1/2"><Link to={`/studio/${EXPERIMENTS[4].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[4]} index={4} /></Link></div>
          <div className="w-full sm:w-1/2"><Link to={`/studio/${EXPERIMENTS[5].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[5]} index={5} /></Link></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-1/2"><Link to={`/studio/${EXPERIMENTS[6].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[6]} index={6} /></Link></div>
          <div className="w-full sm:w-1/2"><Link to={`/studio/${EXPERIMENTS[7].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[7]} index={7} /></Link></div>
        </div>
        <div className="w-full">
          <Link to={`/studio/${EXPERIMENTS[8].id}`} className="block">
            <ExperimentCell exp={EXPERIMENTS[8]} index={8} />
          </Link>
        </div>
      </div>

      {/* ── Desktop Layout (Masonry-style Flex) ────────────────────── */}
      <div className="hidden lg:flex flex-row w-full gap-3">
        {/* Left Column */}
        <div className="flex flex-col w-1/2 gap-3">
          <div className="w-full">
            <Link to={`/work/${PROJECTS[0].id}`} className="block h-full">
              <CaseStudyCard project={PROJECTS[0]} />
            </Link>
          </div>
          <div className="flex flex-row gap-3 w-full">
            <div className="w-1/2"><Link to={`/studio/${EXPERIMENTS[2].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[2]} index={2} /></Link></div>
            <div className="w-1/2"><Link to={`/studio/${EXPERIMENTS[3].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[3]} index={3} /></Link></div>
          </div>
          <div className="w-full">
            <Link to={`/work/${PROJECTS[2].id}`} className="block h-full">
              <CaseStudyCard project={PROJECTS[2]} />
            </Link>
          </div>
          <div className="w-full">
            <Link to={`/studio/${EXPERIMENTS[8].id}`} className="block h-full">
              <ExperimentCell exp={EXPERIMENTS[8]} index={8} />
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-1/2 gap-3">
          <div className="flex flex-row gap-3 w-full">
            <div className="w-1/2"><Link to={`/studio/${EXPERIMENTS[0].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[0]} index={0} /></Link></div>
            <div className="w-1/2"><Link to={`/studio/${EXPERIMENTS[1].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[1]} index={1} /></Link></div>
          </div>
          <div className="w-full">
            <Link to={`/work/${PROJECTS[1].id}`} className="block h-full">
              <CaseStudyCard project={PROJECTS[1]} />
            </Link>
          </div>
          <div className="flex flex-row gap-3 w-full">
            <div className="w-1/2"><Link to={`/studio/${EXPERIMENTS[4].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[4]} index={4} /></Link></div>
            <div className="w-1/2"><Link to={`/studio/${EXPERIMENTS[5].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[5]} index={5} /></Link></div>
          </div>
          <div className="flex flex-row gap-3 w-full">
            <div className="w-1/2"><Link to={`/studio/${EXPERIMENTS[6].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[6]} index={6} /></Link></div>
            <div className="w-1/2"><Link to={`/studio/${EXPERIMENTS[7].id}`} className="block h-full"><ExperimentCell exp={EXPERIMENTS[7]} index={7} /></Link></div>
          </div>
        </div>

      </div>
    </section>
  )
}
