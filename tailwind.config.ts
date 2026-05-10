import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        /* ── Irida design tokens ── */
        ir: {
          cream:      '#FBF7F0',
          paper:      '#F6EFE2',
          beige:      '#ECE0CB',
          tan:        '#D8C4A4',
          'tan-deep': '#B89F76',
          gold:       '#8B6914',
          'gold-light':'#B8924C',
          ink:        '#1A1612',
          'ink-soft': '#2C2620',
          mute:       '#6B6157',
          line:       '#E4D9C4',
        },
        mp: '#009EE3',
        wa: '#25D366',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '9':  ['9px',  { lineHeight: '1.4' }],
        '10': ['10px', { lineHeight: '1.4' }],
        '11': ['11px', { lineHeight: '1.4' }],
        '13': ['13px', { lineHeight: '1.5' }],
        '15': ['15px', { lineHeight: '1.4' }],
        '22': ['22px', { lineHeight: '1.35' }],
        '26': ['26px', { lineHeight: '1.1' }],
        '28': ['28px', { lineHeight: '1.1' }],
        '30': ['30px', { lineHeight: '1.0' }],
        '34': ['34px', { lineHeight: '1.0' }],
        '36': ['36px', { lineHeight: '1.0' }],
        '38': ['38px', { lineHeight: '1.0' }],
        '48': ['48px', { lineHeight: '0.95' }],
        '56': ['56px', { lineHeight: '0.92' }],
        '64': ['64px', { lineHeight: '0.90' }],
      },
      borderRadius: {
        lg:     'var(--radius)',
        md:     'calc(var(--radius) - 2px)',
        sm:     'calc(var(--radius) - 4px)',
        'ir-sm':'4px',
        'ir':   '8px',
        'ir-lg':'14px',
        pill:   '999px',
      },
      boxShadow: {
        ir: '0 18px 40px -20px rgba(46,36,22,0.30)',
        'ir-drawer': '-30px 0 60px -20px rgba(26,22,18,0.35)',
      },
      spacing: {
        '14': '56px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
