'use client';

import { generateCalendarDays, getDayOfWeekName } from '@/utils/calendar';
import { Doctor, DayData, DoctorDaySchedule } from '@/types';
import CalendarCell from './CalendarCell';
import CalendarHeader from './CalendarHeader';

interface CalendarProps {
  year: number;
  month: number;
  hospitalName?: string;
  doctors?: Doctor[];
  dayData?: Record<string, DayData>;
  onUpdateSchedule?: (day: number, doctorId: string, schedule: DoctorDaySchedule) => void;
  onResetSchedule?: (day: number, doctorId: string) => void;
}

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export default function Calendar({
  year,
  month,
  hospitalName,
  doctors = [],
  dayData = {},
  onUpdateSchedule,
  onResetSchedule,
}: CalendarProps) {
  const days = generateCalendarDays(year, month);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <CalendarHeader year={year} month={month} hospitalName={hospitalName} />
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS.map((dayOfWeek) => (
          <div
            key={dayOfWeek}
            className={`
              py-2 text-center text-sm font-medium border-b border-r border-gray-200
              ${dayOfWeek === 0 ? 'text-red-500 bg-red-50' : ''}
              ${dayOfWeek === 6 ? 'text-blue-500 bg-blue-50' : ''}
              ${dayOfWeek > 0 && dayOfWeek < 6 ? 'text-gray-700 bg-gray-50' : ''}
            `}
          >
            {getDayOfWeekName(dayOfWeek)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dateKey = String(day.date);
          const data = day.isCurrentMonth ? dayData[dateKey] : undefined;

          return (
            <CalendarCell
              key={`${day.year}-${day.month}-${day.date}-${index}`}
              day={day}
              doctors={doctors}
              schedules={data?.doctors}
              holidayName={data?.holidayName}
              isHoliday={data?.isHoliday}
              onUpdateSchedule={
                day.isCurrentMonth && onUpdateSchedule
                  ? (doctorId, schedule) => onUpdateSchedule(day.date, doctorId, schedule)
                  : undefined
              }
              onResetSchedule={
                day.isCurrentMonth && onResetSchedule
                  ? (doctorId) => onResetSchedule(day.date, doctorId)
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
