import re

with open('src/components/ProjectsGrid.tsx', 'r') as f:
    content = f.read()

# 1. Remove useSpringHover and imports
content = re.sub(r"import \{ useState, useRef, useCallback \} from 'react'\n", "", content)
content = re.sub(r"// ─── Spring hover hook[^\n]*\n//[^\n]*\nfunction useSpringHover\(\) \{[\s\S]*?\}\n\n", "", content)

# 2. Update DrawBorder
draw_border_old = """// ─── SVG border-draw component ────────────────────────────────────────────────
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
}"""

draw_border_new = """// ─── SVG border-draw component ────────────────────────────────────────────────
// Animates a fine perimeter line on hover using stroke-dashoffset
function DrawBorder() {
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
        className="[stroke-dashoffset:400] group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-[350ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:duration-[550ms] group-hover:ease-[cubic-bezier(0.22,1,0.36,1)]"
      />
    </svg>
  )
}"""
content = content.replace(draw_border_old, draw_border_new)

# 3. Update TechTag
tech_tag_old = """// ─── Tech tag chip ────────────────────────────────────────────────────────────
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
}"""

tech_tag_new = """// ─── Tech tag chip ────────────────────────────────────────────────────────────
function TechTag({ label, accentColor, delay }: { label: string; accentColor: string; delay: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-2xs font-mono tracking-label rounded-sm border cursor-default transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] border-[#38406a80] text-[#cfccbb8c] bg-transparent group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-bg)]"
      style={{
        '--accent': accentColor,
        '--accent-bg': `${accentColor}10`,
        transitionDelay: `${delay}ms`,
        textBox: 'trim-both cap alphabetic',
      } as React.CSSProperties}
    >
      {label}
    </span>
  )
}"""
content = content.replace(tech_tag_old, tech_tag_new)

# Write the intermediate back for sanity
with open('src/components/ProjectsGrid.tsx.tmp', 'w') as f:
    f.write(content)
