import { PublicHoliday } from '@/types';
import holidaysData from '@/data/holidays.json';

type HolidaysData = Record<string, PublicHoliday[]>;

export function getPublicHolidays(year: number): PublicHoliday[] {
  const data = holidaysData as HolidaysData;
  return data[String(year)] || [];
}

export function getPublicHolidaysForMonth(year: number, month: number): PublicHoliday[] {
  const holidays = getPublicHolidays(year);
  const monthStr = String(month).padStart(2, '0');
  return holidays.filter((h) => h.date.startsWith(`${year}-${monthStr}`));
}

export function isPublicHoliday(date: Date): PublicHoliday | undefined {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const holidays = getPublicHolidays(year);
  return holidays.find((h) => h.date === dateStr);
}
