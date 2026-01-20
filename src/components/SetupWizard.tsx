'use client';

import { useState } from 'react';
import { useConfigStore } from '@/stores';
import { Doctor, WeeklySchedule, DayOfWeek } from '@/types';

interface SetupWizardProps {
  onComplete: () => void;
}

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const DAY_LABELS: Record<DayOfWeek, string> = {
  sun: '일', mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토',
};

const DAY_ORDER: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const DEFAULT_SCHEDULE: WeeklySchedule = {
  sun: null,
  mon: { start: '09:00', end: '18:00' },
  tue: { start: '09:00', end: '18:00' },
  wed: { start: '09:00', end: '18:00' },
  thu: { start: '09:00', end: '18:00' },
  fri: { start: '09:00', end: '18:00' },
  sat: { start: '09:00', end: '13:00' },
};

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [hospitalName, setHospitalName] = useState('');
  const [doctors, setDoctors] = useState<Array<{ name: string; color: string }>>([
    { name: '', color: DEFAULT_COLORS[0] },
  ]);
  const [schedules, setSchedules] = useState<Record<string, WeeklySchedule>>({});

  const { setHospital, addDoctor, setDefaultSchedule } = useConfigStore();

  const handleNext = () => {
    if (step === 1) {
      setHospital({ name: hospitalName });
      setStep(2);
    } else if (step === 2) {
      const validDoctors = doctors.filter(d => d.name.trim());
      validDoctors.forEach((doc, index) => {
        const id = `d${Date.now()}-${index}`;
        addDoctor({
          id,
          name: doc.name.trim(),
          color: doc.color,
          order: index,
          active: true,
        });
        setSchedules(prev => ({ ...prev, [id]: { ...DEFAULT_SCHEDULE } }));
      });
      if (validDoctors.length > 0) {
        setStep(3);
      }
    } else if (step === 3) {
      Object.entries(schedules).forEach(([doctorId, schedule]) => {
        setDefaultSchedule(doctorId, schedule);
      });
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const addDoctorField = () => {
    if (doctors.length < 3) {
      const usedColors = doctors.map(d => d.color);
      const availableColor = DEFAULT_COLORS.find(c => !usedColors.includes(c)) || DEFAULT_COLORS[0];
      setDoctors([...doctors, { name: '', color: availableColor }]);
    }
  };

  const removeDoctorField = (index: number) => {
    if (doctors.length > 1) {
      setDoctors(doctors.filter((_, i) => i !== index));
    }
  };

  const updateDoctor = (index: number, field: 'name' | 'color', value: string) => {
    setDoctors(doctors.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const updateSchedule = (doctorId: string, day: DayOfWeek, field: 'start' | 'end' | 'enabled', value: string | boolean) => {
    setSchedules(prev => {
      const schedule = prev[doctorId] || { ...DEFAULT_SCHEDULE };
      if (field === 'enabled') {
        return {
          ...prev,
          [doctorId]: {
            ...schedule,
            [day]: value ? { start: '09:00', end: '18:00' } : null,
          },
        };
      }
      const daySchedule = schedule[day];
      if (!daySchedule) return prev;
      return {
        ...prev,
        [doctorId]: {
          ...schedule,
          [day]: { ...daySchedule, [field]: value },
        },
      };
    });
  };

  const configDoctors = useConfigStore(state => state.doctors);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full mx-4 overflow-hidden transition-all duration-300 ${step === 3 ? 'max-w-5xl' : 'max-w-xl'}`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              초기 설정 ({step}/3)
            </h2>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              건너뛰기
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 min-h-[300px]">
          {step === 1 && (
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">병원명을 입력해주세요</h3>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="예: OO병원"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500">
                PDF 및 화면 상단에 표시됩니다.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">의사를 등록해주세요 (최대 3명)</h3>
              <div className="space-y-3">
                {doctors.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={doc.color}
                      onChange={(e) => updateDoctor(index, 'color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => updateDoctor(index, 'name', e.target.value)}
                      placeholder={`의사 ${index + 1} 이름`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {doctors.length > 1 && (
                      <button
                        onClick={() => removeDoctorField(index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {doctors.length < 3 && (
                <button
                  onClick={addDoctorField}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                >
                  + 의사 추가
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">기본 근무 시간을 설정해주세요</h3>
              <div className="space-y-6 max-h-[400px] overflow-y-auto">
                {configDoctors.map(doctor => (
                  <div key={doctor.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: doctor.color }}
                      />
                      <span className="font-medium">{doctor.name}</span>
                    </div>
                    <div className="overflow-x-auto pb-2">
                      <div className="grid grid-cols-7 gap-2 text-sm min-w-[700px]">
                        {DAY_ORDER.map(day => {
                        const daySchedule = schedules[doctor.id]?.[day];
                        const isEnabled = daySchedule !== null;
                        return (
                          <div key={day} className="text-center">
                            <div className={`font-medium mb-1 ${day === 'sun' ? 'text-red-500' : day === 'sat' ? 'text-blue-500' : ''}`}>
                              {DAY_LABELS[day]}
                            </div>
                            <button
                              onClick={() => updateSchedule(doctor.id, day, 'enabled', !isEnabled)}
                              className={`w-full py-1 rounded text-xs ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                            >
                              {isEnabled ? '근무' : '휴진'}
                            </button>
                            {isEnabled && daySchedule && (
                              <div className="mt-2 text-xs text-gray-500 flex flex-col items-center gap-1">
                                <input
                                  type="time"
                                  value={daySchedule.start}
                                  onChange={(e) => updateSchedule(doctor.id, day, 'start', e.target.value)}
                                  className="w-full text-center border border-gray-200 rounded bg-gray-50 px-1 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <span className="text-gray-400 text-[10px]">~</span>
                                <input
                                  type="time"
                                  value={daySchedule.end}
                                  onChange={(e) => updateSchedule(doctor.id, day, 'end', e.target.value)}
                                  className="w-full text-center border border-gray-200 rounded bg-gray-50 px-1 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              이전
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            disabled={step === 2 && !doctors.some(d => d.name.trim())}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? '완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}
