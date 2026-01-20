import { DayOfWeek } from '@/types';

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, getDaysInMonth(year, month)).getDay();
}

export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfWeek: number;
}

export function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const today = new Date();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    days.push({
      date,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: false,
      dayOfWeek: (firstDayOfMonth - i - 1 + 7) % 7,
    });
  }
  
  for (let date = 1; date <= daysInMonth; date++) {
    const dayOfWeek = (firstDayOfMonth + date - 1) % 7;
    days.push({
      date,
      month,
      year,
      isCurrentMonth: true,
      isToday: today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === date,
      dayOfWeek,
    });
  }
  
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: false,
        dayOfWeek: (days.length) % 7,
      });
    }
  }
  
  return days;
}

export function getWeeksCount(year: number, month: number): number {
  const days = generateCalendarDays(year, month);
  return Math.ceil(days.length / 7);
}

export function getDayOfWeekName(dayOfWeek: number): string {
  const names = ['일', '월', '화', '수', '목', '금', '토'];
  return names[dayOfWeek];
}

export function getDayOfWeekKey(dayOfWeek: number): DayOfWeek {
  const keys: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return keys[dayOfWeek];
}

export function formatMonth(year: number, month: number): string {
  return `${year}년 ${month}월`;
}

export function getPrevMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}
