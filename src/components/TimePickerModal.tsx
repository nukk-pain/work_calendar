'use client';

import { useState } from 'react';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (start: string, end: string) => void;
  initialStart?: string;
  initialEnd?: string;
  doctorName: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export default function TimePickerModal({
  isOpen,
  onClose,
  onSave,
  initialStart = '09:00',
  initialEnd = '18:00',
  doctorName,
}: TimePickerModalProps) {
  const [startHour, startMinute] = initialStart.split(':');
  const [endHour, endMinute] = initialEnd.split(':');

  const [sHour, setSHour] = useState(startHour || '09');
  const [sMinute, setSMinute] = useState(startMinute || '00');
  const [eHour, setEHour] = useState(endHour || '18');
  const [eMinute, setEMinute] = useState(endMinute || '00');

  if (!isOpen) return null;

  const handleSave = () => {
    const start = `${sHour}:${sMinute}`;
    const end = `${eHour}:${eMinute}`;
    onSave(start, end);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl p-6 min-w-[320px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {doctorName} 근무 시간 변경
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              시작 시간
            </label>
            <div className="flex gap-2">
              <select
                value={sHour}
                onChange={(e) => setSHour(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}시</option>
                ))}
              </select>
              <select
                value={sMinute}
                onChange={(e) => setSMinute(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{m}분</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              종료 시간
            </label>
            <div className="flex gap-2">
              <select
                value={eHour}
                onChange={(e) => setEHour(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}시</option>
                ))}
              </select>
              <select
                value={eMinute}
                onChange={(e) => setEMinute(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{m}분</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
