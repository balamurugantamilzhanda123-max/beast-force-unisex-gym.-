export function addDays(date: string | Date, days: number) {
  const base = typeof date === "string" ? new Date(`${date}T00:00:00.000Z`) : new Date(date);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
