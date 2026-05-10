import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  // Obtenemos el token de la sesión de forma ligera (Edge compatible)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  // Verificamos si el usuario tiene el rol de ADMIN
  const isAdmin = (token as any)?.role === 'ADMIN'
  
  // Si intenta entrar a /admin y no es administrador, lo mandamos al login
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

// Esto define qué rutas activan este middleware
export const config = {
  matcher: ['/admin/:path*'],
}