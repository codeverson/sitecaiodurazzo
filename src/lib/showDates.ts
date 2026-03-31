export function parseShowDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isShowPast(dateStr: string): boolean {
  return parseShowDate(dateStr) < startOfToday();
}

export function compareShowDates(a: string, b: string): number {
  return parseShowDate(a).getTime() - parseShowDate(b).getTime();
}
