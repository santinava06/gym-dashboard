import { useStudents } from '../hooks/useStudents';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Clock, Users } from 'lucide-react';

export function Schedule() {
  const { students } = useStudents();

  const shifts = [
    { time: '16:00-17:00', label: '16:00 - 17:00' },
    { time: '17:00-18:00', label: '17:00 - 18:00' },
    { time: '18:00-19:00', label: '18:00 - 19:00' },
    { time: '19:00-20:00', label: '19:00 - 20:00' },
  ];

  const getStudentsByShift = (shift: string) => {
    return students.filter((s) => s.shift === shift);
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 text-white p-8 border-b border-zinc-700/50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-white">Turnos y Horarios</h1>
          <p className="text-zinc-300">Visualiza la distribución de alumnos por horario</p>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shifts.map((shift) => {
            const shiftStudents = getStudentsByShift(shift.time);
            const studentCount = shiftStudents.length;

            return (
              <Card
                key={shift.time}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/50 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <CardHeader className="pb-3 border-b border-zinc-700/50">
                  <div className="flex items-center justify-between">
                    <Clock className="h-5 w-5 text-zinc-400" />
                    <span className="text-xs bg-zinc-700 px-2 py-1 rounded-full text-zinc-300">
                      {studentCount} {studentCount === 1 ? 'alumno' : 'alumnos'}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-white mt-2">
                    {shift.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {studentCount === 0 ? (
                    <div className="text-center py-6">
                      <Users className="h-10 w-10 mx-auto mb-2 text-zinc-700" />
                      <p className="text-sm text-zinc-500">Sin alumnos</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {shiftStudents.map((student) => (
                        <div
                          key={student.id}
                          className="p-3 bg-zinc-700/30 rounded-lg border border-zinc-700/50 hover:bg-zinc-700/50 transition-colors"
                        >
                          <p className="text-sm font-medium text-white">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-zinc-400 mt-1">
                            {student.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <Card className="mt-8 bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Resumen de Ocupación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shifts.map((shift) => {
                const count = getStudentsByShift(shift.time).length;
                const MAX_PER_SHIFT = 5;
                const percentage = Math.min((count / MAX_PER_SHIFT) * 100, 100);

                return (
                  <div key={shift.time} className="text-center">
                    <p className="text-sm text-zinc-400 mb-2">{shift.label}</p>
                    <div className="relative h-24 bg-zinc-700/30 rounded-lg overflow-hidden">
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-zinc-600 to-zinc-500 transition-all duration-500"
                        style={{ height: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white z-10">
                          {count}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      {percentage.toFixed(0)}% del total
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
