'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDay } from '@/utils/calendar';
import { Doctor, DoctorDaySchedule, DisplayMode } from '@/types';
import { PdfTheme } from '@/utils/pdfThemes';
import ContextMenu from './ContextMenu';
import TimePickerModal from './TimePickerModal';
import DayDetailModal from './DayDetailModal';

interface CalendarCellProps {
  day: CalendarDay;
  doctors?: Doctor[];
  schedules?: Record<string, DoctorDaySchedule>;
  holidayName?: string;
  isHoliday?: boolean;
  theme?: PdfTheme;
  displayMode?: DisplayMode;
  onUpdateSchedule?: (doctorId: string, schedule: DoctorDaySchedule) => void;
  onResetSchedule?: (doctorId: string) => void;
}

export default function CalendarCell({
  day,
  doctors = [],
  schedules = {},
  holidayName,
  isHoliday = false,
  theme,
  displayMode = 'detailed',
  onUpdateSchedule,
  onResetSchedule,
}: CalendarCellProps) {
  const router = useRouter();
  const isSunday = day.dayOfWeek === 0;

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

  const [showDayDetail, setShowDayDetail] = useState(false);

  const handleClick = () => {
    if (!day.isCurrentMonth) {
      router.push(`/${day.year}/${String(day.month).padStart(2, '0')}`);
    } else if (displayMode === 'simple') {
      setShowDayDetail(true);
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

  const tdStyle = theme?.styles.td(day.isCurrentMonth, isSunday, day.dayOfWeek) || {};
  const dateStyle = theme?.styles.dateText(day.isCurrentMonth, isSunday, day.dayOfWeek, isHoliday) || {};
  const hasIllustration = theme?.hasIllustration ?? false;

  return (
    <>
      <td
        onClick={handleClick}
        style={{ ...tdStyle, position: 'relative' }}
        className={`
          ${!day.isCurrentMonth ? 'cursor-pointer' : ''}
          ${day.isCurrentMonth && displayMode === 'simple' ? 'cursor-pointer hover:bg-gray-50' : ''}
          ${day.isToday ? 'ring-2 ring-inset ring-blue-500' : ''}
        `}
      >
        {/* Winter Warmth Theme: 3D OFF Badge */}
        {hasIllustration && day.isCurrentMonth && (isHoliday || isSunday) && (
          <div
            className="absolute top-0 left-0 z-10 flex items-center justify-center shadow-md"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#ef4444',
              borderRadius: '0 0 12px 0', // Top-left corner style
              boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            }}
          >
            <span className="text-white font-bold text-xs transform -rotate-45" style={{ textShadow: '0px 1px 1px rgba(0,0,0,0.3)' }}>OFF</span>
          </div>
        )}

        <div style={dateStyle} className={hasIllustration ? "flex justify-end pr-2 pt-1" : ""}>
          {day.date}
        </div>

        {holidayName && (
          <div className={`text-xs text-red-500 mb-1 ${!theme ? 'truncate' : ''} ${hasIllustration ? 'text-right pr-1 font-medium' : ''}`} style={{ fontSize: '22px', lineHeight: '1.3' }}>
            {holidayName}
          </div>
        )}

        {displayMode === 'simple' ? (
          // 심플 모드: 휴진 여부만 표시
          day.isCurrentMonth && (isHoliday || isSunday) && !hasIllustration && (
            <div className="flex flex-col items-center mt-1">
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: '#1e3a5f',
                  color: 'white',
                  fontSize: '20px',
                }}
              >
                OFF
              </span>
              <span className="text-xs mt-0.5" style={{ fontSize: '22px', color: '#1e3a5f' }}>
                휴진
              </span>
            </div>
          )
        ) : (
          // 상세 모드: 의사별 일정 표시
          day.isCurrentMonth && !isHoliday && !isSunday && doctors.map((doctor) => {
            const schedule = schedules[doctor.id];
            const isOff = !schedule || schedule.status === 'off';
            const isManualEdit = schedule?.isManualEdit;

            return (
              <div
                key={doctor.id}
                onContextMenu={(e) => handleContextMenu(e, doctor.id)}
                className="text-xs truncate cursor-context-menu hover:bg-gray-200 rounded px-0.5"
                style={{
                  fontSize: '22px',
                  lineHeight: '1.4',
                  color: !isOff ? doctor.color : '#9ca3af',
                  opacity: isOff ? 0.7 : 1,
                  textAlign: hasIllustration ? 'right' : 'left',
                }}
              >
                {doctor.name}: {isOff ? '휴진' : formatTime(schedule.start, schedule.end)}
                {isManualEdit && ' ✎'}
              </div>
            );
          })
        )}
      </td>

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

      {showDayDetail && onUpdateSchedule && onResetSchedule && (
        <DayDetailModal
          isOpen={showDayDetail}
          day={day}
          doctors={doctors}
          schedules={schedules}
          holidayName={holidayName}
          onClose={() => setShowDayDetail(false)}
          onUpdateSchedule={onUpdateSchedule}
          onResetSchedule={onResetSchedule}
        />
      )}
    </>
  );
}
