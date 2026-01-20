'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { formatMonth, getPrevMonth, getNextMonth } from '@/utils/calendar';

interface CalendarHeaderProps {
  year: number;
  month: number;
  hospitalName?: string;
}

export default function CalendarHeader({ year, month, hospitalName }: CalendarHeaderProps) {
  const router = useRouter();
  
  const handlePrevMonth = () => {
    const { year: prevYear, month: prevMonth } = getPrevMonth(year, month);
    router.push(`/${prevYear}/${String(prevMonth).padStart(2, '0')}`);
  };
  
  const handleNextMonth = () => {
    const { year: nextYear, month: nextMonth } = getNextMonth(year, month);
    router.push(`/${nextYear}/${String(nextMonth).padStart(2, '0')}`);
  };
  
  const handleToday = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    router.push(`/${currentYear}/${String(currentMonth).padStart(2, '0')}`);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        {hospitalName && (
          <h1 className="text-xl font-bold text-gray-900">{hospitalName}</h1>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="이전 달"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 min-w-[120px] text-center">
            {formatMonth(year, month)}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="다음 달"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={handleToday}
          className="px-3 py-1 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          오늘
        </button>
      </div>
    </div>
  );
}
