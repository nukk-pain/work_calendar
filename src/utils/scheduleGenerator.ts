import {
  Config,
  MonthSchedule,
  DayData,
  DoctorDaySchedule,
  RecurringRule,
  DayOfWeek,
  PublicHoliday,
} from '@/types';
import { getDaysInMonth, getDayOfWeekKey } from './calendar';

const DAY_OF_WEEK_MAP: Record<number, DayOfWeek> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay();
  return Math.ceil((date.getDate() + firstDayOfWeek) / 7);
}

function isRuleApplicable(
  rule: RecurringRule,
  date: Date,
  dayOfWeek: number
): boolean {
  if (rule.dayOfWeek !== dayOfWeek) return false;

  switch (rule.type) {
    case 'weekly':
      return true;

    case 'biweekly':
      if (!rule.referenceDate) return false;
      const refDate = new Date(rule.referenceDate);
      const diffTime = date.getTime() - refDate.getTime();
      const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
      const isOffWeek = diffWeeks % 2 === 0;
      return rule.isOffWeek ? isOffWeek : !isOffWeek;

    case 'monthly':
      if (!rule.weekOfMonth) return false;
      return getWeekOfMonth(date) === rule.weekOfMonth;

    default:
      return false;
  }
}

function applyRecurringRules(
  rules: RecurringRule[],
  doctorId: string,
  date: Date,
  dayOfWeek: number,
  baseSchedule: DoctorDaySchedule
): DoctorDaySchedule {
  const applicableRules = rules.filter(
    (r) => r.doctorId === doctorId && isRuleApplicable(r, date, dayOfWeek)
  );

  if (applicableRules.length === 0) return baseSchedule;

  let result = { ...baseSchedule };

  for (const rule of applicableRules) {
    switch (rule.period) {
      case 'all':
        result = { status: 'off', isManualEdit: false };
        break;
      case 'morning':
        if (result.status === 'work' && result.start && result.end) {
          result = {
            status: 'afternoon',
            start: '14:00',
            end: result.end,
            isManualEdit: false,
          };
        }
        break;
      case 'afternoon':
        if (result.status === 'work' && result.start && result.end) {
          result = {
            status: 'morning',
            start: result.start,
            end: '13:00',
            isManualEdit: false,
          };
        }
        break;
    }
  }

  return result;
}

export function generateMonthSchedule(
  year: number,
  month: number,
  config: Config,
  publicHolidays: PublicHoliday[] = [],
  existingSchedule?: MonthSchedule,
  defaultNoticeText?: string
): MonthSchedule {
  const daysInMonth = getDaysInMonth(year, month);
  const days: Record<string, DayData> = {};

  const activeDoctors = config.doctors.filter((d) => d.active);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const dayOfWeekKey = DAY_OF_WEEK_MAP[dayOfWeek];
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const existingDay = existingSchedule?.days[String(day)];

    const publicHoliday = publicHolidays.find((h) => h.date === dateStr);
    const hospitalHoliday = config.hospitalHolidays.find((h) => {
      if (h.type === 'fixed') return h.date === dateStr;
      if (h.type === 'yearly') return h.month === month && h.day === day;
      return false;
    });

    const isHoliday = !!publicHoliday || !!hospitalHoliday;
    const holidayName = publicHoliday?.name || hospitalHoliday?.name;

    const doctors: Record<string, DoctorDaySchedule> = {};

    for (const doctor of activeDoctors) {
      const existingDoctorSchedule = existingDay?.doctors[doctor.id];
      
      if (existingDoctorSchedule?.isManualEdit) {
        doctors[doctor.id] = existingDoctorSchedule;
        continue;
      }

      if (isHoliday) {
        doctors[doctor.id] = { status: 'off', isManualEdit: false };
        continue;
      }

      const defaultSchedule = config.defaultSchedule[doctor.id];
      const daySchedule = defaultSchedule?.[dayOfWeekKey];

      let baseSchedule: DoctorDaySchedule;
      if (!daySchedule) {
        baseSchedule = { status: 'off', isManualEdit: false };
      } else {
        baseSchedule = {
          status: 'work',
          start: daySchedule.start,
          end: daySchedule.end,
          isManualEdit: false,
        };
      }

      doctors[doctor.id] = applyRecurringRules(
        config.recurringRules,
        doctor.id,
        date,
        dayOfWeek,
        baseSchedule
      );
    }

    days[String(day)] = {
      isHoliday,
      holidayName,
      doctors,
    };
  }

  return {
    year,
    month,
    generatedAt: new Date().toISOString(),
    days,
    noticeText: existingSchedule?.noticeText ?? defaultNoticeText,
  };
}
