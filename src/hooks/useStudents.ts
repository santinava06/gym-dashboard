import { useState, useEffect } from 'react';
import { Student } from '../types/student';

const STORAGE_KEY = 'gym_students';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updates } : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const getStudentsByShift = (shift: string) => {
    if (shift === 'Todos') return students;
    return students.filter((student) => student.shift === shift);
  };

  const getExpiringSoon = (days: number = 7) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + days);

    return students.filter((student) => {
      const dueDate = new Date(student.dueDate);
      return dueDate >= today && dueDate <= targetDate;
    });
  };

  const getExpired = () => {
    const today = new Date();
    return students.filter((student) => {
      const dueDate = new Date(student.dueDate);
      return dueDate < today;
    });
  };

  const renewSubscription = (id: string, months: number) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;

        const today = new Date();
        const currentDueDate = new Date(student.dueDate);
        // Si está vencida, calculamos desde hoy, si no, desde la fecha de vencimiento
        const baseDate = currentDueDate < today ? today : currentDueDate;
        
        const newDueDate = new Date(baseDate);
        newDueDate.setMonth(newDueDate.getMonth() + months);

        return {
          ...student,
          dueDate: newDueDate.toISOString(),
        };
      })
    );
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByShift,
    getExpiringSoon,
    getExpired,
    renewSubscription,
  };
}