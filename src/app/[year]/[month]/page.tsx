import { Metadata } from 'next';
import { CalendarPageClient } from '@/components';
import { getPublicHolidaysForMonth } from '@/utils/holidays';

interface MonthPageProps {
  params: Promise<{
    year: string;
    month: string;
  }>;
}

export async function generateMetadata({ params }: MonthPageProps): Promise<Metadata> {
  const { year, month } = await params;
  return {
    title: `${year}년 ${parseInt(month)}월 스케줄 | 진료 스케줄러`,
  };
}

export default async function MonthPage({ params }: MonthPageProps) {
  const { year, month } = await params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  
  const publicHolidays = getPublicHolidaysForMonth(yearNum, monthNum);

  return (
    <CalendarPageClient
      year={yearNum}
      month={monthNum}
      publicHolidays={publicHolidays}
    />
  );
}
