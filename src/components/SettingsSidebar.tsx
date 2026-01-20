'use client';

import { useState } from 'react';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import DoctorManagement from './settings/DoctorManagement';
import DefaultScheduleSettings from './settings/DefaultScheduleSettings';
import RecurringRulesSettings from './settings/RecurringRulesSettings';
import HospitalHolidaysSettings from './settings/HospitalHolidaysSettings';
import ThemeSettings from './settings/ThemeSettings';

type SettingsTab = 'doctors' | 'schedule' | 'recurring' | 'holidays' | 'theme';

interface SettingsSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'doctors', label: '의사 관리' },
  { id: 'schedule', label: '기본 근무' },
  { id: 'recurring', label: '반복 규칙' },
  { id: 'holidays', label: '병원 휴일' },
  { id: 'theme', label: '테마' },
];

export default function SettingsSidebar({ isOpen, onToggle }: SettingsSidebarProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('doctors');

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed right-4 top-20 z-40 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 border border-gray-200"
        aria-label="설정 열기"
      >
        <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
      </button>

      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">설정</h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="설정 닫기"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
          {activeTab === 'doctors' && <DoctorManagement />}
          {activeTab === 'schedule' && <DefaultScheduleSettings />}
          {activeTab === 'recurring' && <RecurringRulesSettings />}
          {activeTab === 'holidays' && <HospitalHolidaysSettings />}
          {activeTab === 'theme' && <ThemeSettings />}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onToggle}
        />
      )}
    </>
  );
}
