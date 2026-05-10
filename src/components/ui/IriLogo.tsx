import { cn } from '@/lib/utils'

interface IriLogoProps {
  size?: number
  color?: string
  mode?: 'mark' | 'mark+word'
  className?: string
}

export default function IriLogo({ size = 32, color = 'currentColor', mode = 'mark+word', className }: IriLogoProps) {
  const Mark = (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.4" aria-hidden>
      <circle cx="20" cy="20" r="17.5" />
      <path d="M 20 4 A 16 16 0 0 1 35.5 20" strokeLinecap="round" />
      <path d="M 20 9 A 11 11 0 0 1 30.5 20" strokeLinecap="round" opacity="0.6" />
      <circle cx="20" cy="20" r="2.4" fill={color} stroke="none" />
    </svg>
  )

  if (mode === 'mark') return Mark

  return (
    <span
      className={cn('inline-flex items-center', className)}
      style={{ color, gap: 10 }}
    >
      {Mark}
      <span
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontWeight: 500,
          fontSize: size * 0.62,
          letterSpacing: '0.32em',
          lineHeight: 1,
        }}
      >
        IRIDA
      </span>
    </span>
  )
}
