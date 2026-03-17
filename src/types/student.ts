export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  dueDate: string; // ISO date string
  shift: '16:00-17:00' | '17:00-18:00' | '18:00-19:00' | '19:00-20:00';
  createdAt: string;
}

export type ShiftType = Student['shift'];