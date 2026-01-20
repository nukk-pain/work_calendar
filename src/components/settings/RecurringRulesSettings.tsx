'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useConfigStore } from '@/stores';
import { RecurringRuleType, TimePeriod } from '@/types';

const DAYS_OF_WEEK = [
  { value: 0, label: '일요일' },
  { value: 1, label: '월요일' },
  { value: 2, label: '화요일' },
  { value: 3, label: '수요일' },
  { value: 4, label: '목요일' },
  { value: 5, label: '금요일' },
  { value: 6, label: '토요일' },
];

const RULE_TYPES: { value: RecurringRuleType; label: string }[] = [
  { value: 'weekly', label: '매주' },
  { value: 'biweekly', label: '격주' },
  { value: 'monthly', label: '매월 n주차' },
];

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: 'all', label: '전일' },
  { value: 'morning', label: '오전만' },
  { value: 'afternoon', label: '오후만' },
];

export default function RecurringRulesSettings() {
  const { doctors, recurringRules, addRecurringRule, removeRecurringRule } = useConfigStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState({
    doctorId: '',
    type: 'weekly' as RecurringRuleType,
    dayOfWeek: 1,
    period: 'all' as TimePeriod,
    weekOfMonth: 1,
    isOffWeek: true,
  });

  const activeDoctors = doctors.filter((d) => d.active);

  const handleAddRule = () => {
    if (!newRule.doctorId) return;

    const doctor = doctors.find((d) => d.id === newRule.doctorId);
    const dayName = DAYS_OF_WEEK.find((d) => d.value === newRule.dayOfWeek)?.label;
    const periodName = TIME_PERIODS.find((p) => p.value === newRule.period)?.label;
    const typeName = RULE_TYPES.find((t) => t.value === newRule.type)?.label;

    let description = `${doctor?.name} - ${typeName} ${dayName}`;
    if (newRule.period !== 'all') {
      description += ` ${periodName}`;
    }
    description += ' 휴진';

    addRecurringRule({
      id: `r${Date.now()}`,
      doctorId: newRule.doctorId,
      type: newRule.type,
      dayOfWeek: newRule.dayOfWeek,
      period: newRule.period,
      description,
      weekOfMonth: newRule.type === 'monthly' ? newRule.weekOfMonth : undefined,
      isOffWeek: newRule.type === 'biweekly' ? newRule.isOffWeek : undefined,
      referenceDate: newRule.type === 'biweekly' ? new Date().toISOString().split('T')[0] : undefined,
    });

    setIsAdding(false);
    setNewRule({
      doctorId: '',
      type: 'weekly',
      dayOfWeek: 1,
      period: 'all',
      weekOfMonth: 1,
      isOffWeek: true,
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
      <div className="space-y-2">
        {recurringRules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">{rule.description}</span>
            <button
              onClick={() => removeRecurringRule(rule.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="p-4 bg-blue-50 rounded-lg space-y-3">
          <select
            value={newRule.doctorId}
            onChange={(e) => setNewRule({ ...newRule, doctorId: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="">의사 선택</option>
            {activeDoctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={newRule.type}
            onChange={(e) => setNewRule({ ...newRule, type: e.target.value as RecurringRuleType })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            {RULE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {newRule.type === 'monthly' && (
            <select
              value={newRule.weekOfMonth}
              onChange={(e) => setNewRule({ ...newRule, weekOfMonth: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              {[1, 2, 3, 4, 5].map((w) => (
                <option key={w} value={w}>{w}주차</option>
              ))}
            </select>
          )}

          {newRule.type === 'biweekly' && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={newRule.isOffWeek}
                onChange={(e) => setNewRule({ ...newRule, isOffWeek: e.target.checked })}
                className="rounded"
              />
              이번 주가 휴진 주
            </label>
          )}

          <select
            value={newRule.dayOfWeek}
            onChange={(e) => setNewRule({ ...newRule, dayOfWeek: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            {DAYS_OF_WEEK.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <select
            value={newRule.period}
            onChange={(e) => setNewRule({ ...newRule, period: e.target.value as TimePeriod })}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            {TIME_PERIODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleAddRule}
              disabled={!newRule.doctorId}
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
          반복 규칙 추가
        </button>
      )}
    </div>
  );
}
