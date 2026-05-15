'use client'
import { useState } from 'react'
import { loginAction } from './actions'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await loginAction(email.toLowerCase().trim(), password)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // si no hay error, signIn redirigió a /admin automáticamente
  }

  return (
    <div className="min-h-screen bg-ir-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-sans text-xs tracking-[0.2em] text-ir-mute uppercase mb-2">
            Irida Studio
          </p>
          <h1 className="font-serif text-3xl text-ir-ink">Panel admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-xs tracking-[0.12em] uppercase text-ir-mute mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-ir-line rounded-ir px-3.5 py-3 text-[14px] font-sans bg-white focus:outline-none focus:border-ir-gold transition-colors"
            />
          </div>
          <div>
            <label className="block font-sans text-xs tracking-[0.12em] uppercase text-ir-mute mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-ir-line rounded-ir px-3.5 py-3 text-[14px] font-sans bg-white focus:outline-none focus:border-ir-gold transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
