import { useState } from 'react'
import { AlertCircle, ChevronLeft, ChevronRight, Plus, Search, TrendingUp, Users } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { Student } from '../types/student'
import { StudentCard } from '../components/StudentCard'
import { StudentForm } from '../components/StudentForm'
import { RenewSubscriptionDialog } from '../components/RenewSubscriptionDialog'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Dialog, DialogContent } from '../components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog'

const SHIFTS = [
  'Todos',
  '10:00-11:00',
  '11:00-12:00',
  '16:00-17:00',
  '17:00-18:00',
  '18:00-19:00',
  '19:00-20:00',
  '20:00-21:00',
] as const

export function Students() {
  const {
    students,
    loading,
    saving,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByShift,
    getExpiringSoon,
    getExpired,
    renewSubscription,
  } = useStudents()

  const [activeShift, setActiveShift] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [renewingStudent, setRenewingStudent] = useState<Student | null>(null)
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const studentsPerPage = 6
  const filteredStudents = getStudentsByShift(activeShift).filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / studentsPerPage))
  const startIndex = (currentPage - 1) * studentsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage)
  const expiringSoon = getExpiringSoon()
  const expired = getExpired()

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
  }

  const handleUpdate = async (
    updates: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'cloudId'>,
  ) => {
    if (!editingStudent) return
    await updateStudent(editingStudent.id, updates)
    setEditingStudent(null)
  }

  const confirmDelete = async () => {
    if (!deletingStudentId) return
    await deleteStudent(deletingStudentId)
    setDeletingStudentId(null)
  }

  const handleAdd = async (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'cloudId'>) => {
    await addStudent(student)
    setIsAddDialogOpen(false)
  }

  const getStudentCountByShift = (shift: string) =>
    shift === 'Todos' ? students.length : students.filter((student) => student.shift === shift).length

  return (
    <div className="min-h-full pb-28 lg:pb-10">
      <div className="border-b border-zinc-700/50 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
            Alumnos
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Gestion de alumnos</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Administra informacion, vencimientos y turnos.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="-mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Total alumnos</p>
                  <p className="mt-1 text-3xl font-bold text-white">{students.length}</p>
                </div>
                <div className="rounded-xl bg-zinc-700/50 p-3">
                  <Users className="h-7 w-7 text-zinc-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-700/30 bg-gradient-to-br from-yellow-900/20 to-zinc-900 shadow-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Por vencer</p>
                  <p className="mt-1 text-3xl font-bold text-yellow-400">{expiringSoon.length}</p>
                </div>
                <div className="rounded-xl bg-yellow-700/20 p-3">
                  <AlertCircle className="h-7 w-7 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-700/30 bg-gradient-to-br from-red-900/20 to-zinc-900 shadow-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Vencidas</p>
                  <p className="mt-1 text-3xl font-bold text-red-400">{expired.length}</p>
                </div>
                <div className="rounded-xl bg-red-700/20 p-3">
                  <TrendingUp className="h-7 w-7 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="mt-6 border-red-700/50 bg-red-950/40 text-red-100">
            <CardContent className="p-4 text-sm">{error}</CardContent>
          </Card>
        )}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Buscar por nombre..."
              className="h-12 border-zinc-700 bg-zinc-800 pl-10 text-white placeholder-zinc-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            disabled={loading || saving}
            className="hidden h-12 bg-white text-zinc-900 border border-zinc-200 shadow-lg px-5 hover:bg-zinc-100 sm:inline-flex font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo alumno
          </Button>
        </div>

        <Tabs value={activeShift} onValueChange={(shift) => { setActiveShift(shift); setCurrentPage(1) }} className="mt-6 w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex h-auto min-w-full gap-2 border border-zinc-700/50 bg-zinc-800 p-2">
              {SHIFTS.map((shift) => {
                const compactLabel = shift === 'Todos' ? 'Todos' : shift.slice(0, 5)
                return (
                  <TabsTrigger
                    key={shift}
                    value={shift}
                    className="min-w-fit whitespace-nowrap rounded-lg px-3 py-2 text-xs text-zinc-300 data-[state=active]:bg-zinc-700 data-[state=active]:text-white sm:text-sm"
                  >
                    {compactLabel}
                    <span className="ml-2 rounded-full bg-zinc-700 px-1.5 py-0.5 text-[10px]">
                      {getStudentCountByShift(shift)}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {SHIFTS.map((shift) => (
            <TabsContent key={shift} value={shift} className="mt-4">
              {loading ? (
                <Card className="border-zinc-700/50 bg-zinc-800 p-10 text-center">
                  <p className="text-zinc-400">Cargando alumnos...</p>
                </Card>
              ) : filteredStudents.length === 0 ? (
                <Card className="border-zinc-700/50 bg-zinc-800 p-10 text-center">
                  <Users className="mx-auto mb-4 h-14 w-14 text-zinc-600" />
                  <p className="mb-4 text-zinc-400">
                    {shift === 'Todos'
                      ? 'No hay alumnos registrados.'
                      : `No hay alumnos en el turno ${shift}.`}
                  </p>
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar primer alumno
                  </Button>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedStudents.map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onEdit={setEditingStudent}
                        onDelete={setDeletingStudentId}
                        onRenew={setRenewingStudent}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-zinc-400">
                        Pagina {currentPage} de {totalPages} con {filteredStudents.length}{' '}
                        estudiante{filteredStudents.length === 1 ? '' : 's'}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                          disabled={currentPage === 1}
                          className="border-zinc-700 hover:bg-zinc-700"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                          disabled={currentPage === totalPages}
                          className="border-zinc-700 hover:bg-zinc-700"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Button
        className="safe-bottom fixed bottom-4 right-4 h-14 w-14 rounded-full bg-white text-zinc-900 border border-zinc-200 shadow-2xl hover:bg-zinc-100 sm:hidden"
        size="icon"
        onClick={() => setIsAddDialogOpen(true)}
        disabled={loading || saving}
      >
        <Plus className="h-7 w-7 text-zinc-900" />
      </Button>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto border-zinc-700 bg-zinc-800 text-white">
          <StudentForm onSubmit={handleAdd} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto border-zinc-700 bg-zinc-800 text-white">
          {editingStudent && (
            <StudentForm
              onSubmit={handleUpdate}
              onCancel={() => setEditingStudent(null)}
              initialData={editingStudent}
            />
          )}
        </DialogContent>
      </Dialog>

      <RenewSubscriptionDialog
        open={!!renewingStudent}
        onOpenChange={() => setRenewingStudent(null)}
        student={renewingStudent}
        onRenew={async (id, months) => { await renewSubscription(id, months); }}
      />

      <AlertDialog open={!!deletingStudentId} onOpenChange={() => setDeletingStudentId(null)}>
        <AlertDialogContent className="border-zinc-700 bg-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar alumno</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Esta accion no se puede deshacer. El alumno quedara fuera de la lista activa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-600 bg-zinc-700 text-white hover:bg-zinc-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
