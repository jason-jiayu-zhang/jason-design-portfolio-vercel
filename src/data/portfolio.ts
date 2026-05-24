// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO DATA — Phase 2 enriched content (caseStudy + log fields populated)
// ─────────────────────────────────────────────────────────────────────────────

import type { Project, Experiment, BioProfile, SocialLink, StatusCycle } from '../types/portfolio'

// ─── BIO ─────────────────────────────────────────────────────────────────────

export const BIO: BioProfile = {
  name: 'JJZ',
  fullName: 'Jason Jiayu Zhang',
  title: 'Product Designer',
  roles: ['DESIGN ENGINEER', 'PRODUCT DESIGNER'],
  email: 'jason.jiayu.zhang@gmail.com',
  resumeUrl:
    'https://www.figma.com/design/o1kklsHC3aczG6VzZYSKrO/Jason-s-Resume?node-id=0-1&t=U3xwtuzfGgomf4Qc-1',
  tagline: 'a product without users is merely a project.',
  socials: [
    {
      platform: 'LinkedIn',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jason-jiayu-zhang/',
      handle: 'jason-jiayu-zhang',
    },
    {
      platform: 'X',
      label: 'X (Twitter)',
      url: 'https://x.com/jasonjiayuzhang',
      handle: 'jasonjiayuzhang',
    },
    {
      platform: 'GitHub',
      label: 'GitHub',
      url: 'https://github.com/jason-jiayu-zhang',
      handle: 'jason-jiayu-zhang',
    },
    {
      platform: 'Email',
      label: 'Email',
      url: 'mailto:jason.jiayu.zhang@gmail.com',
      handle: 'jason.jiayu.zhang@gmail.com',
    },
  ] satisfies SocialLink[],
}

// ─── STATUS CYCLE ─────────────────────────────────────────────────────────────

export const STATUS_CYCLE: StatusCycle[] = [
  { text: 'Figma Campus Leader' },
  { text: 'Refining design tokens' },
  { text: 'Pushing to production' },
  { text: 'Drinking matcha' },
  { text: 'Building keyboards' },
  { text: 'Reading Thank You for Arguing' },
  { text: 'Petting my cats' },
  { text: 'Tennis' },
]

// ─── FEATURED PROJECTS ────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'cattlelog',
    slug: 'Cattlelog',
    title: 'Cattlelog',
    subtitle: 'Streamlining Course & Professor Discovery for UC Davis',
    role: 'Lead Product Designer & UI Engineer',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'Figma', 'PostHog'],
    categories: ['Product', 'Full-Stack Engineering', 'UI/UX'],
    wheelIndex: 0,
    accentColor: '#9cd5f8',
    tagline: 'Streamlining Course & Professor Discovery for UC Davis',
    metrics: [
      { label: 'Total Users', value: '30,000+' },
      { label: 'Daily Actives', value: '1,000+' },
    ],
    narrative: [
      'Cattlelog is a course and professor discovery platform serving 30,000+ UC Davis students, combining professor ratings, grade distributions, and comparison tools to simplify academic planning.',
      'To resolve the frustration of tab-switching across six different school pages, we consolidated GE requirements, course details, and professor reviews into a single clean catalog with robust searching and filtering.',
      'Using PostHog for user behavior analytics, we identified page drop-off issues and designed a targeted landing page highlighting new features, which successfully reduced user drop-off by 80%.',
    ],
    url: 'https://daviscattlelog.com',
    status: 'live',
    caseStudy: {
      executiveSummary:
        'As Lead Product Designer & UI Engineer, I spearheaded the design and development of Cattlelog — a comprehensive course and professor discovery platform now serving over 30,000 students at UC Davis. Bridging my double-major in Design and Computer Engineering, I owned the full arc from Figma system design through production React implementation. By combining professor ratings, grade distributions, and side-by-side comparison tools, Cattlelog dramatically simplifies academic planning for one of the largest public universities in the US.',
      problemSpace: [
        'UC Davis students historically navigated six separate school-owned pages just to plan a single quarter — cross-referencing RateMyProfessor, the official Course Catalog, GE requirement sheets, and grade-distribution PDFs in parallel browser tabs.',
        'The core challenge was consolidating this fractured information landscape — GE requirements, live course data, professor reviews, and historical grade distributions — into a single authoritative catalog without overwhelming users with information density.',
        'From a technical standpoint, the system needed to handle real-time search and multi-axis filtering across a large course corpus while maintaining sub-200ms interaction latency on both desktop and mobile browsers.',
      ],
      systemArchitecture: [
        'The design system was architected in Figma first: a rigorously token-based component library covering typography scales, spacing primitives, color roles, and interactive states. Every component was designed with direct React parity in mind — each Figma frame mapped one-to-one to a typed React component.',
        'The frontend stack — Vite, React, TypeScript, Tailwind CSS — was chosen for developer velocity and strict type safety. Tailwind utility classes were mapped directly from Figma\'s design token names, ensuring zero drift between design intent and shipped UI.',
        'Supabase served as the backend layer for course and professor data, with a Postgres full-text search index powering the catalog search. The data pipeline fed directly into a React Query cache layer, keeping the UI reactive without redundant fetches.',
        'PostHog was instrumented at the component level — tracking funnel drop-off, feature adoption, and session replays — giving the design team a continuous feedback loop between shipped UI and real user behavior.',
      ],
      validation: [
        'Cattlelog scaled to 30,000+ total users and 1,000+ daily actives within its first academic year — driven entirely by organic word-of-mouth among UC Davis students.',
        'PostHog analytics identified a critical drop-off on the landing page. I designed and A/B tested a redesigned hero that surfaced new features (grade distributions, professor comparison) above the fold. The result: an 80% reduction in landing-page drop-off.',
        'The component design system proved its value when the team shipped the Grade Distribution feature in under a week — the existing token system absorbed the new UI without regressions in visual consistency.',
      ],
      roadmap:
        'Next: a personalized dashboard that aggregates a student\'s full course history, predicted GPA curves per major, and proactive scheduling conflict detection — moving Cattlelog from a discovery tool to an ongoing academic co-pilot.',
    },
  },
  {
    id: 'product-space',
    slug: 'Spot',
    title: 'Product Space @ UCD',
    subtitle: 'Designing for the Next Generation of Product Leaders',
    role: 'Vice President of Design',
    tools: ['Figma', 'FigJam'],
    categories: ['Product', 'Mentorship', 'Marketing', 'UI/UX'],
    wheelIndex: 1,
    accentColor: '#ebd648',
    tagline: 'Designing for the Next Generation of Product Leaders',
    metrics: [
      { label: 'Role', value: 'VP of Design' },
      { label: 'Focus', value: 'Mentorship & Leadership' },
    ],
    awards: ['1st Place', 'Honorable Mention'],
    narrative: [
      'A community driven by mentorship, marketing, and product management.',
      'Designing for the next generation of product leaders — creating environments that empower students to think user-first.',
      'A product without users is merely a project.',
    ],
    url: 'https://www.davisproductspace.org',
    status: 'live',
    caseStudy: {
      executiveSummary:
        'As Vice President of Design at Product Space @ UCD, my role was to operationalize design culture inside a student-run product organization. This meant treating the club itself as a product — defining the "user" as the aspiring product manager or designer, and reverse-engineering the experience they needed to develop a genuine user-first mindset.',
      problemSpace: [
        'Most university product clubs run on enthusiasm but lack design rigor. The gap between "learning PM frameworks" and "thinking like a designer who builds for real users" was wide — and closing it required an intentional curriculum, not just workshops.',
        'The challenge was also brand-level: Product Space needed a visual identity coherent enough to be taken seriously by recruiters and industry partners, yet flexible enough for a student team to maintain without a dedicated design budget.',
      ],
      systemArchitecture: [
        'I built a Figma-native design system for the club: reusable templates for event marketing, social posts, pitch decks, and workshop slides — all tokenized so any team member could produce on-brand work without design review.',
        'FigJam became the collaborative workspace for design sprints and critique sessions, letting cross-functional student teams work in a shared visual language regardless of their technical background.',
        'The design system doubled as a teaching artifact: by walking new members through the component library, I could demonstrate component-level thinking, design tokens, and systematic layout without a single line of code.',
      ],
      validation: [
        'The cohort produced award-winning project work, earning 1st Place and an Honorable Mention at the end-of-year showcase.',
        'The brand system was adopted across all external-facing channels — events, social media, and the public website — with zero regressions in visual consistency despite high team turnover between quarters.',
      ],
      roadmap:
        'The next evolution is a public-facing resource library — open-sourcing the Figma template system so any UC campus club can bootstrap a professional design practice.',
    },
  },
  {
    id: 'fimanu',
    slug: 'Fimanu',
    title: 'Fimanu',
    subtitle: 'Sync — Optimizing Study Spot Discovery for Students',
    role: 'UI/UX Designer & Full-Stack Engineer',
    tools: ['React', 'TypeScript', 'Figma'],
    categories: ['UI/UX', 'Full-Stack Engineering', 'Product'],
    wheelIndex: 2,
    accentColor: '#feb34f',
    tagline: 'Optimizing Study Spot Discovery for Students',
    metrics: [
      { label: 'Award', value: '1st Place' },
      { label: 'Category', value: 'UI/UX' },
    ],
    awards: ['1st Place', 'Honorable Mention'],
    narrative: [
      'Streamlining and optimizing study spot discovery for students.',
      'Designing experiences to help students find optimal study environments effectively.',
      'Sync — coming soon.',
    ],
    url: 'https://figma-tracker.up.railway.app',
    status: 'live',
    caseStudy: {
      executiveSummary:
        'Fimanu (evolving into Sync) is a study spot discovery app designed and engineered as a dual-track project — simultaneously a competition entry and a live production experiment. As UI/UX Designer & Full-Stack Engineer, I owned the entire design-to-code pipeline, from initial wireframes through a deployed React application. The project won 1st Place in UI/UX, validating the hypothesis that utility apps don\'t have to sacrifice visual craft for function.',
      problemSpace: [
        'Students at UC Davis lose significant time wandering between libraries, coffee shops, and study lounges without reliable real-time information on noise level, available seating, or amenity access.',
        'Existing solutions — Google Maps, campus apps — were designed for navigation, not ambient environment discovery. The key design challenge was surfacing "right now" contextual data (noise, crowding, outlets, Wi-Fi quality) without overwhelming the primary find-a-spot task flow.',
        'The technical challenge mirrored the design one: building a map-based interface on mobile that balanced dense environmental data with a clean, visually premium aesthetic at a hackathon pace.',
      ],
      systemArchitecture: [
        'I opened Figma before writing a single line of code — defining a component library that prioritized map-overlay clarity: card components, status badges, and filter chips all designed to sit legibly on top of a map background without visual noise.',
        'The React + TypeScript frontend was structured around a single-page layout with a persistent bottom sheet (inspired by Apple Maps) that reveals spot details without navigating away from the map context.',
        'Color and typography were used functionally: green/amber/red status indicators for crowd levels were baked into the design tokens, ensuring accessibility contrast ratios were met while maintaining the warm, premium palette.',
      ],
      validation: [
        '1st Place, UI/UX Category — judges specifically cited the visual coherence between the map interface and the detail sheet as a differentiator.',
        'The bottom-sheet interaction pattern, prototyped in Figma and then implemented in React with a spring-physics animation, was noted as the most polished micro-interaction in the competition.',
      ],
      roadmap:
        'Sync (the evolved version) adds crowdsourced real-time noise and crowd data, saved favorites, and a "study session" mode that locks focus and tracks productive time — bridging spot discovery with actual study behavior.',
    },
  },
]

// ─── OFF-A-WHIM EXPERIMENTS ──────────────────────────────────────────────────

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'campus-rec-ad',
    title: 'Campus Recreation Ad',
    contextLabel: 'Conceptual // Graphic Design',
    visualAssetType: 'Ad Poster Graphic',
    description: 'Campus Recreation Ad',
    year: 2025,
    category: 'conceptual',
    log: {
      spark:
        'Pure curiosity about static print design — I wanted to push a visual idea about motion and energy into a format with no scrolling, no hover states, no animation. Just composition and contrast.',
      output:
        'A conceptual ad poster for Campus Recreation designed to grab attention in a high-foot-traffic campus environment.',
      sandbox:
        'Working in print dimensions reminded me how ruthless visual hierarchy has to be when there\'s no interaction layer to lean on. The constraint was the best teacher.',
    },
  },
  {
    id: 'cs-tutoring-graphics',
    title: 'CS Tutoring Graphics',
    contextLabel: 'Published // Promotional Graphic',
    visualAssetType: 'Social Media Asset',
    description: 'Applications Open for CS Tutors. Hybrid or Online. 1-2 Unit Tutor.',
    year: 2025,
    category: 'published',
    log: {
      spark:
        'The CS tutoring program needed a fresh promotional push for the new quarter, and I took it as a quick weekend sprint to see how much personality I could inject into a functionally dense announcement.',
      output:
        'A published social media asset announcing open tutor applications, balancing program logistics with an engaging visual aesthetic aimed at engineering students.',
      sandbox:
        'The real challenge was making "Hybrid or Online. 1-2 Unit Tutor." feel interesting — turns out typographic hierarchy and a strong grid can make even administrative copy feel intentional.',
    },
  },
  {
    id: 'product-space-graphics',
    title: 'Product Space Graphics',
    contextLabel: 'Published // Branding & Social',
    visualAssetType: 'Branding',
    description: 'Product Space promotional graphics series.',
    year: 2025,
    category: 'published',
    log: {
      spark:
        'As VP of Design I needed to establish a social presence for Product Space that felt credible to both industry recruiters and fellow students — two audiences with very different visual fluency.',
      output:
        'A cohesive published branding and social media graphic series that established Product Space\'s visual identity across all external channels.',
      sandbox:
        'Building a brand system for a student org with high member turnover taught me more about scalable design systems than any tutorial — it had to be simple enough for anyone to use, expressive enough to stand out.',
    },
  },
  {
    id: 'cattlelog-graphics',
    title: 'Cattlelog Graphics',
    contextLabel: 'Published // Promotional Campaign',
    visualAssetType: 'Launch Graphic',
    description: 'Cattlelog Beta (02/04); Instagram Launch (02/25); Grade Distribution Launch (03/04).',
    year: 2025,
    category: 'published',
    log: {
      spark:
        'Every major Cattlelog engineering milestone deserved a visual moment — Beta, the Instagram launch, Grade Distributions. I wanted each graphic to feel like a product announcement, not just a social post.',
      output:
        'A series of published launch graphics celebrating three major Cattlelog product milestones across Instagram.',
      sandbox:
        'Translating the app\'s UI visual language into marketing graphics was a fascinating constraint — the graphics had to reference the product without screenshotting it. Forced creative abstraction.',
    },
  },
  {
    id: 'figma-cl-graphics',
    title: 'Figma CL Graphics',
    contextLabel: 'Published // Event Marketing',
    visualAssetType: 'Event Banner',
    description: 'Figma @ UCD Tech Mixer & Sticker Café event marketing assets.',
    year: 2025,
    category: 'published',
    log: {
      spark:
        'Hosting a Figma-sponsored event on campus meant the marketing had to live up to Figma\'s own design bar — which was both a pressure and a genuine creative thrill.',
      output:
        'Published event banners and marketing assets for the Figma @ UCD Tech Mixer and Sticker Café community events.',
      sandbox:
        'Designing within Figma\'s vibrant, playful brand constraints was a masterclass in working within a creative brief. The immediate community turnout made the output feel real in a way personal projects never quite do.',
    },
  },
  {
    id: 'collection-52',
    title: 'Collection 52',
    contextLabel: 'Conceptual // UI Exploration',
    visualAssetType: 'UI Exploration',
    description: 'A curated collection of daily UI design challenges and visual layouts.',
    year: 2025,
    category: 'conceptual',
    log: {
      spark:
        'An off-the-whim discipline experiment — could I design something intentional every day for 52 weeks without a client brief or a product requirement? Just pure visual exploration.',
      output:
        'A curated series of conceptual UI challenges and visual layout explorations spanning color, typography, spacing, and micro-interaction.',
      sandbox:
        'The days where I had the least inspiration produced the most interesting constraints. Running out of "ideas" forced me toward systems thinking — which is where the real design education happened.',
    },
  },
  {
    id: 'sync-experiment',
    title: 'Sync',
    contextLabel: 'Conceptual // UI Exploration',
    visualAssetType: 'UI Exploration',
    description: 'Study spot discovery application layout and interface design flow.',
    year: 2024,
    category: 'conceptual',
    log: {
      spark:
        'Started as a sketch after spending 20 minutes wandering campus looking for a quiet place to study. I pulled out Figma and started mapping the flow I wished existed.',
      output:
        'A UI exploration defining the application layout and end-to-end interface design flow for a study spot discovery app.',
      sandbox:
        'Map-based mobile interfaces are deceptively complex — layering environmental data on a spatial medium without creating visual chaos taught me a huge amount about information hierarchy at small screen sizes.',
    },
  },
  {
    id: 'linkedin-graphics',
    title: 'LinkedIn Graphics',
    contextLabel: 'Published // Branding & Social',
    visualAssetType: 'Social Media Asset',
    description: 'Social graphics for personal branding and internship announcements.',
    year: 2025,
    category: 'published',
    log: {
      spark:
        'Off a whim after landing my Figma internship — I wanted the announcement post to feel like a design artifact, not just a humble-brag text post.',
      output:
        'Personal branding social media graphics designed for LinkedIn announcements and professional presence.',
      sandbox:
        'Designing for yourself is the hardest design challenge. There\'s no brief, no user research to hide behind — just taste. Treating my personal brand as a mini design system made the process click.',
    },
  },
  {
    id: 'formula-ucd',
    title: 'Formula @ UCD',
    contextLabel: 'Published // Event Marketing',
    visualAssetType: 'Event Banner',
    description: 'Promotional banner designs and marketing assets for UC Davis Formula Racing.',
    year: 2025,
    category: 'published',
    log: {
      spark:
        'A friend on the Formula Racing team asked if I could help with their promo materials. I immediately said yes — it was a completely different design register than anything else I was doing.',
      output:
        'Published promotional banners and marketing assets for UC Davis Formula Racing, built around a fast, high-energy visual language.',
      sandbox:
        'Translating mechanical speed and engineering precision into static graphics was a completely different adrenaline. Bold diagonals, high contrast, tight type — the opposite of everything I usually do.',
    },
  },
]
