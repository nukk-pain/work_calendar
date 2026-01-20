'use client';

import { forwardRef } from 'react';
import { generateCalendarDays, getDayOfWeekName } from '@/utils/calendar';
import { Doctor, DayData, DoctorDaySchedule, DisplayMode } from '@/types';
import { PDF_THEMES, PdfTheme } from '@/utils/pdfThemes';
import CalendarCell from './CalendarCell';
import CalendarHeader from './CalendarHeader';
import MonthlyIllustration from './MonthlyIllustration';

interface CalendarProps {
  year: number;
  month: number;
  hospitalName?: string;
  doctors?: Doctor[];
  dayData?: Record<string, DayData>;
  themeId?: string;
  displayMode?: DisplayMode;
  noticeText?: string;
  onUpdateSchedule?: (day: number, doctorId: string, schedule: DoctorDaySchedule) => void;
  onResetSchedule?: (day: number, doctorId: string) => void;
}

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    year,
    month,
    hospitalName,
    doctors = [],
    dayData = {},
    themeId = 'simple',
    displayMode = 'detailed',
    noticeText,
    onUpdateSchedule,
    onResetSchedule,
  },
  ref
) {
  const days = generateCalendarDays(year, month);

  // Theme selection logic
  let effectiveThemeId = themeId;
  if (themeId === 'auto') {
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    effectiveThemeId = monthNames[month - 1];
  }

  const theme = PDF_THEMES.find((t) => t.id === effectiveThemeId) || PDF_THEMES[0];

  return (
    <div ref={ref} style={theme.styles.container} className={`rounded-lg shadow overflow-hidden flex flex-col ${theme.hasIllustration ? 'justify-between min-h-[297mm]' : ''}`}>
      <div className="flex-1">
        <h1 style={theme.styles.title}>
          {hospitalName || '병원'}
          <br />
          {year}년 {month}월 스케줄
        </h1>

        {theme.hasIllustration && noticeText && (
          <div className="mb-6 text-center text-sm font-medium" style={{ color: theme.styles.title.color }}>
            {noticeText}
          </div>
        )}

        <table style={theme.styles.table} className="w-full">
          <thead>
            <tr>
              {WEEKDAYS.map((dayOfWeek) => (
                <th key={dayOfWeek} style={theme.styles.th(dayOfWeek)}>
                  {getDayOfWeekName(dayOfWeek)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
              <tr key={weekIndex}>
                {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                  const dateKey = String(day.date);
                  const data = day.isCurrentMonth ? dayData[dateKey] : undefined;

                  return (
                    <CalendarCell
                      key={`${day.year}-${day.month}-${day.date}-${dayIndex}`}
                      day={day}
                      doctors={doctors}
                      schedules={data?.doctors}
                      holidayName={data?.holidayName}
                      isHoliday={data?.isHoliday}
                      theme={theme}
                      displayMode={displayMode}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MonthlyIllustration month={month} themeId={themeId} />
    </div>
  );
});

export default Calendar;
