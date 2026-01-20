'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline';
import { CalendarDay } from '@/utils/calendar';
import { Doctor, DoctorDaySchedule } from '@/types';
import ContextMenu from './ContextMenu';
import TimePickerModal from './TimePickerModal';

interface CalendarCellProps {
  day: CalendarDay;
  doctors?: Doctor[];
  schedules?: Record<string, DoctorDaySchedule>;
  holidayName?: string;
  isHoliday?: boolean;
  onUpdateSchedule?: (doctorId: string, schedule: DoctorDaySchedule) => void;
  onResetSchedule?: (doctorId: string) => void;
}

export default function CalendarCell({
  day,
  doctors = [],
  schedules = {},
  holidayName,
  isHoliday = false,
  onUpdateSchedule,
  onResetSchedule,
}: CalendarCellProps) {
  const router = useRouter();
  const isSunday = day.dayOfWeek === 0;
  const isSaturday = day.dayOfWeek === 6;

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    doctorId: string;
  } | null>(null);

  const [timePickerState, setTimePickerState] = useState<{
    isOpen: boolean;
    doctorId: string;
    doctorName: string;
    start: string;
    end: string;
  } | null>(null);

  const handleClick = () => {
    if (!day.isCurrentMonth) {
      router.push(`/${day.year}/${String(day.month).padStart(2, '0')}`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, doctorId: string) => {
    if (!day.isCurrentMonth) return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, doctorId });
  };

  const formatTime = (start?: string, end?: string): string => {
    if (!start || !end) return '';
    const shortStart = start.replace(':00', '').replace(':30', ':30');
    const shortEnd = end.replace(':00', '').replace(':30', ':30');
    if (doctors.length >= 3) {
      return `${start.split(':')[0]}-${end.split(':')[0]}`;
    }
    return `${shortStart}-${shortEnd}`;
  };

  const handleSetOff = () => {
    if (!contextMenu || !onUpdateSchedule) return;
    const schedule = schedules[contextMenu.doctorId];
    const isCurrentlyOff = !schedule || schedule.status === 'off';

    if (isCurrentlyOff) {
      onUpdateSchedule(contextMenu.doctorId, {
        status: 'work',
        start: '09:00',
        end: '18:00',
        isManualEdit: true,
      });
    } else {
      onUpdateSchedule(contextMenu.doctorId, {
        status: 'off',
        isManualEdit: true,
      });
    }
  };

  const handleChangeTime = () => {
    if (!contextMenu) return;
    const doctor = doctors.find((d) => d.id === contextMenu.doctorId);
    const schedule = schedules[contextMenu.doctorId];
    if (doctor) {
      setTimePickerState({
        isOpen: true,
        doctorId: contextMenu.doctorId,
        doctorName: doctor.name,
        start: schedule?.start || '09:00',
        end: schedule?.end || '18:00',
      });
    }
  };

  const handleTimeSave = (start: string, end: string) => {
    if (!timePickerState || !onUpdateSchedule) return;
    onUpdateSchedule(timePickerState.doctorId, {
      status: 'work',
      start,
      end,
      isManualEdit: true,
    });
  };

  const handleReset = () => {
    if (!contextMenu || !onResetSchedule) return;
    onResetSchedule(contextMenu.doctorId);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`
          min-h-[120px] border-b border-r border-gray-200 p-1
          ${!day.isCurrentMonth ? 'bg-gray-50 cursor-pointer hover:bg-gray-100' : 'bg-white'}
          ${day.isToday ? 'ring-2 ring-inset ring-blue-500' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-1">
            <span
              className={`
                text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                ${day.isToday ? 'bg-blue-500 text-white' : ''}
                ${!day.isToday && (isSunday || isHoliday) ? 'text-red-500' : ''}
                ${!day.isToday && isSaturday && !isHoliday ? 'text-blue-500' : ''}
                ${!day.isToday && !isSunday && !isSaturday && !isHoliday ? 'text-gray-900' : ''}
                ${!day.isCurrentMonth ? 'text-gray-400' : ''}
              `}
            >
              {day.date}
            </span>
          </div>

          {holidayName && (
            <span className="text-xs text-red-500 truncate mb-1">{holidayName}</span>
          )}

          <div className="flex-1 space-y-0.5 overflow-hidden">
            {doctors.map((doctor) => {
              const schedule = schedules[doctor.id];
              const isOff = !schedule || schedule.status === 'off';
              const isManualEdit = schedule?.isManualEdit;

              return (
                <div
                  key={doctor.id}
                  onContextMenu={(e) => handleContextMenu(e, doctor.id)}
                  className={`
                    flex items-center gap-1 text-xs rounded px-1 py-0.5 cursor-context-menu
                    ${isOff ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'}
                    ${day.isCurrentMonth ? 'hover:bg-gray-200' : ''}
                  `}
                >
                  <div
                    className="w-1 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: isOff ? '#d1d5db' : doctor.color }}
                  />
                  <span
                    className="truncate font-medium"
                    style={{ color: isOff ? '#9ca3af' : doctor.color }}
                  >
                    {doctor.name}
                  </span>
                  <span className="text-gray-500 truncate flex-1">
                    {isOff ? '휴진' : formatTime(schedule.start, schedule.end)}
                  </span>
                  {isManualEdit && (
                    <PencilIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onSetOff={handleSetOff}
          onChangeTime={handleChangeTime}
          onReset={handleReset}
          isOff={!schedules[contextMenu.doctorId] || schedules[contextMenu.doctorId].status === 'off'}
        />
      )}

      {timePickerState && (
        <TimePickerModal
          isOpen={timePickerState.isOpen}
          onClose={() => setTimePickerState(null)}
          onSave={handleTimeSave}
          initialStart={timePickerState.start}
          initialEnd={timePickerState.end}
          doctorName={timePickerState.doctorName}
        />
      )}
    </>
  );
}
