import { useCallback, useEffect, useMemo, useState } from 'react'
import { Student } from '../types/student'
import { getStudentRepository, type StudentInput } from '../lib/student-repository'
import { addDaysUtcYmd, compareUtcYmd, parseIsoToUtcYmd, utcTodayYmd } from '../lib/date-utils'

export function useStudents() {
  const repository = useMemo(() => getStudentRepository(), [])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const nextStudents = await repository.list()
      setStudents(nextStudents)
    } catch (err) {
      console.error('Students load error:', err)
      setError('No se pudieron cargar los alumnos.')
    } finally {
      setLoading(false)
    }
  }, [repository])

  useEffect(() => {
    void loadStudents()
  }, [loadStudents])

  const addStudent = useCallback(
    async (student: StudentInput) => {
      try {
        setSaving(true)
        setError(null)
        const createdStudent = await repository.create(student)
        setStudents((prev) => [...prev, createdStudent])
        return createdStudent
      } catch (err) {
        console.error('Student create error:', err)
        setError('No se pudo guardar el alumno.')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [repository],
  )

  const updateStudent = useCallback(
    async (id: string, updates: StudentInput) => {
      try {
        setSaving(true)
        setError(null)
        const updatedStudent = await repository.update(id, updates)
        setStudents((prev) =>
          prev.map((student) => (student.id === id ? updatedStudent : student)),
        )
        return updatedStudent
      } catch (err) {
        console.error('Student update error:', err)
        setError('No se pudo actualizar el alumno.')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [repository],
  )

  const deleteStudent = useCallback(
    async (id: string) => {
      try {
        setSaving(true)
        setError(null)
        await repository.remove(id)
        setStudents((prev) => prev.filter((student) => student.id !== id))
      } catch (err) {
        console.error('Student delete error:', err)
        setError('No se pudo eliminar el alumno.')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [repository],
  )

  const renewSubscription = useCallback(
    async (id: string, months: number) => {
      try {
        setSaving(true)
        setError(null)
        const updatedStudent = await repository.renew(id, months)
        setStudents((prev) =>
          prev.map((student) => (student.id === id ? updatedStudent : student)),
        )
        return updatedStudent
      } catch (err) {
        console.error('Student renew error:', err)
        setError('No se pudo renovar la cuota.')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [repository],
  )

  const getStudentsByShift = useCallback(
    (shift: string) => {
      if (shift === 'Todos') return students
      return students.filter((student) => student.shift === shift)
    },
    [students],
  )

  const getExpiringSoon = useCallback(
    (days = 7) => {
      const today = utcTodayYmd()
      const targetDate = addDaysUtcYmd(today, days)

      return students.filter((student) => {
        const dueDate = parseIsoToUtcYmd(student.dueDate)
        return compareUtcYmd(dueDate, today) >= 0 && compareUtcYmd(dueDate, targetDate) <= 0
      })
    },
    [students],
  )

  const getExpired = useCallback(() => {
    const today = utcTodayYmd()
    return students.filter((student) => compareUtcYmd(parseIsoToUtcYmd(student.dueDate), today) < 0)
  }, [students])

  return {
    students,
    loading,
    saving,
    error,
    reload: loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByShift,
    getExpiringSoon,
    getExpired,
    renewSubscription,
  }
}
