'use client';

import { CSSProperties } from 'react';

// ============================================
// 테마 색상 팔레트 인터페이스
// ============================================
export interface ThemeColors {
  primary: string;       // 메인 색상 (타이틀, 강조)
  background: string;    // 배경 (CSS background 속성 - 그라데이션 가능)
  sunday: string;        // 일요일/공휴일 색상
  saturday: string;      // 토요일 색상
  text: string;          // 기본 텍스트 색상
  muted: string;         // 연한 텍스트 (이전/다음달)
  border: string;        // 테두리 색상
  headerBg: string;      // 헤더(요일) 배경
  cellBg: string;        // 셀 배경
  cellBgMuted: string;   // 이전/다음달 셀 배경
}

// ============================================
// 테마 설정 인터페이스
// ============================================
export interface ThemeConfig {
  id: string;
  name: string;
  colors: ThemeColors;
  hasIllustration: boolean;  // 일러스트 표시 여부
}

// ============================================
// PDF 테마 인터페이스 (최종 출력용)
// ============================================
export interface PdfTheme {
  id: string;
  name: string;
  hasIllustration: boolean;
  styles: {
    container: CSSProperties;
    title: CSSProperties;
    table: CSSProperties;
    th: (dow: number) => CSSProperties;
    td: (isCurrentMonth: boolean, isSunday: boolean, dow: number) => CSSProperties;
    dateText: (isCurrentMonth: boolean, isSunday: boolean, dow: number, isHoliday?: boolean) => CSSProperties;
  };
}

// ============================================
// 기본 스타일 상수
// ============================================
const BASE_CONTAINER_STYLE: CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: '32px',
  position: 'relative',
};

const BASE_TABLE_STYLE: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

const BASE_TH_STYLE: CSSProperties = {
  padding: '10px',
  fontSize: '28px',
  fontWeight: 600,
  textAlign: 'center',
};

const BASE_TD_STYLE: CSSProperties = {
  padding: '4px',
  verticalAlign: 'top',
  height: '96px',
  fontSize: '24px',
};

// ============================================
// 테마 생성 함수 (공통 레이아웃)
// ============================================
const createTheme = (config: ThemeConfig): PdfTheme => {
  const { colors } = config;

  return {
    id: config.id,
    name: config.name,
    hasIllustration: config.hasIllustration,
    styles: {
      container: {
        ...BASE_CONTAINER_STYLE,
        background: colors.background,
      },
      title: {
        fontSize: '56px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '24px',
        color: colors.primary,
        letterSpacing: '-0.02em',
      },
      table: {
        ...BASE_TABLE_STYLE,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderTop: `2px solid ${colors.primary}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      th: (dow: number) => ({
        ...BASE_TH_STYLE,
        backgroundColor: colors.headerBg,
        color: dow === 0 ? colors.sunday : dow === 6 ? colors.saturday : colors.text,
        borderBottom: `1px solid ${colors.border}`,
      }),
      td: (isCurrentMonth: boolean) => ({
        ...BASE_TD_STYLE,
        backgroundColor: isCurrentMonth ? colors.cellBg : colors.cellBgMuted,
        borderBottom: `1px solid ${colors.border}`,
        borderRight: `1px solid ${colors.border}`,
      }),
      dateText: (isCurrentMonth: boolean, isSunday: boolean, dow: number, isHoliday?: boolean) => ({
        fontSize: '17px',
        fontWeight: 600,
        marginBottom: '6px',
        color: !isCurrentMonth
          ? colors.muted
          : (isHoliday || isSunday)
            ? colors.sunday
            : dow === 6
              ? colors.saturday
              : colors.text,
      }),
    },
  };
};

// ============================================
// 테마별 색상 설정
// ============================================
const THEME_CONFIGS: ThemeConfig[] = [
  // 기본 테마
  {
    id: 'simple',
    name: '심플',
    hasIllustration: false,
    colors: {
      primary: '#1f2937',
      background: '#ffffff',
      sunday: '#dc2626',
      saturday: '#2563eb',
      text: '#1f2937',
      muted: '#9ca3af',
      border: '#e5e7eb',
      headerBg: '#f9fafb',
      cellBg: '#ffffff',
      cellBgMuted: '#f9fafb',
    },
  },
  {
    id: 'minimal',
    name: '미니멀',
    hasIllustration: false,
    colors: {
      primary: '#374151',
      background: '#f9fafb',
      sunday: '#ef4444',
      saturday: '#374151',
      text: '#374151',
      muted: '#d1d5db',
      border: '#e5e7eb',
      headerBg: '#f3f4f6',
      cellBg: '#ffffff',
      cellBgMuted: '#f9fafb',
    },
  },

  // 월별 시즌 테마 (일러스트 포함)
  {
    id: 'january',
    name: '1월: 신정',
    hasIllustration: true,
    colors: {
      primary: '#1e40af',
      background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
      sunday: '#dc2626',
      saturday: '#3b82f6',
      text: '#1e3a5f',
      muted: '#94a3b8',
      border: '#bfdbfe',
      headerBg: 'rgba(239, 246, 255, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(241, 245, 249, 0.4)',
    },
  },
  {
    id: 'february',
    name: '2월: 겨울 마을',
    hasIllustration: true,
    colors: {
      primary: '#1e3a8a',
      background: 'linear-gradient(180deg, #e0f2fe 0%, #fae8ff 50%, #f5f3ff 100%)',
      sunday: '#dc2626',
      saturday: '#4f46e5',
      text: '#1e3a5f',
      muted: '#a5b4c4',
      border: '#c7d2fe',
      headerBg: 'rgba(224, 242, 254, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(241, 245, 249, 0.4)',
    },
  },
  {
    id: 'march',
    name: '3월: 봄의 시작',
    hasIllustration: true,
    colors: {
      primary: '#9d174d',
      background: 'linear-gradient(180deg, #fce7f3 0%, #f0fdf4 100%)',
      sunday: '#dc2626',
      saturday: '#db2777',
      text: '#831843',
      muted: '#d1a3b8',
      border: '#fbcfe8',
      headerBg: 'rgba(252, 231, 243, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(253, 242, 248, 0.4)',
    },
  },
  {
    id: 'april',
    name: '4월: 튤립 축제',
    hasIllustration: true,
    colors: {
      primary: '#854d0e',
      background: 'linear-gradient(180deg, #fef9c3 0%, #f0fdf4 100%)',
      sunday: '#dc2626',
      saturday: '#ca8a04',
      text: '#713f12',
      muted: '#bda76a',
      border: '#fde047',
      headerBg: 'rgba(254, 249, 195, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(254, 252, 232, 0.4)',
    },
  },
  {
    id: 'may',
    name: '5월: 가정의 달',
    hasIllustration: true,
    colors: {
      primary: '#166534',
      background: 'linear-gradient(180deg, #f0fdf4 0%, #fef9c3 100%)',
      sunday: '#dc2626',
      saturday: '#16a34a',
      text: '#14532d',
      muted: '#86a98a',
      border: '#bbf7d0',
      headerBg: 'rgba(240, 253, 244, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(240, 253, 244, 0.4)',
    },
  },
  {
    id: 'june',
    name: '6월: 수국',
    hasIllustration: true,
    colors: {
      primary: '#6b21a8',
      background: 'linear-gradient(180deg, #f3e8ff 0%, #eff6ff 100%)',
      sunday: '#dc2626',
      saturday: '#9333ea',
      text: '#581c87',
      muted: '#a78bcc',
      border: '#e9d5ff',
      headerBg: 'rgba(243, 232, 255, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(250, 245, 255, 0.4)',
    },
  },
  {
    id: 'july',
    name: '7월: 한여름 바다',
    hasIllustration: true,
    colors: {
      primary: '#155e75',
      background: 'linear-gradient(180deg, #cffafe 0%, #dbeafe 100%)',
      sunday: '#dc2626',
      saturday: '#0891b2',
      text: '#164e63',
      muted: '#7cb7c9',
      border: '#a5f3fc',
      headerBg: 'rgba(207, 250, 254, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(236, 254, 255, 0.4)',
    },
  },
  {
    id: 'august',
    name: '8월: 해바라기',
    hasIllustration: true,
    colors: {
      primary: '#9a3412',
      background: 'linear-gradient(180deg, #ffedd5 0%, #fef9c3 100%)',
      sunday: '#dc2626',
      saturday: '#ea580c',
      text: '#7c2d12',
      muted: '#c9a07a',
      border: '#fed7aa',
      headerBg: 'rgba(255, 237, 213, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(255, 247, 237, 0.4)',
    },
  },
  {
    id: 'september',
    name: '9월: 가을 달밤',
    hasIllustration: true,
    colors: {
      primary: '#facc15',
      background: 'linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)',
      sunday: '#f87171',
      saturday: '#a78bfa',
      text: '#fef9c3',
      muted: '#6366f1',
      border: '#4338ca',
      headerBg: 'rgba(49, 46, 129, 0.8)',
      cellBg: 'rgba(30, 27, 75, 0.6)',
      cellBgMuted: 'rgba(30, 27, 75, 0.3)',
    },
  },
  {
    id: 'october',
    name: '10월: 단풍',
    hasIllustration: true,
    colors: {
      primary: '#991b1b',
      background: 'linear-gradient(180deg, #fef2f2 0%, #ffedd5 100%)',
      sunday: '#dc2626',
      saturday: '#ea580c',
      text: '#7f1d1d',
      muted: '#c9a3a3',
      border: '#fecaca',
      headerBg: 'rgba(254, 242, 242, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(254, 242, 242, 0.4)',
    },
  },
  {
    id: 'november',
    name: '11월: 늦가을',
    hasIllustration: true,
    colors: {
      primary: '#57534e',
      background: 'linear-gradient(180deg, #f5f5f4 0%, #ffedd5 100%)',
      sunday: '#dc2626',
      saturday: '#78716c',
      text: '#44403c',
      muted: '#a8a29e',
      border: '#d6d3d1',
      headerBg: 'rgba(245, 245, 244, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(250, 250, 249, 0.4)',
    },
  },
  {
    id: 'december',
    name: '12월: 크리스마스',
    hasIllustration: true,
    colors: {
      primary: '#166534',
      background: 'linear-gradient(180deg, #fef2f2 0%, #f0fdf4 100%)',
      sunday: '#dc2626',
      saturday: '#166534',
      text: '#14532d',
      muted: '#a3b8a3',
      border: '#bbf7d0',
      headerBg: 'rgba(254, 242, 242, 0.8)',
      cellBg: 'rgba(255, 255, 255, 0.6)',
      cellBgMuted: 'rgba(240, 253, 244, 0.4)',
    },
  },
];

// ============================================
// 테마 생성 및 내보내기
// ============================================
export const PDF_THEMES: PdfTheme[] = THEME_CONFIGS.map(createTheme);

// 테마 ID로 테마 찾기 헬퍼
export const getThemeById = (id: string): PdfTheme => {
  return PDF_THEMES.find(t => t.id === id) || PDF_THEMES[0];
};

// 테마 설정 내보내기 (색상 커스터마이징 등에 활용 가능)
export { THEME_CONFIGS };
