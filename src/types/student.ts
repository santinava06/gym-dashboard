export interface Student {
  id: string;
  cloudId: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  dueDate: string; // ISO date string
  shift: '10:00-11:00' | '11:00-12:00' | '16:00-17:00' | '17:00-18:00' | '18:00-19:00' | '19:00-20:00' | '20:00-21:00';
  createdAt: string;
  updatedAt: string;
}

export type ShiftType = Student['shift'];
