import { useState } from 'react';
import { Student } from '../types/student';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar, CreditCard } from 'lucide-react';

interface RenewSubscriptionDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRenew: (id: string, months: number) => void;
}

export function RenewSubscriptionDialog({
  student,
  open,
  onOpenChange,
  onRenew,
}: RenewSubscriptionDialogProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1');

  if (!student) return null;

  const calculateNewDueDate = (months: number) => {
    // Si la cuota está vencida, calculamos desde hoy
    // Si aún está activa, calculamos desde la fecha de vencimiento actual
    const today = new Date();
    const currentDueDate = new Date(student.dueDate);
    const baseDate = currentDueDate < today ? today : currentDueDate;
    
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  const handleRenew = () => {
    const months = parseInt(selectedPeriod);
    onRenew(student.id, months);
    onOpenChange(false);
    setSelectedPeriod('1');
  };

  const isExpired = new Date(student.dueDate) < new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-800 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5" />
            Renovar Suscripción
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {student.firstName} {student.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isExpired && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-sm text-red-400">
              ⚠️ Cuota vencida. La renovación iniciará desde hoy.
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-zinc-300">Selecciona el período de renovación:</Label>
            <RadioGroup value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <div className="space-y-3">
                {[
                  { months: 1, label: '1 Mes' },
                  { months: 3, label: '3 Meses', discount: '5% descuento' },
                  { months: 6, label: '6 Meses', discount: '10% descuento' },
                  { months: 12, label: '1 Año', discount: '15% descuento' },
                ].map((option) => (
                  <div
                    key={option.months}
                    className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedPeriod === option.months.toString()
                        ? 'border-zinc-500 bg-zinc-700/50'
                        : 'border-zinc-700 hover:border-zinc-600'
                    }`}
                    onClick={() => setSelectedPeriod(option.months.toString())}
                  >
                    <RadioGroupItem
                      value={option.months.toString()}
                      id={`period-${option.months}`}
                    />
                    <Label
                      htmlFor={`period-${option.months}`}
                      className="flex-1 cursor-pointer text-white"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{option.label}</span>
                        {option.discount && (
                          <span className="text-xs text-green-400 font-medium">
                            {option.discount}
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="bg-zinc-700/30 border border-zinc-600 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <span className="font-medium">Nueva fecha de vencimiento:</span>
            </div>
            <p className="text-lg font-bold text-white">
              {calculateNewDueDate(parseInt(selectedPeriod)).toLocaleDateString(
                'es-AR',
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-zinc-700 text-white border-zinc-600 hover:bg-zinc-600"
          >
            Cancelar
          </Button>
          <Button onClick={handleRenew} className="flex-1 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700">
            Confirmar Renovación
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}