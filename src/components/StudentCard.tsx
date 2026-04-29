import { Student } from '../types/student';
import { Phone, Calendar, Clock, Trash2, Edit, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { diffDaysUtc, formatIsoDate } from '../lib/date-utils';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onRenew: (student: Student) => void;
}

export function StudentCard({ student, onEdit, onDelete, onRenew }: StudentCardProps) {
  const daysUntilDue = diffDaysUtc(student.dueDate);
  const isExpired = daysUntilDue < 0;
  const isExpiringSoon = daysUntilDue >= 0 && daysUntilDue <= 7;

  const getStatusBadge = () => {
    if (isExpired) {
      return <Badge className="bg-red-500 text-white">Vencida</Badge>;
    }
    if (isExpiringSoon) {
      return <Badge className="bg-yellow-500 text-white">Por vencer</Badge>;
    }
    return <Badge className="bg-green-500 text-white">Activa</Badge>;
  };

  const getShiftColor = () => {
    switch (student.shift) {
      case '20:00-21:00':
        return 'bg-green-900/30 text-green-400 border border-green-700/50';
      case '10:00-11:00':
        return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50';
      case '11:00-12:00':
        return 'bg-red-900/30 text-red-400 border border-red-700/50';
      case '16:00-17:00':
        return 'bg-blue-900/30 text-blue-400 border border-blue-700/50';
      case '17:00-18:00':
        return 'bg-orange-900/30 text-orange-400 border border-orange-700/50';
      case '18:00-19:00':
        return 'bg-purple-900/30 text-purple-400 border border-purple-700/50';
      case '19:00-20:00':
        return 'bg-pink-900/30 text-pink-400 border border-pink-700/50';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/50 hover:border-zinc-600 transition-all shadow-lg">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white">
              {student.firstName} {student.lastName}
            </h3>
            <div className="flex gap-2 mt-2">
              <Badge className={getShiftColor()}>{student.shift}</Badge>
              {getStatusBadge()}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRenew(student)}
              className="h-9 w-9 text-green-400 hover:text-green-300 hover:bg-green-900/20"
              title="Renovar suscripción"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(student)}
              className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
              title="Editar alumno"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(student.id)}
              className="h-9 w-9 text-red-400 hover:text-red-300 hover:bg-red-900/20"
              title="Eliminar alumno"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <Phone className="h-4 w-4" />
            <span>{student.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span>
              Vence: {formatIsoDate(student.dueDate, 'es-AR')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="h-4 w-4" />
            <span>
              {isExpired
                ? `Vencida hace ${Math.abs(daysUntilDue)} días`
                : `${daysUntilDue} días restantes`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
