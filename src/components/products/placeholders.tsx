/* SVG placeholder illustrations for products — replace with real photos when available */

export type Tone = 'cream' | 'paper' | 'beige' | 'blush' | 'sage' | 'ink'

const palette: Record<string, string> = {
  cream:    '#FBF7F0',
  paper:    '#F6EFE2',
  beige:    '#ECE0CB',
  tan:      '#D8C4A4',
  tanDeep:  '#B89F76',
  gold:     '#8B6914',
  goldLight:'#B8924C',
  ink:      '#1A1612',
  blush:    '#E8C9B5',
  sage:     '#B8C4A8',
}

const bg: Record<Tone, string> = {
  cream: 'linear-gradient(160deg, #F6EFE2 0%, #ECE0CB 100%)',
  paper: 'linear-gradient(160deg, #F0E8D8 0%, #E8DCC8 100%)',
  beige: 'linear-gradient(160deg, #ECE0CB 0%, #D8C4A4 100%)',
  blush: 'linear-gradient(160deg, #F4E6DD 0%, #E8C9B5 100%)',
  sage:  'linear-gradient(160deg, #E6ECDD 0%, #C8D4B5 100%)',
  ink:   'linear-gradient(160deg, #2C2620 0%, #1A1612 100%)',
}

function SoftShadow({ id = 'iri-sh', dy = 8, blur = 14, opacity = 0.18 }: { id?: string; dy?: number; blur?: number; opacity?: number }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation={blur / 2} />
      <feOffset dy={dy} result="off" />
      <feComponentTransfer><feFuncA type="linear" slope={opacity} /></feComponentTransfer>
      <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  )
}

export function OpenNotebook({ tone = 'cream', accent = palette.gold }: { tone?: Tone; accent?: string }) {
  const isDark = tone === 'ink'
  return (
    <div style={{ width: '100%', height: '100%', background: bg[tone], position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
        <defs>
          <SoftShadow id="nb-sh" dy={20} blur={30} opacity={0.22} />
          <linearGradient id="nb-paper" x1="0" x2="1">
            <stop offset="0" stopColor="#FFFCF5" />
            <stop offset="1" stopColor="#F2EAD8" />
          </linearGradient>
        </defs>
        <g opacity="0.85" transform="rotate(18 320 100)">
          <rect x="295" y="80" width="60" height="6" rx="3" fill={isDark ? '#B8924C' : '#1A1612'} />
          <polygon points="355,80 365,83 355,86" fill={accent} />
        </g>
        <g filter="url(#nb-sh)" transform="rotate(-6 200 280)">
          <rect x="40" y="160" width="320" height="240" rx="6" fill="url(#nb-paper)" />
          <line x1="200" y1="160" x2="200" y2="400" stroke={isDark ? '#3a3027' : '#D8C4A4'} strokeWidth="1.2" />
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={i} x1="60" y1={195 + i*22} x2="185" y2={195 + i*22} stroke="#D8C4A4" strokeWidth="0.6" opacity="0.8" />
          ))}
          {Array.from({ length: 7 }).map((_, r) =>
            Array.from({ length: 6 }).map((__, c) => (
              <circle key={`d${r}${c}`} cx={220 + c*22} cy={195 + r*26} r="0.9" fill="#B89F76" opacity="0.7" />
            ))
          )}
          <text x="60" y="186" fontFamily="Playfair Display, Georgia, serif" fontStyle="italic" fontSize="16" fill={accent}>mayo · semana 18</text>
          <rect x="220" y="170" width="120" height="2" fill={accent} opacity="0.6" />
          <circle cx="345" cy="171" r="3" fill={accent} />
        </g>
        <rect x="180" y="395" width="14" height="80" fill={accent} opacity="0.85" transform="rotate(-6 187 435)" />
      </svg>
    </div>
  )
}

export function Agenda({ tone = 'beige', label = 'AGENDA 2026' }: { tone?: Tone; label?: string }) {
  const bgColor: Record<string, string> = { beige:'#ECE0CB', cream:'#FBF7F0', ink:'#1A1612', sage:'#C8D4B5', blush:'#E8C9B5' }
  const isDark = tone === 'ink'
  const cover = isDark ? '#2C2620' : '#FBF7F0'
  const stroke = isDark ? '#8B6914' : '#1A1612'
  const id = `ag-sh-${tone}`
  return (
    <div style={{ width: '100%', height: '100%', background: bgColor[tone] ?? bgColor.beige, position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs><SoftShadow id={id} dy={14} blur={22} opacity={0.18} /></defs>
        <g filter={`url(#${id})`} transform="rotate(-3 150 200)">
          <rect x="70" y="60" width="160" height="280" rx="3" fill={cover} stroke={stroke} strokeWidth="0.6" />
          <rect x="70" y="60" width="6" height="280" fill={isDark ? '#1a1612' : '#D8C4A4'} />
          <rect x="92" y="92" width="100" height="1" fill="#8B6914" />
          <text x="92" y="115" fontFamily="Playfair Display, Georgia, serif" fontStyle="italic" fontSize="22" fill={isDark ? '#FBF7F0' : '#1A1612'}>Irida</text>
          <text x="92" y="135" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="2" fill={isDark ? '#B8924C' : '#6B6157'}>{label}</text>
          <rect x="226" y="64" width="4" height="272" fill="#F6EFE2" stroke="#D8C4A4" strokeWidth="0.3" />
          <rect x="65" y="180" width="170" height="3" fill={isDark ? '#8B6914' : '#1A1612'} opacity="0.85" />
        </g>
      </svg>
    </div>
  )
}

export function Stickers({ tone = 'cream' }: { tone?: Tone }) {
  const bgMap: Record<string, string> = { cream:'#FBF7F0', paper:'#F6EFE2', blush:'#F4E6DD', sage:'#E6ECDD' }
  return (
    <div style={{ width: '100%', height: '100%', background: bgMap[tone] ?? bgMap.cream, position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs><SoftShadow id="st-sh" dy={4} blur={8} opacity={0.15} /></defs>
        <g filter="url(#st-sh)">
          <g transform="rotate(-12 90 120)">
            <circle cx="90" cy="120" r="55" fill="#FBF7F0" stroke="#1A1612" strokeWidth="2" />
            <text x="90" y="115" textAnchor="middle" fontFamily="Playfair Display, serif" fontStyle="italic" fontSize="16" fill="#8B6914">hello</text>
            <text x="90" y="135" textAnchor="middle" fontFamily="Inter" fontSize="7" letterSpacing="3" fill="#1A1612">SUNSHINE</text>
          </g>
          <g transform="rotate(8 210 90)">
            <path d="M 165 100 Q 210 60 255 100 L 250 115 Q 210 80 170 115 Z" fill="#8B6914" />
            <text x="210" y="98" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="600" fill="#FBF7F0" letterSpacing="2">IRIDA</text>
          </g>
          <g transform="rotate(-8 210 210)">
            <path d="M 210 195 C 200 180 175 185 180 205 C 184 220 210 235 210 235 C 210 235 236 220 240 205 C 245 185 220 180 210 195 Z" fill="#D8A89A" stroke="#1A1612" strokeWidth="1.4"/>
          </g>
          <g transform="rotate(15 90 230)">
            <path d="M 50 230 Q 70 215 90 230 T 130 230" fill="none" stroke="#1A1612" strokeWidth="3" strokeLinecap="round" />
            <circle cx="135" cy="230" r="3" fill="#8B6914" />
          </g>
          <g transform="translate(160 205)">
            <path d="M 0 -14 L 4 -4 L 14 -4 L 6 3 L 9 13 L 0 7 L -9 13 L -6 3 L -14 -4 L -4 -4 Z" fill="#1A1612" />
          </g>
        </g>
      </svg>
    </div>
  )
}

export function Keychain({ tone = 'paper', accent = '#8B6914' }: { tone?: Tone; accent?: string }) {
  const bgMap: Record<string, string> = { paper:'#F6EFE2', cream:'#FBF7F0', sage:'#E6ECDD' }
  return (
    <div style={{ width: '100%', height: '100%', background: bgMap[tone] ?? bgMap.paper, position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 300 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs><SoftShadow id="kc-sh" dy={8} blur={14} opacity={0.2} /></defs>
        <g filter="url(#kc-sh)" transform="rotate(-4 150 180)">
          <circle cx="150" cy="80" r="22" fill="none" stroke="#B89F76" strokeWidth="6" />
          <line x1="150" y1="102" x2="150" y2="140" stroke="#B89F76" strokeWidth="2.5" />
          <rect x="100" y="140" width="100" height="140" rx="10" fill="#FBF7F0" stroke="#1A1612" strokeWidth="1.4" />
          <circle cx="150" cy="155" r="4" fill="none" stroke="#1A1612" strokeWidth="1.4" />
          <text x="150" y="210" textAnchor="middle" fontFamily="Playfair Display, serif" fontStyle="italic" fontSize="32" fill={accent}>m.</text>
          <text x="150" y="240" textAnchor="middle" fontFamily="Inter" fontSize="8" letterSpacing="3" fill="#6B6157">MARTINA</text>
        </g>
      </svg>
    </div>
  )
}

export function Fotitos({ tone = 'beige' }: { tone?: Tone }) {
  const bgMap: Record<string, string> = { beige:'#ECE0CB', cream:'#FBF7F0', paper:'#F6EFE2' }
  return (
    <div style={{ width: '100%', height: '100%', background: bgMap[tone] ?? bgMap.beige, position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs><SoftShadow id="ph-sh" dy={6} blur={10} opacity={0.2} /></defs>
        <g filter="url(#ph-sh)">
          <g transform="rotate(-10 100 150)">
            <rect x="60" y="90" width="90" height="110" fill="#FBF7F0" stroke="#1A1612" strokeWidth="0.5" />
            <rect x="65" y="95" width="80" height="80" fill="#D8C4A4" />
            <circle cx="105" cy="135" r="14" fill="#B89F76" />
            <path d="M 75 160 L 95 145 L 110 158 L 130 138 L 140 175 L 70 175 Z" fill="#8B6914" opacity="0.7" />
            <text x="105" y="192" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic" fontSize="9" fill="#1A1612">verano</text>
          </g>
          <g transform="rotate(8 200 160)">
            <rect x="160" y="100" width="90" height="110" fill="#FBF7F0" stroke="#1A1612" strokeWidth="0.5" />
            <rect x="165" y="105" width="80" height="80" fill="#E8C9B5" />
            <circle cx="205" cy="140" r="22" fill="#D8A89A" opacity="0.6" />
            <text x="205" y="202" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic" fontSize="9" fill="#1A1612">enero</text>
          </g>
        </g>
      </svg>
    </div>
  )
}

export function Topper({ tone = 'paper', word = 'feliz' }: { tone?: Tone; word?: string }) {
  const bgMap: Record<string, string> = { paper:'#F6EFE2', blush:'#F4E6DD', cream:'#FBF7F0' }
  return (
    <div style={{ width: '100%', height: '100%', background: bgMap[tone] ?? bgMap.paper, position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <SoftShadow id="tp-sh" dy={8} blur={12} opacity={0.22} />
          <linearGradient id="tp-gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#C9A24A" />
            <stop offset="1" stopColor="#8B6914" />
          </linearGradient>
        </defs>
        <g filter="url(#tp-sh)">
          <rect x="148" y="180" width="4" height="100" fill="#B89F76" />
          <text x="150" y="160" textAnchor="middle" fontFamily="Playfair Display, serif" fontStyle="italic" fontSize="56" fill="url(#tp-gold)" fontWeight="500">{word}</text>
          <path d="M 220 80 L 225 90 L 235 90 L 227 97 L 230 108 L 220 102 L 210 108 L 213 97 L 205 90 L 215 90 Z" fill="url(#tp-gold)" />
        </g>
      </svg>
    </div>
  )
}

export function Cuaderno({ tone = 'sage' }: { tone?: Tone }) {
  const bgMap: Record<string, string> = { sage:'#E6ECDD', cream:'#FBF7F0', blush:'#F4E6DD', ink:'#2C2620' }
  const isDark = tone === 'ink'
  return (
    <div style={{ width: '100%', height: '100%', background: bgMap[tone] ?? bgMap.sage, position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 300 380" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs><SoftShadow id="cu-sh" dy={14} blur={22} opacity={0.2} /></defs>
        <g filter="url(#cu-sh)" transform="rotate(4 150 190)">
          <rect x="80" y="50" width="140" height="280" rx="2" fill={isDark ? '#1A1612' : '#FBF7F0'} stroke={isDark ? '#8B6914' : '#1A1612'} strokeWidth="1.2" />
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx="80" cy={70 + i*19} r="3" fill="none" stroke={isDark ? '#8B6914' : '#1A1612'} strokeWidth="1" />
          ))}
          <circle cx="150" cy="180" r="38" fill="#8B6914" />
          <text x="150" y="178" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic" fontSize="14" fill="#FBF7F0">notas</text>
          <text x="150" y="195" textAnchor="middle" fontFamily="Inter" fontSize="6" letterSpacing="3" fill="#FBF7F0">IRIDA · 2026</text>
        </g>
      </svg>
    </div>
  )
}

export function Tag({ tone = 'cream' }: { tone?: Tone }) {
  const bgMap: Record<string, string> = { cream:'#FBF7F0', paper:'#F6EFE2', sage:'#E6ECDD' }
  return (
    <div style={{ width: '100%', height: '100%', background: bgMap[tone] ?? bgMap.cream, position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 300 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs><SoftShadow id="tg-sh" dy={6} blur={10} opacity={0.18} /></defs>
        <g filter="url(#tg-sh)" transform="rotate(-12 150 150)">
          <path d="M 150 50 Q 130 80 150 110" stroke="#B89F76" strokeWidth="1.2" fill="none" />
          <path d="M 100 110 L 200 110 L 200 250 L 150 270 L 100 250 Z" fill="#F6EFE2" stroke="#1A1612" strokeWidth="1" />
          <circle cx="150" cy="120" r="5" fill="none" stroke="#1A1612" strokeWidth="1" />
          <text x="150" y="180" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic" fontSize="36" fill="#8B6914">I.</text>
          <line x1="120" y1="200" x2="180" y2="200" stroke="#8B6914" strokeWidth="0.6" />
          <text x="150" y="220" textAnchor="middle" fontFamily="Inter" fontSize="6" letterSpacing="3" fill="#1A1612">HANDMADE</text>
        </g>
      </svg>
    </div>
  )
}

export type PlaceholderKind = 'notebook' | 'agenda' | 'stickers' | 'keychain' | 'fotitos' | 'topper' | 'cuaderno' | 'tag'

export function ProductTile({
  kind = 'notebook',
  tone,
  label,
}: {
  kind?: PlaceholderKind
  tone?: Tone
  label?: string
}) {
  const map: Record<PlaceholderKind, React.ReactNode> = {
    notebook: <OpenNotebook tone={tone ?? 'cream'} />,
    agenda:   <Agenda     tone={tone ?? 'beige'} />,
    stickers: <Stickers   tone={tone ?? 'cream'} />,
    keychain: <Keychain   tone={tone ?? 'paper'} />,
    fotitos:  <Fotitos    tone={tone ?? 'beige'} />,
    topper:   <Topper     tone={tone ?? 'paper'} word={label ?? 'feliz'} />,
    cuaderno: <Cuaderno   tone={tone ?? 'sage'}  />,
    tag:      <Tag        tone={tone ?? 'cream'} />,
  }
  return <div style={{ width: '100%', height: '100%' }}>{map[kind] ?? map.notebook}</div>
}
