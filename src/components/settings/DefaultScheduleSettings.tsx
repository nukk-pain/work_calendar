'use client';

import { useState } from 'react';
import { useConfigStore } from '@/stores';
import { DayOfWeek } from '@/types';

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'mon', label: '월' },
  { key: 'tue', label: '화' },
  { key: 'wed', label: '수' },
  { key: 'thu', label: '목' },
  { key: 'fri', label: '금' },
  { key: 'sat', label: '토' },
  { key: 'sun', label: '일' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export default function DefaultScheduleSettings() {
  const { doctors, defaultSchedule, setDefaultSchedule } = useConfigStore();
  const [selectedDoctor, setSelectedDoctor] = useState<string>(doctors[0]?.id || '');

  const activeDoctors = doctors.filter((d) => d.active);
  const schedule = defaultSchedule[selectedDoctor];

  const handleTimeChange = (
    day: DayOfWeek,
    field: 'start' | 'end',
    type: 'hour' | 'minute',
    value: string
  ) => {
    if (!schedule) return;

    const current = schedule[day];
    if (!current) return;

    const [h, m] = (field === 'start' ? current.start : current.end).split(':');
    const newTime = type === 'hour' ? `${value}:${m}` : `${h}:${value}`;

    setDefaultSchedule(selectedDoctor, {
      ...schedule,
      [day]: { ...current, [field]: newTime },
    });
  };

  const handleToggleDay = (day: DayOfWeek, isOff: boolean) => {
    if (!schedule) return;

    setDefaultSchedule(selectedDoctor, {
      ...schedule,
      [day]: isOff ? null : { start: '09:00', end: '18:00' },
    });
  };

  if (activeDoctors.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        먼저 의사를 등록해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">의사 선택</label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {activeDoctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">요일별 근무 시간</label>
        {DAYS.map(({ key, label }) => {
          const daySchedule = schedule?.[key];
          const isOff = !daySchedule;
          const [startH, startM] = (daySchedule?.start || '09:00').split(':');
          const [endH, endM] = (daySchedule?.end || '18:00').split(':');

          return (
            <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="w-8 text-sm font-medium text-gray-700">{label}</span>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={isOff}
                  onChange={(e) => handleToggleDay(key, e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-gray-500">휴진</span>
              </label>
              {!isOff && (
                <>
                  <select
                    value={startH}
                    onChange={(e) => handleTimeChange(key, 'start', 'hour', e.target.value)}
                    className="px-1 py-1 text-xs border rounded"
                  >
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-xs">:</span>
                  <select
                    value={startM}
                    onChange={(e) => handleTimeChange(key, 'start', 'minute', e.target.value)}
                    className="px-1 py-1 text-xs border rounded"
                  >
                    {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span className="text-xs">~</span>
                  <select
                    value={endH}
                    onChange={(e) => handleTimeChange(key, 'end', 'hour', e.target.value)}
                    className="px-1 py-1 text-xs border rounded"
                  >
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-xs">:</span>
                  <select
                    value={endM}
                    onChange={(e) => handleTimeChange(key, 'end', 'minute', e.target.value)}
                    className="px-1 py-1 text-xs border rounded"
                  >
                    {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
