import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS, EXPERIMENTS } from '../data/portfolio'

type ArchiveItem = {
  id: string
  year: string | number
  title: string
  type: string
  role: string
  contextTags: string[]
  url?: string
  linkPath: string
  isCaseStudy: boolean
}

const TagList = ({ tags }: { tags: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useEffect(() => {
    const container = containerRef.current;
    const measureContainer = measureRef.current;
    if (!container || !measureContainer) return;

    const calculate = () => {
      const containerWidth = container.clientWidth;
      const tagElements = Array.from(measureContainer.children) as HTMLElement[];
      
      if (tagElements.length === 0) return;

      let totalWidth = 0;
      const gap = 6;
      
      for (let i = 0; i < tagElements.length; i++) {
        totalWidth += tagElements[i].offsetWidth + (i > 0 ? gap : 0);
      }
      
      if (totalWidth <= containerWidth) {
        setVisibleCount(tags.length);
        return;
      }
      
      const plusBadgeWidth = 32; 
      let currentWidth = 0;
      let count = 0;
      
      for (let i = 0; i < tagElements.length; i++) {
        const w = tagElements[i].offsetWidth;
        if (currentWidth + w + gap + plusBadgeWidth > containerWidth) {
          break;
        }
        currentWidth += w + (count > 0 ? gap : 0);
        count++;
      }
      
      setVisibleCount(Math.max(1, count));
    };

    const observer = new ResizeObserver(calculate);
    observer.observe(container);
    calculate();
    
    return () => observer.disconnect();
  }, [tags]);

  return (
    <div className="relative flex-1 min-w-0 flex items-center overflow-hidden" ref={containerRef}>
      <div 
        ref={measureRef} 
        className="absolute top-0 left-0 flex gap-1.5 invisible pointer-events-none opacity-0"
        aria-hidden="true"
      >
        {tags.map((tag, i) => (
          <span key={`measure-${i}`} className="px-2 py-0.5 rounded-sm border border-white/10 text-[10px] font-mono whitespace-nowrap">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex gap-1.5 items-center w-full">
        {tags.slice(0, visibleCount).map((tag, i) => (
          <span key={i} className="px-2 py-0.5 rounded-sm border border-white/10 text-[10px] font-mono text-parchment/60 whitespace-nowrap bg-white/[0.02] group-hover:border-white/20 transition-colors duration-300">
            {tag}
          </span>
        ))}
        {visibleCount < tags.length && (
          <span className="shrink-0 px-1.5 py-0.5 rounded-sm border border-white/10 text-[10px] font-mono text-parchment/40 bg-white/[0.02] group-hover:border-white/20 transition-colors duration-300">
            +{tags.length - visibleCount}
          </span>
        )}
      </div>
    </div>
  );
};

const allItems: ArchiveItem[] = [
  ...PROJECTS.map((p) => ({
    id: p.id,
    year: p.year,
    title: p.title,
    type: 'Case Study',
    role: p.role,
    contextTags: p.categories,
    url: p.url,
    linkPath: `/work/${p.id}`,
    isCaseStudy: true,
  })),
  ...EXPERIMENTS.map((e) => ({
    id: e.id,
    year: e.year,
    title: e.title,
    type: e.category.charAt(0).toUpperCase() + e.category.slice(1),
    role: e.role || '-',
    contextTags: e.contextLabel.split(' // ').map(t => t.trim()),
    linkPath: `/studio/${e.id}`,
    isCaseStudy: false,
  }))
].sort((a, b) => {
  const yearA = a.year === 'Present' ? 9999 : parseInt(a.year as string);
  const yearB = b.year === 'Present' ? 9999 : parseInt(b.year as string);
  return yearB - yearA;
})

export default function ArchiveSection() {
  return (
    <section id="archive" className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-10">
      {/* Section label */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12 pb-4 border-b border-accent/25">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="label-caps">INDEX</span>
          <div className="w-px h-4 bg-accent/40" />
          <span className="font-mono text-2xs text-parchment/25">MASTERLIST OF MY WORK</span>
        </div>
        <span className="label-caps opacity-30">
          {allItems.length} TOTAL ITEMS
        </span>
      </div>

      {/* Table Header (Hidden on small screens) */}
      <div className="hidden md:grid grid-cols-[80px_3fr_2fr_2fr_1fr_80px] gap-4 mb-4 px-4 font-mono text-xs text-parchment/30 uppercase tracking-widest border-b border-white/5 pb-2">
        <div className="flex items-center gap-1 text-parchment/60">
          Year
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div>Project</div>
        <div>Role</div>
        <div>Context</div>
        <div>Type</div>
        <div className="text-right">Link</div>
      </div>

      {/* List Items */}
      <div className="flex flex-col">
        {allItems.map((item) => (
          <Link
            key={item.id}
            to={item.linkPath}
            className="group block relative border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-300"
          >
            {/* Mobile Layout */}
            <div className="flex flex-col gap-2 p-4 md:hidden">
              <div className="flex justify-between items-center">
                <span className="font-mono text-2xs tracking-label text-parchment/30">{item.year}</span>
                <span className="font-mono text-2xs px-2 py-0.5 rounded-sm border border-white/10 text-parchment/50 uppercase">
                  {item.type}
                </span>
              </div>
              <h3 className="font-sans font-semibold text-sm leading-snug text-parchment group-hover:text-white transition-colors duration-300" style={{ letterSpacing: '-0.02em' }}>
                {item.title}
              </h3>
              <div className="flex gap-1.5 items-center mt-1 overflow-hidden w-full">
                {item.role !== '-' && (
                  <span className="font-mono text-2xs text-gold/70 mr-1 shrink-0 mt-0.5">{item.role}</span>
                )}
                <TagList tags={item.contextTags} />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-[80px_3fr_2fr_2fr_1fr_80px] gap-4 p-4 items-center font-mono text-xs">
              <div className="font-mono text-2xs tracking-label text-parchment/30 group-hover:text-parchment/80 transition-colors duration-300">
                {item.year}
              </div>
              <div className="font-sans font-semibold text-sm leading-snug text-parchment group-hover:text-white transition-colors duration-300" style={{ letterSpacing: '-0.02em' }}>
                {item.title}
              </div>
              <div className="text-parchment/50 group-hover:text-parchment/80 transition-colors duration-300 truncate mt-0.5 font-mono text-2xs text-gold/70">
                {item.role}
              </div>
              <div className="flex gap-1.5 items-center overflow-hidden w-full">
                <TagList tags={item.contextTags} />
              </div>
              <div className="text-parchment/50 group-hover:text-parchment/80 transition-colors duration-300">
                {item.type}
              </div>
              <div className="text-right flex justify-end pr-2">
                <div className="opacity-40 text-parchment/60 group-hover:opacity-100 group-hover:translate-x-2 group-hover:text-white transition-all duration-300">
                  →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
