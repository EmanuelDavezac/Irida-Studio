import { auth } from './src/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdmin = req.auth?.user?.role === 'ADMIN'
  if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
