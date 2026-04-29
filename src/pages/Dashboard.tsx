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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from '../components/ui/alert-dialog';

export function Dashboard() {
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-2">Mi Gimnasio</h1>
        <p className="text-blue-100">Panel de Gestión</p>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-xs text-gray-600">Total</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{expiringSoon.length}</p>
              <p className="text-xs text-gray-600">Por vencer</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">{expired.length}</p>
              <p className="text-xs text-gray-600">Vencidas</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs por turno */}
      <div className="px-4">
        <Tabs value={activeShift} onValueChange={setActiveShift} className="w-full">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex h-auto min-w-max bg-gray-200/50 p-1 mb-4 rounded-lg">
              {['Todos', '10:00-11:00', '11:00-12:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'].map((shift) => (
                <TabsTrigger key={shift} value={shift} className="rounded-md px-3 py-1.5 text-sm">
                  {shift}
                  <span className="ml-1 text-xs">({getStudentCountByShift(shift)})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {['Todos', '10:00-11:00', '11:00-12:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'].map((shift) => (
            <TabsContent key={shift} value={shift} className="mt-0">
              {filteredStudents.length === 0 ? (
                <Card className="p-8 text-center shadow-sm border-gray-200">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-4">
                    {shift === 'Todos'
                      ? 'No hay alumnos registrados'
                      : `No hay alumnos en el horario ${shift}`}
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Alumno
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <StudentForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
        onRenew={async (id, months) => { await renewSubscription(id, months); }}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingStudentId}
        onOpenChange={() => setDeletingStudentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar alumno?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El alumno será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}