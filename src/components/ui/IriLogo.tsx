import Image from 'next/image'
import { cn } from '@/lib/utils'

interface IriLogoProps {
  size?: number
  color?: string
  mode?: 'mark' | 'mark+word'
  className?: string
}

export default function IriLogo({ color = 'currentColor', className }: IriLogoProps) {
  const isLight = color.startsWith('#F') || color.startsWith('#E') || color === '#fff' || color === 'white'

  return (
    <Image
      src="/logo-irida.png"
      alt="Irida Studio"
      width={120}
      height={40}
      className={cn('object-contain', className)}
      style={isLight ? { filter: 'brightness(0) invert(1)' } : undefined}
      priority
    />
  )
}
