'use client';

import { useState } from 'react';
import { CalendarDay } from '@/utils/calendar';
import { Doctor, DoctorDaySchedule } from '@/types';
import ContextMenu from './ContextMenu';
import TimePickerModal from './TimePickerModal';

interface DayDetailModalProps {
  isOpen: boolean;
  day: CalendarDay;
  doctors: Doctor[];
  schedules: Record<string, DoctorDaySchedule>;
  holidayName?: string;
  onClose: () => void;
  onUpdateSchedule: (doctorId: string, schedule: DoctorDaySchedule) => void;
  onResetSchedule: (doctorId: string) => void;
}

export default function DayDetailModal({
  isOpen,
  day,
  doctors,
  schedules,
  holidayName,
  onClose,
  onUpdateSchedule,
  onResetSchedule,
}: DayDetailModalProps) {
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

  if (!isOpen) return null;

  const isSunday = day.dayOfWeek === 0;
  const isHoliday = !!holidayName;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const handleContextMenu = (e: React.MouseEvent, doctorId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, doctorId });
  };

  const formatTime = (start?: string, end?: string): string => {
    if (!start || !end) return '';
    return `${start} - ${end}`;
  };

  const handleSetOff = () => {
    if (!contextMenu) return;
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
    if (!timePickerState) return;
    onUpdateSchedule(timePickerState.doctorId, {
      status: 'work',
      start,
      end,
      isManualEdit: true,
    });
    setTimePickerState(null);
  };

  const handleReset = () => {
    if (!contextMenu) return;
    onResetSchedule(contextMenu.doctorId);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 min-w-[320px] max-w-[400px]">
        {/* Header */}
        <div className={`px-4 pt-9 pb-3 border-b ${isSunday || isHoliday ? 'bg-red-50' : 'bg-gray-50'} rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-semibold ${isSunday || isHoliday ? 'text-red-600' : 'text-gray-800'}`}>
                {day.month}월 {day.date}일 ({dayNames[day.dayOfWeek]})
              </h2>
              {holidayName && (
                <p className="text-sm text-red-500">{holidayName}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-3">우클릭으로 스케줄 변경</p>
          <div className="space-y-2">
            {doctors.map((doctor) => {
              const schedule = schedules[doctor.id];
              const isOff = !schedule || schedule.status === 'off';
              const isManualEdit = schedule?.isManualEdit;

              return (
                <div
                  key={doctor.id}
                  onContextMenu={(e) => handleContextMenu(e, doctor.id)}
                  className="flex items-center justify-between p-2 rounded-lg cursor-context-menu hover:bg-gray-100 transition-colors"
                  style={{
                    borderLeft: `4px solid ${doctor.color}`,
                  }}
                >
                  <span className="font-medium" style={{ color: doctor.color }}>
                    {doctor.name}
                  </span>
                  <span className={`text-sm ${isOff ? 'text-gray-400' : 'text-gray-700'}`}>
                    {isOff ? '휴진' : formatTime(schedule.start, schedule.end)}
                    {isManualEdit && ' ✎'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            닫기
          </button>
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
