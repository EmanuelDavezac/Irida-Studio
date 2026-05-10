'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(email: string, password: string): Promise<{ error?: string }> {
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin',
    })
    return {}
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email o contraseña incorrectos' }
    }
    // signIn lanza NEXT_REDIRECT en éxito — hay que re-lanzarlo
    throw error
  }
}
