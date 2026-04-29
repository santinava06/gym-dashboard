import { useEffect, useState } from 'react'
import { AlertTriangle, Bell, Calendar, Clock, TrendingDown } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { diffDaysUtc, formatIsoDate } from '../lib/date-utils'

export function NotificationsPopover() {
  const { getExpiringSoon, getExpired } = useStudents()
  const [isOpen, setIsOpen] = useState(false)
  const [expiringSoon, setExpiringSoon] = useState(getExpiringSoon())
  const [expired, setExpired] = useState(getExpired())

  useEffect(() => {
    if (!isOpen) return
    setExpiringSoon(getExpiringSoon())
    setExpired(getExpired())
  }, [isOpen, getExpiringSoon, getExpired])

  const totalNotifications = expiringSoon.length + expired.length

  const formatDate = (dateString: string) =>
    formatIsoDate(dateString, 'es-AR', {
      day: 'numeric',
      month: 'short',
    })

  const getDayLabel = (dateString: string, isExpired: boolean) => {
    const diff = diffDaysUtc(dateString)
    const days = Math.abs(diff)
    if (isExpired) return days === 1 ? '1 dia' : `${days} dias`
    if (diff === 0) return 'Hoy'
    if (diff === 1) return 'Manana'
    return `${diff} dias`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
          <Bell className="h-5 w-5" />
          {totalNotifications > 0 && (
            <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {totalNotifications}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="max-h-[75vh] w-[min(92vw,28rem)] overflow-hidden rounded-2xl border-zinc-700 bg-zinc-800 p-0 text-white shadow-2xl sm:w-[min(92vw,34rem)]"
      >
        {totalNotifications === 0 ? (
          <div className="p-10 text-center sm:p-16">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-zinc-700/50 p-4">
                <Bell className="h-10 w-10 text-zinc-500" />
              </div>
            </div>
            <p className="text-lg font-semibold text-zinc-200">Sin notificaciones</p>
            <p className="mt-2 text-sm text-zinc-400">Todos tus estudiantes estan en regla.</p>
          </div>
        ) : (
          <div className="flex max-h-[75vh] flex-col">
            <div className="sticky top-0 z-20 border-b-2 border-zinc-700/50 bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Notificaciones
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    {totalNotifications} {totalNotifications === 1 ? 'alerta' : 'alertas'} pendientes
                  </p>
                </div>
                <div className="text-right text-2xl font-bold text-red-400">{totalNotifications}</div>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-5">
              {expired.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-red-700/30 p-2.5">
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-red-300">Cuotas vencidas</h3>
                      <p className="text-xs text-red-500">
                        {expired.length} {expired.length === 1 ? 'alumno' : 'alumnos'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pl-1">
                    {expired.map((student) => (
                      <div
                        key={student.id}
                        className="group cursor-pointer rounded-lg border-l-4 border-red-500 bg-gradient-to-br from-red-900/30 to-red-900/10 p-4 transition-all duration-200 hover:from-red-900/40 hover:to-red-900/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-red-100 transition-colors group-hover:text-red-50">
                              {student.firstName} {student.lastName}
                            </p>
                            <div className="mt-2 space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-red-300">
                                <Calendar className="h-4 w-4" />
                                Vencido hace {getDayLabel(student.dueDate, true)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-red-400">
                                <Clock className="h-4 w-4" />
                                {student.shift} | {formatDate(student.dueDate)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block whitespace-nowrap rounded-full bg-red-600/40 px-3 py-1 text-xs font-semibold text-red-200">
                              URGENTE
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expired.length > 0 && expiringSoon.length > 0 && (
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
              )}

              {expiringSoon.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-yellow-700/30 p-2.5">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-yellow-300">Proximas a vencer</h3>
                      <p className="text-xs text-yellow-500">
                        {expiringSoon.length} {expiringSoon.length === 1 ? 'alumno' : 'alumnos'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pl-1">
                    {expiringSoon.map((student) => (
                      <div
                        key={student.id}
                        className="group cursor-pointer rounded-lg border-l-4 border-yellow-500 bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 p-4 transition-all duration-200 hover:from-yellow-900/40 hover:to-yellow-900/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-yellow-100 transition-colors group-hover:text-yellow-50">
                              {student.firstName} {student.lastName}
                            </p>
                            <div className="mt-2 space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-yellow-300">
                                <Calendar className="h-4 w-4" />
                                Vence en {getDayLabel(student.dueDate, false)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-yellow-400">
                                <Clock className="h-4 w-4" />
                                {student.shift} | {formatDate(student.dueDate)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block whitespace-nowrap rounded-full bg-yellow-600/40 px-3 py-1 text-xs font-semibold text-yellow-200">
                              PROXIMO
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 z-20 border-t-2 border-zinc-700/50 bg-gradient-to-r from-zinc-800 to-zinc-700 px-4 py-4 sm:px-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg border border-red-700/50 bg-red-900/30 px-3 py-2">
                  <p className="text-2xl font-bold text-red-400">{expired.length}</p>
                  <p className="mt-1 text-xs text-red-300">Vencidas</p>
                </div>
                <div className="rounded-lg border border-yellow-700/50 bg-yellow-900/30 px-3 py-2">
                  <p className="text-2xl font-bold text-yellow-400">{expiringSoon.length}</p>
                  <p className="mt-1 text-xs text-yellow-300">Proximas</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
