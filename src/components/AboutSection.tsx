import { useState, useRef, useEffect } from 'react'
import { TIMELINE, BELIEFS, BOOKSHELF, ROTATIONS, PLAYGROUND, EDUCATION } from '../data/about'
import type { TimelineEntry, Belief, BookEntry } from '../data/about'

// ─── Animated underline link ──────────────────────────────────────────────────
function AnchorLine({
  href, children, external = true,
}: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group relative inline-block"
    >
      <span className="text-parchment/70 group-hover:text-parchment transition-colors duration-300">
        {children}
      </span>
      {/* Center-out underline */}
      <span
        className="absolute -bottom-px left-0 right-0 h-px bg-parchment/50"
        style={{
          transform: 'scaleX(0)',
          transformOrigin: 'center',
          transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
        data-underline
      />
      <style>{`
        a:hover [data-underline] { transform: scaleX(1) !important; }
      `}</style>
    </a>
  )
}

// ─── Timeline entry row ───────────────────────────────────────────────────────
function TimelineRow({ entry, index }: { entry: TimelineEntry; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="group border-b border-accent/20 last:border-b-0"
      style={{
        paddingTop: '14px',
        paddingBottom: open ? '14px' : '14px',
        transition: 'padding 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <button
        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Left — number + period */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-mono text-2xs text-parchment/20 w-5 text-right">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className="font-mono text-2xs tracking-label text-parchment/30 whitespace-nowrap"
            >
              {entry.period}
            </span>
          </div>

          {/* Center — role + org */}
          <div className="flex-1 min-w-0 pl-8">
            <p className="font-sans font-semibold text-sm text-parchment leading-snug" style={{ letterSpacing: '-0.02em' }}>
              {entry.role}
            </p>
            <p className="font-mono text-2xs text-gold/70 mt-0.5">{entry.org}</p>
          </div>
        </div>

        {/* Right — expand toggle */}
        <span
          className="font-mono text-xs text-parchment/25 flex-shrink-0 mt-0.5 transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>

      {/* Expandable detail */}
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div className="overflow-hidden">
          <div className="pt-3 pl-8 space-y-2 pb-2">
            <p className="font-mono text-xs text-parchment/45 leading-relaxed">{entry.detail}</p>
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-2xs tracking-label px-1.5 py-0.5 border border-accent/30 text-parchment/35 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Belief block ─────────────────────────────────────────────────────────────
function BeliefBlock({ belief }: { belief: Belief }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative py-5 border-b border-accent/20 last:border-b-0 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Vertical index bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{
          background: 'linear-gradient(to bottom, transparent, #a39d7b, transparent)',
          opacity: hovered ? 0.6 : 0,
          transition: 'opacity 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      <div className="pl-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-2xs text-parchment/20">{belief.index}</span>
          <div
            className="h-px flex-1"
            style={{
              background: 'linear-gradient(90deg, rgba(163,157,123,0.4), transparent)',
              width: hovered ? '100%' : '24px',
              maxWidth: hovered ? '80px' : '24px',
              transition: 'max-width 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        </div>
        <h3
          className="font-sans font-bold text-sm text-parchment leading-tight mb-2"
          style={{
            letterSpacing: '-0.025em',
            color: hovered ? '#fff' : '#cfccbb',
            transition: 'color 0.3s ease',
          }}
        >
          {belief.headline}
        </h3>
        <p
          className="font-mono text-xs leading-relaxed"
          style={{
            color: hovered ? 'rgba(207,204,187,0.6)' : 'rgba(207,204,187,0.35)',
            transition: 'color 0.35s ease',
          }}
        >
          {belief.body}
        </p>
      </div>
    </div>
  )
}

// ─── Terminal list ─────────────────────────────────────────────────────────────
const STATUS_ICONS: Record<BookEntry['status'], string> = {
  reading: '▶',
  done: '✓',
  queued: '○',
}
const STATUS_COLORS: Record<BookEntry['status'], string> = {
  reading: '#9cd5f8',
  done: '#4ade80',
  queued: 'rgba(207,204,187,0.25)',
}

function TerminalSection({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      {/* Terminal prompt line */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-accent/20">
        <span className="font-mono text-2xs text-gold/50">›</span>
        <span className="font-mono text-2xs tracking-label text-gold/70 uppercase">{label}</span>
      </div>
      {children}
    </div>
  )
}

function Blink() {
  return (
    <span
      className="inline-block w-1.5 h-3 bg-parchment/60 ml-0.5"
      style={{ animation: 'blink 1.1s step-end infinite' }}
    />
  )
}

function InteractiveTerminalPrompt({
  history,
  commandInput,
  setCommandInput,
  handleCommand,
  inputRef
}: {
  history: Array<{ cmd: string, output: React.ReactNode }>;
  commandInput: string;
  setCommandInput: (val: string) => void;
  handleCommand: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const historyEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <div className="pt-3 flex flex-col gap-2">
      {history.length > 0 && (
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(207,204,187,0.2) transparent' }}>
          {history.map((h, i) => (
            <div key={i} className="space-y-1" style={{ animation: 'fadeIn 0.2s ease both' }}>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-2xs text-gold/50">›_</span>
                <span className="font-mono text-xs text-parchment/70">{h.cmd}</span>
              </div>
              {h.output && (
                <div className="font-mono text-xs text-parchment/40 pl-4 whitespace-pre-wrap">
                  {h.output}
                </div>
              )}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>
      )}
      <div
        className="flex items-center gap-1.5 relative cursor-text min-h-[20px] shrink-0"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="font-mono text-2xs text-parchment/30">›_</span>
        <span className="font-mono text-xs text-parchment/70 flex-1 whitespace-pre-wrap break-all">
          {commandInput}
          <Blink />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={handleCommand}
          onBlur={() => {
            // Keep focus if we click somewhere else inside the terminal, but allow blurring if scrolled away
          }}
          className="absolute opacity-0 inset-0 w-full h-full cursor-text"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}

// ─── About Section — Main Export ──────────────────────────────────────────────
export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<'books' | 'music' | 'play'>('books')
  const [activeGameId, setActiveGameId] = useState<string>('01')
  const [history, setHistory] = useState<Array<{ cmd: string, output: React.ReactNode }>>([
    { cmd: 'sysinfo', output: 'JasonOS v1.0.0\nType "help" for a list of available commands.' }
  ])
  const [commandInput, setCommandInput] = useState('')
  const [uptimeStart] = useState(() => Date.now())
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the terminal when it scrolls into view, and blur when it leaves
  // so we don't hijack keyboard scrolling when the user isn't looking at it.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          inputRef.current?.focus({ preventScroll: true })
        } else {
          inputRef.current?.blur()
        }
      },
      { threshold: 0.1 }
    )

    if (inputRef.current) {
      observer.observe(inputRef.current)
    }

    return () => observer.disconnect()
  }, [activeTab])

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const cmd = commandInput.toLowerCase()
      const commands = [
        'help', 'clear', 'cd', 'ls', 'resume', 'contact', 'whoami',
        'sudo', 'echo', 'ping', 'coffee', 'uptime', 'rm -rf /', 'flip', 'unflip', 'cat'
      ]

      const isBaseCommand = !cmd.includes(' ') || cmd.startsWith('rm')
      if (isBaseCommand) {
        const matches = commands.filter(c => c.startsWith(cmd))
        if (matches.length === 1) {
          let suffix = ''
          if (['cd', 'sudo', 'echo'].includes(matches[0])) suffix = ' '
          setCommandInput(matches[0] + suffix)
        } else if (matches.length > 1) {
          const sorted = matches.sort()
          const first = sorted[0]
          const last = sorted[sorted.length - 1]
          let i = 0
          while (i < first.length && first.charAt(i) === last.charAt(i)) i++
          const commonPrefix = first.substring(0, i)
          if (commonPrefix.length > cmd.length) {
            setCommandInput(commonPrefix)
          }
        }
      } else if (cmd.startsWith('cd ')) {
        const dirs = ['books', 'shelf', 'music', 'now', 'play']
        const arg = cmd.slice(3)
        const matches = dirs.filter(d => d.startsWith(arg))
        if (matches.length === 1) {
          setCommandInput('cd ' + matches[0])
        } else if (matches.length > 1) {
          const sorted = matches.sort()
          const first = sorted[0]
          const last = sorted[sorted.length - 1]
          let i = 0
          while (i < first.length && first.charAt(i) === last.charAt(i)) i++
          const commonPrefix = first.substring(0, i)
          if (commonPrefix.length > arg.length) {
            setCommandInput('cd ' + commonPrefix)
          }
        }
      }
      return
    }

    if (e.key === 'Enter') {
      const cmd = commandInput.trim()
      if (!cmd) return

      let output: React.ReactNode = ''
      const lowerCmd = cmd.toLowerCase()

      if (lowerCmd === 'help') {
        output = 'Available commands: help, clear, cd <tab>, ls, resume, contact, whoami, sudo, echo, ping, coffee, uptime, rm -rf /, flip, unflip, cat'
      } else if (lowerCmd === 'clear') {
        setHistory([])
        setCommandInput('')
        return
      } else if (lowerCmd.startsWith('cd ')) {
        const target = lowerCmd.split(' ')[1]
        if (target === 'books' || target === 'shelf') { setActiveTab('books'); output = 'Changed directory to books' }
        else if (target === 'music' || target === 'now') { setActiveTab('music'); output = 'Changed directory to music' }
        else if (target === 'play') { setActiveTab('play'); output = 'Changed directory to play' }
        else { output = `cd: no such file or directory: ${target}\nAvailable directories: books (shelf), music (now), play` }
      } else if (lowerCmd === 'ls') {
        if (activeTab === 'books') output = BOOKSHELF.map(b => b.title).join('  ')
        else if (activeTab === 'music') output = ROTATIONS.map(r => r.artist).join('  ')
        else if (activeTab === 'play') output = PLAYGROUND.map(p => p.id).join('  ')
      } else if (lowerCmd === 'resume') {
        window.open('https://www.figma.com/design/o1kklsHC3aczG6VzZYSKrO/Jason-s-Resume?node-id=0-1&t=U3xwtuzfGgomf4Qc-1', '_blank')
        output = 'Opening resume...'
      } else if (lowerCmd === 'contact') {
        output = "Let's connect! Check the footer for my social links."
      } else if (lowerCmd === 'whoami') {
        output = 'Jason Jiayu Zhang - Designer & Engineer'
      } else if (lowerCmd.startsWith('sudo ')) {
        output = 'User is not in the sudoers file. This incident will be reported.'
      } else if (lowerCmd === 'sudo') {
        output = 'usage: sudo command'
      } else if (lowerCmd.startsWith('echo ')) {
        output = cmd.slice(5)
      } else if (lowerCmd === 'echo') {
        output = ''
      } else if (lowerCmd === 'ping') {
        output = 'PONG'
      } else if (lowerCmd === 'coffee') {
        output = <span>Let's chat! Schedule a time here: <br /><a href="https://calendar.app.google/Vp2ioxnPTR66xhUo6" target="_blank" rel="noreferrer" className="text-gold hover:underline">https://calendar.app.google/Vp2ioxnPTR66xhUo6</a></span>
      } else if (lowerCmd === 'uptime') {
        const secs = Math.floor((Date.now() - uptimeStart) / 1000)
        output = `up ${secs} seconds`
      } else if (lowerCmd === 'rm -rf /') {
        output = "Permission denied: Please don't delete my portfolio."
      } else if (lowerCmd === 'flip') {
        output = '(╯°□°）╯︵ ┻━┻'
      } else if (lowerCmd === 'unflip') {
        output = '┬─┬ ノ( ゜-゜ノ)'
      } else if (lowerCmd === 'cat') {
        output = <pre className="font-mono text-2xs leading-tight mt-1">{`          —————
　　　　　╱ ＞　　 フ
        |   _  _l
       ╱\`  ミ＿xノ
      /　　　 　 |
　　　 /   |    J
    _|    \\ \\ \\
  ╱ _|     | | |
 | (_ \\____\\_),_)
  ╲ _)`}</pre>
      } else {
        output = `command not found: ${cmd}`
      }

      setHistory(prev => [...prev, { cmd, output }])
      setCommandInput('')
    }
  }


  return (
    <section id="about" className="relative py-12 md:py-20 border-t border-accent/25">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 px-6 lg:px-10 pb-4 border-b border-accent/20">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="label-caps">FOUNDATIONS /</span>
          <div className="w-px h-4 bg-accent/40" />
          <span className="font-mono text-2xs text-parchment/25">ABOUT + BELIEFS + CATALOG</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-2xs text-parchment/20">{EDUCATION.institution}</span>
          <div className="w-px h-3 bg-accent/30" />
          {EDUCATION.degrees.map((d, i) => (
            <span key={i} className="font-mono text-2xs text-parchment/30">{d}</span>
          ))}
        </div>
      </div>

      {/* ── Three-column layout ───────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-px border-l border-r border-accent/15 mx-4 sm:mx-6 lg:mx-10"
      >

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 1 — Professional Foundations & Timeline
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b lg:border-b-0 lg:border-r border-accent/20">

          {/* Identity header */}
          <div className="mb-8">
            <div className="label-caps mb-2">TRAJECTORY</div>
            <h2
              className="font-sans font-black text-parchment leading-none mb-3"
              style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', letterSpacing: '-0.04em' }}
            >
              Design × Engineering
            </h2>
            <p className="font-mono text-xs text-parchment/40 leading-relaxed">
              {EDUCATION.note}
            </p>
          </div>

          {/* Double major pill */}
          <div className="flex flex-wrap gap-2 mb-8">
            {EDUCATION.degrees.map((d) => (
              <div
                key={d}
                className="px-2 pt-0 pb-0.5 border border-accent/30 rounded-sm"
                style={{ background: 'rgba(56,64,106,0.15)' }}
              >
                <span className="font-mono text-2xs tracking-label text-gold/70">{d}</span>
              </div>
            ))}
          </div>

          {/* Toolchain */}
          <div className="mb-8">
            <div className="label-caps mb-3 opacity-50">RAPID PROTOTYPING STACK</div>
            <div className="flex flex-wrap gap-1.5">
              {EDUCATION.tools.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-2xs px-2 py-0.5 border border-accent/25 text-parchment/35 rounded-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="label-caps mb-4 opacity-50">EXPERIENCE</div>
            <div className="space-y-0 divide-y divide-transparent">
              {TIMELINE.map((entry, i) => (
                <TimelineRow key={entry.role} entry={entry} index={i} />
              ))}
            </div>
          </div>

          {/* Resume CTA */}
          <div className="mt-8 pt-6 border-t border-accent/20">
            <AnchorLine href="https://www.figma.com/design/o1kklsHC3aczG6VzZYSKrO/Jason-s-Resume?node-id=0-1&t=U3xwtuzfGgomf4Qc-1">
              <span className="font-mono text-xs tracking-label uppercase text-gold/70 hover:text-gold transition-colors">
                View Full Resume ↗
              </span>
            </AnchorLine>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 2 — Human-First Beliefs
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b lg:border-b-0 lg:border-r border-accent/20">
          <div className="mb-8">
            <div className="label-caps mb-2">PHILOSOPHY</div>
            <h2
              className="font-sans font-black text-parchment leading-none mb-3"
              style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', letterSpacing: '-0.04em' }}
            >
              Human-First.
              <br />
              <span className="text-gold">Always.</span>
            </h2>
            <p className="font-mono text-xs text-parchment/40 leading-relaxed">
              Servant leadership. Deep empathy. Authentic community.
              The following principles aren't values on a slide — they're operating constraints.
            </p>
          </div>

          {/* Beliefs list */}
          <div className="space-y-0 divide-y divide-transparent">
            {BELIEFS.map((belief) => (
              <BeliefBlock key={belief.index} belief={belief} />
            ))}
          </div>

          {/* Closing line */}
          <div className="mt-8 pt-6 border-t border-accent/20">
            <blockquote className="font-mono text-xs text-parchment/25 italic leading-relaxed">
              "To nurture others to love the art of making."
            </blockquote>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 3 — Personal Catalog (Terminal Interface)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div>
            {/* Terminal header bar */}
            <div className="mb-6">
              <div className="label-caps mb-2">PERSONAL CATALOG</div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 border border-accent/30 rounded-sm mb-4"
                style={{ background: 'rgba(28,32,53,0.8)' }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                <div className="w-2 h-2 rounded-full bg-green-400/60" />
                <div className="flex-1" />
                <span className="font-mono text-2xs text-parchment/20">~/jjz/personal</span>
              </div>

              {/* Tab switcher */}
              <div className="flex border border-accent/25 rounded-sm overflow-hidden">
                {(['books', 'music', 'play'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab)
                      setCommandInput('')
                    }}
                    className="flex-1 py-1.5 font-mono text-2xs tracking-label uppercase transition-all duration-250"
                    style={{
                      background: activeTab === tab ? 'rgba(56,64,106,0.4)' : 'transparent',
                      color: activeTab === tab ? '#cfccbb' : 'rgba(207,204,187,0.3)',
                      borderRight: tab !== 'play' ? '1px solid rgba(56,64,106,0.25)' : undefined,
                      transition: 'background 0.25s cubic-bezier(0.22,1,0.36,1), color 0.25s ease',
                    }}
                  >
                    {tab === 'books' ? '📚 shelf' : tab === 'music' ? '♫ now' : '◈ play'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── BOOKSHELF ── */}
            {activeTab === 'books' && (
              <TerminalSection label="The Bookshelf">
                <div className="space-y-1.5">
                  {BOOKSHELF.map((book, i) => (
                    <div
                      key={book.title}
                      className="flex items-start gap-2.5 py-1.5 border-b border-accent/10 last:border-b-0 group cursor-default"
                      style={{
                        opacity: 1,
                        animation: `fadeIn 0.3s ease ${i * 40}ms both`,
                      }}
                    >
                      <span
                        className="font-mono text-xs flex-shrink-0 mt-0.5"
                        style={{ color: STATUS_COLORS[book.status] }}
                      >
                        {STATUS_ICONS[book.status]}
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-parchment/70 leading-tight truncate">
                          {book.title}
                        </p>
                        <p className="font-mono text-2xs text-parchment/30 mt-0.5">
                          {book.author}
                          <span className="ml-2 opacity-50">— {book.category}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                  <InteractiveTerminalPrompt
                    history={history}
                    commandInput={commandInput}
                    setCommandInput={setCommandInput}
                    handleCommand={handleCommand}
                    inputRef={inputRef}
                  />
                </div>
              </TerminalSection>
            )}

            {/* ── ROTATIONS ── */}
            {activeTab === 'music' && (
              <TerminalSection label="Current Rotations">
                <div className="space-y-0">
                  {ROTATIONS.map((track, i) => (
                    <div
                      key={track.artist}
                      className="flex items-center justify-between py-2.5 border-b border-accent/10 last:border-b-0 group cursor-default"
                      style={{ animation: `fadeIn 0.3s ease ${i * 35}ms both` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-2xs text-parchment/20 w-4">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {/* Mini waveform visual */}
                        <div className="flex items-end gap-0.5 h-3">
                          {[3, 5, 2, 4, 6, 3, 5].map((h, j) => (
                            <div
                              key={j}
                              className="w-0.5 bg-gold/30 group-hover:bg-gold/60 rounded-full"
                              style={{
                                height: `${h * 2}px`,
                                transition: `height 0.3s cubic-bezier(0.22,1,0.36,1) ${j * 25}ms, background-color 0.3s ease`,
                              }}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="font-sans font-medium text-xs text-parchment/70 leading-none">
                            {track.note}
                          </p>
                          <p className="font-mono text-2xs text-parchment/30 mt-0.5">{track.artist}</p>
                        </div>
                      </div>
                      <span className="font-mono text-2xs text-parchment/15">♫</span>
                    </div>
                  ))}
                  <InteractiveTerminalPrompt
                    history={history}
                    commandInput={commandInput}
                    setCommandInput={setCommandInput}
                    handleCommand={handleCommand}
                    inputRef={inputRef}
                  />
                </div>
              </TerminalSection>
            )}

            {/* ── PLAYGROUND ── */}
            {activeTab === 'play' && (
              <TerminalSection label="The Playground">
                <div className="flex gap-4">
                  {/* 25% Left Column: Directory Panel */}
                  <div className="w-1/4 shrink-0 flex flex-col space-y-4 pt-1 border-r border-accent/10 pr-2">
                    {PLAYGROUND.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setActiveGameId(game.id)}
                        className="flex items-start gap-1.5 text-left group w-full cursor-pointer"
                      >
                        <span
                          className="font-mono text-xs leading-[1.2] transition-colors duration-200 mt-[1px]"
                          style={{ color: activeGameId === game.id ? '#ebd648' : 'transparent' }}
                        >
                          {'>'}
                        </span>
                        <span
                          className="font-mono text-2xs tracking-label uppercase leading-tight transition-colors duration-200"
                          style={{ color: activeGameId === game.id ? '#cfccbb' : 'rgba(207,204,187,0.35)' }}
                        >
                          {game.id} <span className="opacity-50">//</span><br />
                          <span className="opacity-80">{game.title}</span>
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* 75% Right Column: Details Display Pane */}
                  <div className="w-3/4 flex-1 pl-2">
                    <div className="space-y-0">
                      {PLAYGROUND.find(g => g.id === activeGameId)?.specs.map((item, i) => (
                        <div
                          key={`${activeGameId}-${item.label}`}
                          className="flex items-start justify-between py-2.5 border-b border-accent/10 last:border-b-0"
                          style={{ animation: `fadeIn 0.3s ease ${i * 30}ms both` }}
                        >
                          <div>
                            <span className="font-mono text-2xs tracking-label text-parchment/30 uppercase block">
                              {item.label}
                            </span>
                            <span className={`font-mono text-2xs block mt-0.5 ${item.sublabel ? 'text-parchment/20' : 'opacity-0 select-none'}`}>
                              {item.sublabel || '—'}
                            </span>
                          </div>
                          <span
                            className="font-mono text-xs text-right mt-0.5"
                            style={{ color: i === 0 ? '#9cd5f8' : i === 2 ? '#ebd648' : '#cfccbb', opacity: 0.7 }}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <InteractiveTerminalPrompt
                  history={history}
                  commandInput={commandInput}
                  setCommandInput={setCommandInput}
                  handleCommand={handleCommand}
                  inputRef={inputRef}
                />
              </TerminalSection>
            )}
          </div>
        </div>
      </div>

      {/* Blink keyframe injection */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
