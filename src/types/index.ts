// 의사 정보
export interface Doctor {
  id: string;
  name: string;
  color: string; // HEX 색상 코드
  order: number;
  active: boolean;
}

// 요일별 근무 시간
export interface DaySchedule {
  start: string; // "HH:MM" 형식
  end: string;
}

// 주간 근무 패턴 (요일별)
export type DayOfWeek = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export type WeeklySchedule = {
  [key in DayOfWeek]: DaySchedule | null; // null은 휴진
};

// 반복 규칙 타입
export type RecurringRuleType = 'weekly' | 'biweekly' | 'monthly';
export type TimePeriod = 'all' | 'morning' | 'afternoon';

// 캘린더 표시 모드
export type DisplayMode = 'detailed' | 'simple';

export interface RecurringRule {
  id: string;
  doctorId: string;
  type: RecurringRuleType;
  dayOfWeek: number; // 0=일요일, 1=월요일, ..., 6=토요일
  period: TimePeriod;
  description: string;
  // 격주 패턴용
  isOffWeek?: boolean;
  referenceDate?: string; // "YYYY-MM-DD"
  // 매월 n주차 패턴용
  weekOfMonth?: number; // 1=첫째주, 2=둘째주, ...
}

// 병원 휴일
export type HolidayType = 'fixed' | 'yearly';

export interface HospitalHoliday {
  id: string;
  type: HolidayType;
  date?: string; // "YYYY-MM-DD" (fixed 타입용)
  month?: number; // 1-12 (yearly 타입용)
  day?: number; // 1-31 (yearly 타입용)
  name: string;
}

// 병원 정보
export interface Hospital {
  name: string;
}

// 전체 설정
export interface Config {
  hospital: Hospital;
  doctors: Doctor[];
  defaultSchedule: Record<string, WeeklySchedule>; // doctorId를 키로
  recurringRules: RecurringRule[];
  hospitalHolidays: HospitalHoliday[];
}

// 일별 의사 스케줄 상태
export type DoctorDayStatus = 'work' | 'off' | 'morning' | 'afternoon';

export interface DoctorDaySchedule {
  status: DoctorDayStatus;
  start?: string; // "HH:MM"
  end?: string;
  isManualEdit: boolean;
}

// 일별 스케줄
export interface DayData {
  isHoliday: boolean;
  holidayName?: string;
  doctors: Record<string, DoctorDaySchedule>; // doctorId를 키로
}

// 월별 스케줄
export interface MonthSchedule {
  year: number;
  month: number;
  generatedAt: string; // ISO 8601 형식
  days: Record<string, DayData>; // 일자(1-31)를 키로
  noticeText?: string; // 월별 안내 문구 (시즌 테마에서 표시)
}

// 공휴일 데이터 (정적 JSON용)
export interface PublicHoliday {
  date: string; // "YYYY-MM-DD"
  name: string;
}
