'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useConfigStore } from '@/stores';
import { ConfirmModal } from '@/components';

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function DoctorManagement() {
  const { hospital, doctors, setHospital, addDoctor, updateDoctor, removeDoctor } = useConfigStore();
  const [newDoctorName, setNewDoctorName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddDoctor = () => {
    if (!newDoctorName.trim() || doctors.length >= 3) return;

    const usedColors = doctors.map((d) => d.color);
    const availableColor = DEFAULT_COLORS.find((c) => !usedColors.includes(c)) || DEFAULT_COLORS[0];

    addDoctor({
      id: `d${Date.now()}`,
      name: newDoctorName.trim(),
      color: availableColor,
      order: doctors.length,
      active: true,
    });
    setNewDoctorName('');
  };

  const handleDeleteDoctor = (id: string) => {
    removeDoctor(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">병원명</label>
        <input
          type="text"
          value={hospital.name}
          onChange={(e) => setHospital({ name: e.target.value })}
          placeholder="병원명을 입력하세요"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            의사 목록 ({doctors.length}/3)
          </label>
        </div>

        <div className="space-y-2">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <input
                type="color"
                value={doctor.color}
                onChange={(e) => updateDoctor(doctor.id, { color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={doctor.name}
                onChange={(e) => updateDoctor(doctor.id, { name: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
              <label className="flex items-center gap-1 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={doctor.active}
                  onChange={(e) => updateDoctor(doctor.id, { active: e.target.checked })}
                  className="rounded"
                />
                활성
              </label>
              <button
                onClick={() => setDeleteConfirm(doctor.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {doctors.length < 3 && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newDoctorName}
              onChange={(e) => setNewDoctorName(e.target.value)}
              placeholder="새 의사 이름"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAddDoctor()}
            />
            <button
              onClick={handleAddDoctor}
              disabled={!newDoctorName.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="의사 삭제"
        message="정말 이 의사를 삭제하시겠습니까? 관련된 모든 스케줄 데이터가 삭제됩니다."
        confirmText="삭제"
        onConfirm={() => deleteConfirm && handleDeleteDoctor(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </div>
  );
}
