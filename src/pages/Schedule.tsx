import { useState } from 'react'
import { Clock, Users } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../components/ui/drawer'
import { formatIsoDate } from '../lib/date-utils'

const shifts = [
  { time: '10:00-11:00', label: '10:00 - 11:00' },
  { time: '11:00-12:00', label: '11:00 - 12:00' },
  { time: '16:00-17:00', label: '16:00 - 17:00' },
  { time: '17:00-18:00', label: '17:00 - 18:00' },
  { time: '18:00-19:00', label: '18:00 - 19:00' },
  { time: '19:00-20:00', label: '19:00 - 20:00' },
  { time: '20:00-21:00', label: '20:00 - 21:00' },
]

export function Schedule() {
  const { students } = useStudents()
  const [selectedShift, setSelectedShift] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const getStudentsByShift = (shift: string) => students.filter((student) => student.shift === shift)

  const handleShiftClick = (shiftTime: string) => {
    setSelectedShift(shiftTime)
    setIsDrawerOpen(true)
  }

  return (
    <div className="min-h-full pb-8">
      <div className="border-b border-zinc-700/50 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
            Turnos
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Turnos y horarios</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Visualiza la ocupacion por franja horaria y abre el detalle tocando cualquier turno.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shifts.map((shift) => {
            const shiftStudents = getStudentsByShift(shift.time)
            const studentCount = shiftStudents.length

            return (
              <button
                key={shift.time}
                onClick={() => handleShiftClick(shift.time)}
                className="rounded-2xl border border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 text-left shadow-xl transition-all hover:border-zinc-600 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <Clock className="h-5 w-5 text-zinc-400" />
                  <span className="rounded-full bg-zinc-700 px-2 py-1 text-xs text-zinc-300">
                    {studentCount} {studentCount === 1 ? 'alumno' : 'alumnos'}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-white">{shift.label}</h3>

                {studentCount === 0 ? (
                  <div className="flex min-h-24 items-center justify-center text-center">
                    <div>
                      <Users className="mx-auto mb-2 h-8 w-8 text-zinc-700" />
                      <p className="text-sm text-zinc-500">Sin alumnos asignados</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-1">
                    {shiftStudents.slice(0, 3).map((student) => (
                      <p key={student.id} className="truncate text-sm text-zinc-300">
                        {student.firstName} {student.lastName}
                      </p>
                    ))}
                    {studentCount > 3 && (
                      <p className="pt-1 text-xs italic text-zinc-500">
                        +{studentCount - 3} mas en este horario
                      </p>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <Card className="mt-8 border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Resumen de ocupacion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">
              {shifts.map((shift) => {
                const count = getStudentsByShift(shift.time).length
                const maxPerShift = 10
                const percentage = Math.min((count / maxPerShift) * 100, 100)

                return (
                  <div key={shift.time} className="text-center">
                    <p className="mb-2 text-sm text-zinc-400">{shift.label}</p>
                    <div className="relative h-24 overflow-hidden rounded-xl bg-zinc-700/30">
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-blue-500 transition-all duration-500"
                        style={{ height: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="z-10 text-2xl font-bold text-white">{count}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">{percentage.toFixed(0)}% de capacidad</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="border-zinc-700 bg-zinc-800 text-white">
          {selectedShift && (
            <>
              <DrawerHeader className="border-b border-zinc-700/50">
                <DrawerTitle className="text-xl text-white">
                  Alumnos del turno {shifts.find((shift) => shift.time === selectedShift)?.label}
                </DrawerTitle>
                <DrawerDescription className="text-zinc-400">
                  {getStudentsByShift(selectedShift).length} estudiante
                  {getStudentsByShift(selectedShift).length === 1 ? '' : 's'}
                </DrawerDescription>
              </DrawerHeader>

              <div className="max-h-[65vh] overflow-y-auto p-5">
                {getStudentsByShift(selectedShift).length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-center">
                    <div>
                      <Users className="mx-auto mb-3 h-12 w-12 text-zinc-600" />
                      <p className="text-zinc-400">No hay alumnos en este turno.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getStudentsByShift(selectedShift).map((student) => (
                      <div
                        key={student.id}
                        className="rounded-xl border border-zinc-600/50 bg-zinc-700/30 p-4"
                      >
                        <p className="font-medium text-white">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">Telefono: {student.phone}</p>
                        <p className="text-sm text-zinc-400">
                          Vencimiento: {formatIsoDate(student.dueDate, 'es-AR')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-700/50 p-4">
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full border-zinc-600 text-white hover:bg-zinc-700">
                    Cerrar
                  </Button>
                </DrawerClose>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}
