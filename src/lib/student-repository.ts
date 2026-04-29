import { Student } from '../types/student'
import { isTauriApp } from './platform'
import { addMonthsToIsoDate } from './date-utils'

const STORAGE_KEY = 'gym_students'

export type StudentInput = Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'cloudId'>

export interface StudentRepository {
  list(): Promise<Student[]>
  create(input: StudentInput): Promise<Student>
  update(id: string, input: StudentInput): Promise<Student>
  remove(id: string): Promise<void>
  renew(id: string, months: number): Promise<Student>
}

class LocalStudentRepository implements StudentRepository {
  private read(): Student[] {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    try {
      const parsed = JSON.parse(stored) as Array<
        Student & { updatedAt?: string; cloudId?: string | null }
      >

      return parsed.map((student) => ({
        ...student,
        cloudId: student.cloudId ?? null,
        updatedAt: student.updatedAt ?? student.createdAt,
      }))
    } catch {
      return []
    }
  }

  private write(students: Student[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  }

  async list() {
    return this.read()
  }

  async create(input: StudentInput) {
    const now = new Date().toISOString()
    const student: Student = {
      id: crypto.randomUUID(),
      cloudId: null,
      createdAt: now,
      updatedAt: now,
      ...input,
    }

    const students = [...this.read(), student]
    this.write(students)
    return student
  }

  async update(id: string, input: StudentInput) {
    const students = this.read()
    const index = students.findIndex((student) => student.id === id)

    if (index === -1) {
      throw new Error('Alumno no encontrado')
    }

    const updatedStudent: Student = {
      ...students[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }

    students[index] = updatedStudent
    this.write(students)
    return updatedStudent
  }

  async remove(id: string) {
    this.write(this.read().filter((student) => student.id !== id))
  }

  async renew(id: string, months: number) {
    const students = this.read()
    const index = students.findIndex((student) => student.id === id)

    if (index === -1) {
      throw new Error('Alumno no encontrado')
    }

    const nextDueDateIso = addMonthsToIsoDate(students[index].dueDate, months)

    const updatedStudent: Student = {
      ...students[index],
      dueDate: nextDueDateIso,
      updatedAt: new Date().toISOString(),
    }

    students[index] = updatedStudent
    this.write(students)
    return updatedStudent
  }
}

class TauriStudentRepository implements StudentRepository {
  private async invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke<T>(command, args)
  }

  private async importLegacyStudentsIfNeeded() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const rawStudents = JSON.parse(stored) as Array<
        Partial<Student> & {
          id: string
          firstName: string
          lastName: string
          phone: string
          dueDate: string
          shift: Student['shift']
          createdAt: string
        }
      >
      const students: Student[] = rawStudents.map((student) => ({
        id: student.id,
        cloudId: student.cloudId ?? null,
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        dueDate: student.dueDate,
        shift: student.shift,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt ?? student.createdAt,
      }))
      if (students.length === 0) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      await this.invoke<Student[]>('import_students', { students })
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // If the old data is malformed we keep the app usable and skip the import.
    }
  }

  async list() {
    const students = await this.invoke<Student[]>('list_students')

    if (students.length > 0) {
      return students
    }

    await this.importLegacyStudentsIfNeeded()
    return this.invoke<Student[]>('list_students')
  }

  async create(input: StudentInput) {
    return this.invoke<Student>('create_student', { input })
  }

  async update(id: string, input: StudentInput) {
    return this.invoke<Student>('update_student', { id, input })
  }

  async remove(id: string) {
    await this.invoke('delete_student', { id })
  }

  async renew(id: string, months: number) {
    return this.invoke<Student>('renew_student_subscription', { id, months })
  }
}

let repository: StudentRepository | null = null

export function getStudentRepository(): StudentRepository {
  if (repository) {
    return repository
  }

  repository = isTauriApp
    ? new TauriStudentRepository()
    : new LocalStudentRepository()

  return repository
}
