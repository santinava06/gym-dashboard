import { Dumbbell } from 'lucide-react'

export function AppSplash() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_34%),linear-gradient(160deg,#050816_0%,#0f172a_45%,#020617_100%)] text-white">
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-[12%] top-[18%] h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-[14%] right-[10%] h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <div className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 px-8 py-12 shadow-[0_30px_120px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_20px_60px_rgba(14,165,233,0.35)]">
            <Dumbbell className="h-11 w-11 text-white" />
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200/80">
              GymSY
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Iniciando panel de gestion
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-300">
              Preparando alumnos, cuotas y accesos para que entres directo al sistema.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-300" />
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-zinc-400">
              <span>Sistema de gestion</span>
              <span>Modo escritorio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
