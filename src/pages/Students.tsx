import { useState } from 'react';
import { useStudents } from '../hooks/useStudents';
import { StudentCard } from '../components/StudentCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Plus, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { Student } from '../types/student';
import {
  Dialog,
  DialogContent,
} from '../components/ui/dialog';
import { StudentForm } from '../components/StudentForm';
import { RenewSubscriptionDialog } from '../components/RenewSubscriptionDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export function Students() {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByShift,
    getExpiringSoon,
    getExpired,
    renewSubscription,
  } = useStudents();

  const [activeShift, setActiveShift] = useState<string>('Todos');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [renewingStudent, setRenewingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredStudents = getStudentsByShift(activeShift);
  const expiringSoon = getExpiringSoon();
  const expired = getExpired();

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleUpdate = (updates: Omit<Student, 'id' | 'createdAt'>) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, updates);
      setEditingStudent(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingStudentId(id);
  };

  const confirmDelete = () => {
    if (deletingStudentId) {
      deleteStudent(deletingStudentId);
      setDeletingStudentId(null);
    }
  };

  const handleAdd = (student: Omit<Student, 'id' | 'createdAt'>) => {
    addStudent(student);
    setIsAddDialogOpen(false);
  };

  const getStudentCountByShift = (shift: string) => {
    return shift === 'Todos'
      ? students.length
      : students.filter((s) => s.shift === shift).length;
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 text-white p-8 border-b border-zinc-700/50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-white">Gestión de Alumnos</h1>
          <p className="text-zinc-300">Administra la información de tus alumnos y sus cuotas</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Total Alumnos</p>
                  <p className="text-3xl font-bold text-white">{students.length}</p>
                </div>
                <div className="p-3 bg-zinc-700/50 rounded-lg">
                  <Users className="h-8 w-8 text-zinc-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/20 to-zinc-900 border-yellow-700/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Por Vencer</p>
                  <p className="text-3xl font-bold text-yellow-400">{expiringSoon.length}</p>
                </div>
                <div className="p-3 bg-yellow-700/20 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/20 to-zinc-900 border-red-700/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Vencidas</p>
                  <p className="text-3xl font-bold text-red-400">{expired.length}</p>
                </div>
                <div className="p-3 bg-red-700/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs por horario */}
      <div className="max-w-7xl mx-auto px-8">
        <Tabs value={activeShift} onValueChange={setActiveShift} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-zinc-800 border border-zinc-700/50">
            <TabsTrigger value="Todos" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              Todos
              <span className="ml-2 text-xs bg-zinc-700 px-2 py-0.5 rounded-full">
                {students.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="16:00-17:00" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              16:00-17:00
              <span className="ml-2 text-xs bg-zinc-700 px-2 py-0.5 rounded-full">
                {getStudentCountByShift('16:00-17:00')}
              </span>
            </TabsTrigger>
            <TabsTrigger value="17:00-18:00" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              17:00-18:00
              <span className="ml-2 text-xs bg-zinc-700 px-2 py-0.5 rounded-full">
                {getStudentCountByShift('17:00-18:00')}
              </span>
            </TabsTrigger>
            <TabsTrigger value="18:00-19:00" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              18:00-19:00
              <span className="ml-2 text-xs bg-zinc-700 px-2 py-0.5 rounded-full">
                {getStudentCountByShift('18:00-19:00')}
              </span>
            </TabsTrigger>
            <TabsTrigger value="19:00-20:00" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              19:00-20:00
              <span className="ml-2 text-xs bg-zinc-700 px-2 py-0.5 rounded-full">
                {getStudentCountByShift('19:00-20:00')}
              </span>
            </TabsTrigger>
          </TabsList>

          {['Todos', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'].map((shift) => (
            <TabsContent key={shift} value={shift} className="mt-0">
              {filteredStudents.length === 0 ? (
                <Card className="p-12 text-center bg-zinc-800 border-zinc-700/50">
                  <Users className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                  <p className="text-zinc-400 mb-4">
                    {shift === 'Todos'
                      ? 'No hay alumnos registrados'
                      : `No hay alumnos en el turno ${shift}`}
                  </p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Alumno
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onRenew={setRenewingStudent}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 border border-zinc-600"
        size="icon"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="h-8 w-8 text-white" />
      </Button>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-zinc-800 border-zinc-700 text-white">
          <StudentForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-zinc-800 border-zinc-700 text-white">
          {editingStudent && (
            <StudentForm
              onSubmit={handleUpdate}
              onCancel={() => setEditingStudent(null)}
              initialData={editingStudent}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Renew Subscription Dialog */}
      <RenewSubscriptionDialog
        open={!!renewingStudent}
        onOpenChange={() => setRenewingStudent(null)}
        student={renewingStudent}
        onRenew={renewSubscription}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingStudentId}
        onOpenChange={() => setDeletingStudentId(null)}
      >
        <AlertDialogContent className="bg-zinc-800 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar alumno?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Esta acción no se puede deshacer. El alumno será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-700 text-white border-zinc-600 hover:bg-zinc-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
