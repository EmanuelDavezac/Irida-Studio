import { cn } from '@/lib/utils'

interface IriEyebrowProps {
  children: React.ReactNode
  color?: string
  className?: string
}

export default function IriEyebrow({ children, color = '#6B6157', className }: IriEyebrowProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase font-medium', className)}
      style={{ color }}
    >
      <span className="block h-px w-[18px] opacity-60" style={{ background: color }} />
      {children}
    </span>
  )
}
