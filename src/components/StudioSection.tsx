import { Link } from 'react-router-dom'
import { EXPERIMENTS } from '../data/portfolio'

export default function StudioSection() {
  return (
    <section id="studio" className="relative bg-primary py-16 md:py-24 px-4 sm:px-6 lg:px-12">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-4 border-b border-accent/30">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="label-caps text-gold">STUDIO /</span>
          <div className="w-px h-4 bg-accent/50" />
          <span className="font-mono text-2xs text-parchment/30 tracking-wide">
            OFF-A-WHIM EXPERIMENTS
          </span>
        </div>
        <span className="label-caps opacity-40">{EXPERIMENTS.length.toString().padStart(2, '0')} PIECES</span>
      </div>

      {/* Experiment grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px border border-accent/20">
        {EXPERIMENTS.map((exp, i) => (
          <Link
            key={exp.id}
            to={`/studio/${exp.id}`}
            className="group relative flex flex-col gap-3 p-5 border-0 bg-surface/10 hover:bg-surface/30 transition-all duration-300 cursor-pointer"
            style={{ borderBottom: i < EXPERIMENTS.length - 4 ? '1px solid rgba(56,64,106,0.2)' : undefined }}
          >
            {/* Visual area */}
            <div
              className="relative w-full aspect-square bg-accent/10 rounded-sm overflow-hidden flex items-center justify-center border border-accent/20 group-hover:border-parchment/20 transition-colors duration-300"
            >
              {exp.imageUrl ? (
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-[opacity,transform] duration-500 ease-out"
                />
              ) : (
                /* Abstract geometric placeholder per experiment */
                <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#cfccbb" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#a39d7b" strokeWidth="0.5" strokeDasharray="3 4" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="#cfccbb" strokeWidth="0.3" opacity="0.5" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="#cfccbb" strokeWidth="0.3" opacity="0.5" />
                  <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#cfccbb" fontFamily="monospace">
                    {String.fromCodePoint(0x2460 + i)}
                  </text>
                </svg>
              )}
            </div>

            {/* Labels */}
            <div className="space-y-1">
              <p className="label-caps opacity-50">{exp.contextLabel}</p>
              <p className="font-sans font-medium text-sm text-parchment leading-tight tracking-tight">
                {exp.title}
              </p>
              <p className="font-mono text-2xs text-parchment/35 leading-relaxed">
                {exp.description}
              </p>
            </div>

            {/* Year */}
            <div className="mt-auto">
              <span className="label-caps opacity-30">{exp.year}</span>
            </div>

            {/* Hover corner accent */}
            <div className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg viewBox="0 0 12 12" className="w-full h-full">
                <path d="M0 0 L12 0 L12 12" fill="none" stroke="#cfccbb" strokeWidth="0.8" opacity="0.5" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
