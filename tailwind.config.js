/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1c2035',
        surface: '#252a44',
        'surface-2': '#2c3358',
        accent: '#38406a',
        parchment: '#cfccbb',
        gold: '#a39d7b',
        'gold-bright': '#c9c2a8',
        // Per-project accent palette
        'project-cattlelog': '#9cd5f8',
        'project-space': '#ebd648',
        'project-arc': '#bc8ad9',
        'project-fimanu': '#feb34f',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"Fragment Mono"', '"SF Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', '"SF Pro Display"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Inter"', '"SF Pro Display"', 'ui-sans-serif', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-tight': '-0.06em',
        'tight-2': '-0.04em',
        'tight-3': '-0.03em',
        'display': '-0.02em',
        'wide-editorial': '0.12em',
        'label': '0.08em',
      },
      fontSize: {
        '3xs': ['0.5rem', { lineHeight: '0.75rem' }],
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '8xl': ['5.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl': ['7rem', { lineHeight: '0.95', letterSpacing: '-0.05em' }],
        '10xl': ['9rem', { lineHeight: '0.9', letterSpacing: '-0.06em' }],
      },
      animation: {
        'pulse-dot': 'pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flip-up': 'flipUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'flip-down': 'flipDown 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-cascade': 'fadeCascade 0.4s ease forwards',
        'scan-line': 'scanLine 3s linear infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.85)' },
        },
        flipUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flipDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        fadeCascade: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'grid-fine': `linear-gradient(rgba(163, 157, 123, 0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(163, 157, 123, 0.04) 1px, transparent 1px)`,
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
        'grid-md': '48px 48px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'editorial': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'snap': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
