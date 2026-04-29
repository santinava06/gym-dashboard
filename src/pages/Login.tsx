import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, LockKeyhole, ShieldCheck, UserCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Alert, AlertDescription } from '../components/ui/alert'
import { isTauriApp } from '../lib/platform'

export const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [enabledUsername, setEnabledUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isTauriApp) {
      setEnabledUsername('admin')
      return
    }

    let cancelled = false
    const loadHint = async () => {
      try {
        const { invoke } = await import('@tauri-apps/api/core')
        const hint = await invoke<string>('get_login_username_hint')
        if (cancelled) return
        if (hint) {
          setEnabledUsername(hint)
          setUsername((prev) => prev || hint)
        }
      } catch {
        // If the hint fails, keep the default.
      }
    }

    void loadHint()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = await login(username, password)
    if (success) {
      navigate('/')
      return
    }

    setError('Solo el usuario administrador puede ingresar.')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(145deg,#09090b_0%,#18181b_48%,#020617_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-100">
              <ShieldCheck className="h-4 w-4" />
              Acceso protegido
            </div>
            <h1 className="mt-8 max-w-md text-5xl font-semibold tracking-tight text-white">
              Controla alumnos, cuotas y turnos desde un solo panel.
            </h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-zinc-400">Perfil habilitado</p>
              <p className="mt-2 text-2xl font-semibold text-white">Administrador</p>
              <p className="mt-1 text-sm text-zinc-400">Acceso completo al sistema</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-zinc-400">Sistema De Gestion</p>
              <p className="mt-2 text-2xl font-semibold text-white">Para gimnasios</p>
              <p className="mt-1 text-sm text-zinc-400">Control de asistencia y pagos</p>
            </div>
          </div>
        </section>

        <div className="bg-zinc-900/70 border border-zinc-700/70 rounded-[2rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl">
          <div className="mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-950/50">
              <LockKeyhole className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-white">Ingreso</h2>
          </div>

          {error && (
            <Alert className="mb-6 bg-red-900/30 border-red-700 text-red-200">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-200">
                Usuario
              </label>
              <div className="relative">
                <UserCircle2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="h-12 border-zinc-700 bg-zinc-800/80 pl-10 text-white placeholder:text-zinc-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-200">
                Contrasena
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contrasena"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-12 border-zinc-700 bg-zinc-800/80 pl-10 text-white placeholder:text-zinc-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
              Usuario habilitado:{' '}
              <span className="font-semibold text-zinc-100">{enabledUsername}</span>
            </div>

            <Button
              type="submit"
              disabled={loading || !username || !password}
              className="mt-6 h-12 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-base font-semibold text-white hover:from-blue-600 hover:to-cyan-600"
            >
              {loading ? 'Validando acceso...' : 'Ingresar'}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs uppercase tracking-[0.25em] text-zinc-500">
            GymSY 2026
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
