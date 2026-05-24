import re

with open('src/components/ProjectsGrid.tsx', 'r') as f:
    content = f.read()

# Replace CaseStudyCard
card_old = r"// ─── Case Study Card.*?// ─── Experiment Cell"
card_new = """// ─── Case Study Card (Template Unit A) ────────────────────────────────────────
function CaseStudyCard({ project }: { project: Project }) {
  const engineering = project.categories.includes('Full-Stack Engineering')
  const isDesignSystem = project.tools.length >= 4

  return (
    <div
      className="relative flex flex-col h-full group cursor-pointer overflow-hidden rounded-[2px]"
      style={{
        '--accent': project.accentColor,
        '--accent-bg-hover': `${project.accentColor}30`,
        '--accent-shadow-1': `${project.accentColor}18`,
        '--accent-shadow-2': `${project.accentColor}15`,
        '--accent-ring': `${project.accentColor}15`,
      } as React.CSSProperties}
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#1e2238_0%,#1c2035_100%)] opacity-100 group-hover:opacity-0 transition-opacity duration-400 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#252a44_0%,#1c2035_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col h-full border border-[rgba(56,64,106,0.3)] group-hover:border-[var(--accent-bg-hover)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] group-hover:shadow-[0_24px_64px_-12px_var(--accent-shadow-1),0_0_0_1px_var(--accent-ring)] group-hover:scale-[1.015]">
        {/* Accent top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-400 opacity-20 group-hover:opacity-80"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${project.accentColor} 50%, transparent 100%)`,
          }}
        />

        {/* Index + category header strip */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xs tracking-label text-[#cfccbb40]">
              {String(project.wheelIndex + 1).padStart(2, '0')}
            </span>
            <div className="w-3 h-px bg-[var(--accent)] opacity-30" />
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
              <span className="font-mono text-2xs tracking-label text-[#cfccbb4d]">Live</span>
            </div>
          )}
          {project.status === 'coming-soon' && (
            <span className="font-mono text-2xs tracking-label text-[#e8c37d80]">Coming Soon</span>
          )}
        </div>

        {/* Main body */}
        <div className="flex-1 flex flex-col gap-4 p-6">

          {/* Title block */}
          <div>
            <h2
              className="font-sans font-black leading-none mb-2 text-[#cfccbb] group-hover:text-white transition-colors duration-300"
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                letterSpacing: '-0.04em',
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
            <span className="font-mono text-2xs tracking-label text-[#cfccbb66] uppercase">{project.role}</span>
          </div>

          {/* Full narrative */}
          <div className="space-y-2.5 flex-1">
            {project.narrative.map((para, i) => (
              <p
                key={i}
                className="font-mono text-xs leading-relaxed text-[#cfccbb73] group-hover:text-[#cfccbbbf] translate-y-[2px] group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transitionDelay: `${i * 40}ms`,
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
                className="flex flex-col gap-0.5 px-3 py-2 rounded-sm border border-[rgba(255,255,255,0.05)] bg-transparent group-hover:bg-[var(--accent-bg-hover)] transition-colors duration-400"
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
              className="flex flex-wrap gap-1.5 opacity-0 translate-y-[4px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] delay-[80ms]"
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
                  className="absolute -bottom-px left-0 right-0 h-px scale-x-0 origin-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:scale-x-100"
                  style={{
                    background: project.accentColor,
                  }}
                />
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Experiment Cell"""

content = re.sub(card_old, card_new, content, flags=re.DOTALL)

# Replace ExperimentCell
cell_old = r"// ─── Experiment Cell.*?export default function ProjectsGrid"
cell_new = """// ─── Experiment Cell (Template Unit B) ────────────────────────────────────────
const EXPERIMENT_GLYPHS = ['◈', '⬡', '◉', '⬢', '◎', '⬟', '◐']

function ExperimentCell({ exp, index }: { exp: Experiment; index: number }) {
  return (
    <div
      className="relative flex flex-col justify-between p-4 min-h-[220px] h-full cursor-pointer overflow-hidden rounded-[2px] bg-[#1a1e30] hover:bg-[#1e2238] transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group"
    >
      {/* SVG border draw on hover */}
      <DrawBorder />

      {/* Glyph — center focal point */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-mono select-none text-[#cfccbb] opacity-5 group-hover:opacity-10 scale-100 rotate-0 group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          {EXPERIMENT_GLYPHS[index % EXPERIMENT_GLYPHS.length]}
        </span>
      </div>

      {/* Top metadata */}
      <div className="relative z-10">
        <p
          className="font-mono text-2xs tracking-label uppercase text-[rgba(207,204,187,0.3)] group-hover:text-[#cfccbb] transition-colors duration-300"
        >
          {exp.contextLabel}
        </p>
        <div
          className="mt-1 text-2xs font-mono text-[rgba(207,204,187,0.15)] transition-colors duration-300 delay-[60ms]"
        >
          [{String(index + 1).padStart(2, '0')}_{exp.year}]
        </div>
      </div>

      {/* Bottom label */}
      <div className="relative z-10">
        <p
          className="font-sans font-medium text-sm leading-tight text-[rgba(207,204,187,0.5)] group-hover:text-[#cfccbb] -translate-y-[2px] group-hover:translate-y-0 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          {exp.title}
        </p>
        <div
          className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <div className="overflow-hidden">
            <p
              className="font-mono text-2xs pt-1 text-[rgba(207,204,187,0.2)] group-hover:text-[rgba(207,204,187,0.45)] translate-y-[4px] group-hover:translate-y-0 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] delay-[40ms]"
            >
              {exp.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function ProjectsGrid"""

content = re.sub(cell_old, cell_new, content, flags=re.DOTALL)

with open('src/components/ProjectsGrid.tsx', 'w') as f:
    f.write(content)
