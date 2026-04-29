export type UtcYmd = {
  year: number
  month: number // 1-12
  day: number // 1-31
}

export function isoFromDateInput(dateInput: string): string {
  const [yearStr, monthStr, dayStr] = dateInput.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString()
}

export function parseIsoToUtcYmd(iso: string): UtcYmd {
  const date = new Date(iso)
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

export function utcYmdToIso(ymd: UtcYmd): string {
  return new Date(
    Date.UTC(ymd.year, ymd.month - 1, ymd.day, 0, 0, 0, 0),
  ).toISOString()
}

export function daysInUtcMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export function addMonthsUtcYmd(base: UtcYmd, months: number): UtcYmd {
  const totalMonths = base.year * 12 + (base.month - 1) + months
  const year = Math.floor(totalMonths / 12)
  const month = (totalMonths % 12) + 1
  const lastDay = daysInUtcMonth(year, month)
  const day = Math.min(base.day, lastDay)

  return { year, month, day }
}

export function addMonthsToIsoDate(iso: string, months: number): string {
  const base = parseIsoToUtcYmd(iso)
  return utcYmdToIso(addMonthsUtcYmd(base, months))
}

export function utcTodayYmd(ref = new Date()): UtcYmd {
  return {
    year: ref.getUTCFullYear(),
    month: ref.getUTCMonth() + 1,
    day: ref.getUTCDate(),
  }
}

export function addDaysUtcYmd(base: UtcYmd, days: number): UtcYmd {
  const baseMs = Date.UTC(base.year, base.month - 1, base.day)
  const next = new Date(baseMs + days * 24 * 60 * 60 * 1000)
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  }
}

export function compareUtcYmd(a: UtcYmd, b: UtcYmd): number {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  return a.day - b.day
}

export function diffDaysUtc(iso: string, ref = new Date()): number {
  const due = parseIsoToUtcYmd(iso)
  const today = utcTodayYmd(ref)
  const dueMs = Date.UTC(due.year, due.month - 1, due.day)
  const todayMs = Date.UTC(today.year, today.month - 1, today.day)
  return Math.round((dueMs - todayMs) / (24 * 60 * 60 * 1000))
}

export function formatIsoDate(
  iso: string,
  locale = 'es-AR',
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Date(iso).toLocaleDateString(locale, { timeZone: 'UTC', ...options })
}

