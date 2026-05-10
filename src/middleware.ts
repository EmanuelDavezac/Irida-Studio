import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdmin = req.auth?.user?.role === 'ADMIN'

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
