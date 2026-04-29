import { useState } from 'react';
import { Student, ShiftType } from '../types/student';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { DialogHeader, DialogTitle } from './ui/dialog';
import { isoFromDateInput } from '../lib/date-utils';

interface StudentFormProps {
  onSubmit: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'cloudId'>) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: Student;
}

export function StudentForm({ onSubmit, onCancel, initialData }: StudentFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    dueDate: initialData?.dueDate?.split('T')[0] || '',
    shift: initialData?.shift || ('16:00-17:00' as ShiftType),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: isoFromDateInput(formData.dueDate),
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {initialData ? 'Editar Alumno' : 'Nuevo Alumno'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
            placeholder="Juan"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
            placeholder="Pérez"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Celular</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="381 636 7658"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shift">Turno</Label>
          <Select
            value={formData.shift}
            onValueChange={(value) =>
              setFormData({ ...formData, shift: value as ShiftType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10:00-11:00">10:00 - 11:00</SelectItem>
              <SelectItem value="11:00-12:00">11:00 - 12:00</SelectItem>
              <SelectItem value="16:00-17:00">16:00 - 17:00</SelectItem>
              <SelectItem value="17:00-18:00">17:00 - 18:00</SelectItem>
              <SelectItem value="18:00-19:00">18:00 - 19:00</SelectItem>
              <SelectItem value="19:00-20:00">19:00 - 20:00</SelectItem>
              <SelectItem value="20:00-21:00">20:00 - 21:00</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {initialData ? 'Guardar Cambios' : 'Agregar Alumno'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
