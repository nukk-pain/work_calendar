'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useConfigStore } from '@/stores';
import { HolidayType } from '@/types';

export default function HospitalHolidaysSettings() {
  const { hospitalHolidays, addHospitalHoliday, removeHospitalHoliday } = useConfigStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    type: 'fixed' as HolidayType,
    date: '',
    month: 1,
    day: 1,
    name: '',
  });

  const handleAddHoliday = () => {
    if (!newHoliday.name) return;

    addHospitalHoliday({
      id: `h${Date.now()}`,
      type: newHoliday.type,
      date: newHoliday.type === 'fixed' ? newHoliday.date : undefined,
      month: newHoliday.type === 'yearly' ? newHoliday.month : undefined,
      day: newHoliday.type === 'yearly' ? newHoliday.day : undefined,
      name: newHoliday.name,
    });

    setIsAdding(false);
    setNewHoliday({ type: 'fixed', date: '', month: 1, day: 1, name: '' });
  };

  const formatHoliday = (holiday: typeof hospitalHolidays[0]): string => {
    if (holiday.type === 'fixed' && holiday.date) {
      return `${holiday.date} - ${holiday.name}`;
    }
    if (holiday.type === 'yearly' && holiday.month && holiday.day) {
      return `매년 ${holiday.month}월 ${holiday.day}일 - ${holiday.name}`;
    }
    return holiday.name;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {hospitalHolidays.map((holiday) => (
          <div key={holiday.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">{formatHoliday(holiday)}</span>
            <button
              onClick={() => removeHospitalHoliday(holiday.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="p-4 bg-blue-50 rounded-lg space-y-3">
          <input
            type="text"
            value={newHoliday.name}
            onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
            placeholder="휴일명 (예: 개원기념일)"
            className="w-full px-3 py-2 border rounded-md text-sm"
          />

          <select
            value={newHoliday.type}
            onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value as HolidayType })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="fixed">특정 날짜</option>
            <option value="yearly">매년 반복</option>
          </select>

          {newHoliday.type === 'fixed' ? (
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          ) : (
            <div className="flex gap-2">
              <select
                value={newHoliday.month}
                onChange={(e) => setNewHoliday({ ...newHoliday, month: Number(e.target.value) })}
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}월</option>
                ))}
              </select>
              <select
                value={newHoliday.day}
                onChange={(e) => setNewHoliday({ ...newHoliday, day: Number(e.target.value) })}
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}일</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleAddHoliday}
              disabled={!newHoliday.name || (newHoliday.type === 'fixed' && !newHoliday.date)}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              추가
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500"
        >
          <PlusIcon className="w-5 h-5" />
          병원 휴일 추가
        </button>
      )}
    </div>
  );
}
