'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(
  email: string,
  password: string,
): Promise<{ error?: string; ok?: boolean }> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin',
    })
    return { ok: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email o contraseña incorrectos' }
    }
    // signIn throws NEXT_REDIRECT on success — treat it as ok
    // so the client can navigate with window.location (reliable on mobile)
    const digest = (error as { digest?: string }).digest ?? ''
    if (digest.startsWith('NEXT_REDIRECT')) {
      return { ok: true }
    }
    throw error
  }
}
