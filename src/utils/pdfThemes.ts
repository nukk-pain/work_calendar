import { CSSProperties } from 'react';

export interface PdfTheme {
  id: string;
  name: string;
  category: 'basic' | 'minimal' | 'season';
  styles: {
    container: CSSProperties;
    title: CSSProperties;
    table: CSSProperties;
    th: (dow: number) => CSSProperties;
    td: (isCurrentMonth: boolean, isSunday: boolean, dow: number) => CSSProperties;
    dateText: (isCurrentMonth: boolean, isSunday: boolean, dow: number, isHoliday?: boolean) => CSSProperties;
  };
}

const BASE_TABLE_STYLE: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const BASE_TH_STYLE: CSSProperties = {
  padding: '8px',
  fontSize: '14px',
  fontWeight: 600,
  textAlign: 'center',
};

const BASE_TD_STYLE: CSSProperties = {
  padding: '4px',
  verticalAlign: 'top',
  height: '80px',
  fontSize: '12px',
};

// 1. 심플 (기본)
const simpleTheme: PdfTheme = {
  id: 'simple',
  name: '심플 (기본)',
  category: 'basic',
  styles: {
    container: { backgroundColor: '#ffffff', padding: '24px' },
    title: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: '#000' },
    table: { ...BASE_TABLE_STYLE, border: '1px solid #9ca3af' },
    th: (dow) => ({
      ...BASE_TH_STYLE,
      border: '1px solid #9ca3af',
      backgroundColor: dow === 0 ? '#fef2f2' : dow === 6 ? '#eff6ff' : '#f3f4f6',
      color: dow === 0 ? '#dc2626' : dow === 6 ? '#2563eb' : '#000',
    }),
    td: (isCurrentMonth) => ({
      ...BASE_TD_STYLE,
      border: '1px solid #9ca3af',
      backgroundColor: isCurrentMonth ? '#ffffff' : '#f9fafb',
    }),
    dateText: (isCurrentMonth, isSunday, dow, isHoliday) => ({
      fontWeight: 500,
      marginBottom: '4px',
      color: !isCurrentMonth ? '#9ca3af' : isHoliday || isSunday ? '#dc2626' : dow === 6 ? '#2563eb' : '#000',
    }),
  },
};

// 2. 미니멀 (모던)
const minimalTheme: PdfTheme = {
  id: 'minimal',
  name: '미니멀 (모던)',
  category: 'minimal',
  styles: {
    container: { backgroundColor: '#f8f9fa', padding: '24px' },
    title: { fontSize: '24px', fontWeight: 'bold', textAlign: 'left', marginBottom: '24px', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' },
    table: { ...BASE_TABLE_STYLE },
    th: (dow) => ({
      ...BASE_TH_STYLE,
      borderBottom: '2px solid #e5e7eb',
      color: dow === 0 ? '#ef4444' : dow === 6 ? '#3b82f6' : '#6b7280',
      textAlign: 'left',
      paddingLeft: '8px',
    }),
    td: (isCurrentMonth) => ({
      ...BASE_TD_STYLE,
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: 'transparent',
    }),
    dateText: (isCurrentMonth, isSunday, dow, isHoliday) => ({
      fontWeight: 600,
      fontSize: '14px',
      marginBottom: '8px',
      color: !isCurrentMonth ? '#d1d5db' : isHoliday || isSunday ? '#ef4444' : dow === 6 ? '#3b82f6' : '#374151',
    }),
  },
};

// 시즌 테마 생성 헬퍼
const createSeasonTheme = (
  id: string,
  name: string,
  bgColor: string,
  borderColor: string,
  headerColor: string,
  accentColor: string
): PdfTheme => ({
  id,
  name,
  category: 'season',
  styles: {
    container: { backgroundColor: bgColor, padding: '24px' },
    title: { 
      fontSize: '24px', 
      fontWeight: 'bold', 
      textAlign: 'center', 
      marginBottom: '16px', 
      color: headerColor,
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    table: { ...BASE_TABLE_STYLE, border: `2px solid ${borderColor}`, backgroundColor: 'rgba(255,255,255,0.8)' },
    th: (dow) => ({
      ...BASE_TH_STYLE,
      backgroundColor: accentColor,
      color: '#ffffff',
      border: `1px solid ${borderColor}`,
    }),
    td: (isCurrentMonth) => ({
      ...BASE_TD_STYLE,
      border: `1px solid ${borderColor}`,
      backgroundColor: isCurrentMonth ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
    }),
    dateText: (isCurrentMonth, isSunday, dow, isHoliday) => ({
      fontWeight: 600,
      marginBottom: '4px',
      color: !isCurrentMonth ? '#9ca3af' : isHoliday || isSunday ? '#ef4444' : dow === 6 ? '#2563eb' : '#1f2937',
    }),
  },
});

export const PDF_THEMES: PdfTheme[] = [
  simpleTheme,
  minimalTheme,
  // 봄
  createSeasonTheme('spring_cherry', '봄 - 벚꽃', '#fff1f2', '#fda4af', '#be123c', '#fb7185'),
  createSeasonTheme('spring_sprout', '봄 - 새싹', '#f0fdf4', '#86efac', '#15803d', '#4ade80'),
  createSeasonTheme('spring_butterfly', '봄 - 나비', '#faf5ff', '#d8b4fe', '#7e22ce', '#c084fc'),
  // 여름
  createSeasonTheme('summer_ocean', '여름 - 바다', '#eff6ff', '#93c5fd', '#1e40af', '#60a5fa'),
  createSeasonTheme('summer_sunflower', '여름 - 해바라기', '#fffbeb', '#fcd34d', '#b45309', '#fbbf24'),
  createSeasonTheme('summer_forest', '여름 - 숲', '#ecfccb', '#bef264', '#4d7c0f', '#a3e635'),
  // 가을
  createSeasonTheme('autumn_maple', '가을 - 단풍', '#fff7ed', '#fdba74', '#c2410c', '#fb923c'),
  createSeasonTheme('autumn_sky', '가을 - 하늘', '#f0f9ff', '#7dd3fc', '#0369a1', '#38bdf8'),
  createSeasonTheme('autumn_ginkgo', '가을 - 은행', '#fefce8', '#fde047', '#a16207', '#facc15'),
  // 겨울
  createSeasonTheme('winter_snow', '겨울 - 눈꽃', '#f8fafc', '#cbd5e1', '#475569', '#94a3b8'),
  createSeasonTheme('winter_christmas', '겨울 - 성탄', '#fef2f2', '#fca5a5', '#b91c1c', '#ef4444'),
  createSeasonTheme('winter_night', '겨울 - 밤', '#eff6ff', '#bfdbfe', '#1e3a8a', '#3b82f6'),
];
