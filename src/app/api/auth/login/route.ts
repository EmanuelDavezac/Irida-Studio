import { NextResponse } from 'next/server'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
