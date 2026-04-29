import { BadgeInfo, Building2, Database, MonitorSmartphone, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const version = '1.0.0'

export function About() {
  return (
    <div className="min-h-full pb-8">
      <div className="border-b border-zinc-700/50 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            <BadgeInfo className="h-4 w-4" />
            Informacion del sistema
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Acerca de GymSy Control</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Panel de gestion preparado para escritorio y encaminado para ejecucion mobile con Tauri 2.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="border-zinc-700/50 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white shadow-2xl">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                  GymSy
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  GymSy Control
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                  La aplicacion ya trabaja con almacenamiento local SQLite, login de administrador
                  y una arquitectura que facilita escalar a nube o mobile sin rehacer la UI.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-zinc-400">Version actual</p>
                <p className="mt-2 text-3xl font-semibold text-white">{version}</p>
                <p className="mt-4 text-sm text-zinc-400">Desarrollado por</p>
                <p className="mt-1 text-lg font-medium text-white">Santiago Navarro</p>
                <p className="mt-4 text-sm text-zinc-400">Plataforma</p>
                <p className="mt-1 text-lg font-medium text-white">Tauri + React + SQLite</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-zinc-700/50 bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Building2 className="h-5 w-5 text-cyan-300" />
                Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300">
              <p>Producto orientado a la gestion diaria de un gimnasio o estudio.</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-700/50 bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Database className="h-5 w-5 text-cyan-300" />
                Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300">
              <p>Persistencia local con SQLite, lista para seguir creciendo con sincronizacion futura.</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-700/50 bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                Acceso
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300">
              <p>Ingreso protegido con usuario administrador y sesion persistida localmente.</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-700/50 bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <MonitorSmartphone className="h-5 w-5 text-cyan-300" />
                Expansion
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300">
              <p>Frontend ya adaptado para pantallas chicas y base lista para continuar el frente iOS.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
