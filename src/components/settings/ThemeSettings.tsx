'use client';

import { useConfigStore } from '@/stores';
import { PDF_THEMES } from '@/utils/pdfThemes';
import { DisplayMode } from '@/types';

const DISPLAY_MODES: { id: DisplayMode; name: string; description: string }[] = [
  { id: 'detailed', name: '상세', description: '의사별 근무 시간 표시' },
  { id: 'simple', name: '심플', description: '휴진 여부만 표시 (OFF 배지)' },
];

export default function ThemeSettings() {
  const { themeId, setThemeId, displayMode, setDisplayMode, noticeText, setNoticeText } = useConfigStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">기본 문구</h3>
        <p className="text-xs text-gray-500 mb-2">시즌 테마에서 캘린더 상단에 표시됩니다. 스케줄 생성 시 이 문구가 기본값으로 사용됩니다.</p>
        <input
          type="text"
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          placeholder="안내 문구를 입력하세요"
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">표시 모드</h3>
        <div className="space-y-2">
          {DISPLAY_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setDisplayMode(mode.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${displayMode === mode.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border'
                }`}
            >
              <div className="text-sm font-medium">{mode.name}</div>
              <div className={`text-xs ${displayMode === mode.id ? 'text-blue-100' : 'text-gray-500'}`}>
                {mode.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">테마 선택</h3>

        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            자동 설정
          </div>
          <button
            onClick={() => setThemeId('auto')}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${themeId === 'auto'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            <div className="font-medium">자동 테마</div>
            <div className={`text-xs ${themeId === 'auto' ? 'text-blue-100' : 'text-gray-500'}`}>
              매월 계절에 맞는 테마로 자동 변경됩니다.
            </div>
          </button>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
            기본 테마
          </div>
          {PDF_THEMES.filter((t) => !t.hasIllustration).map((theme) => (
            <button
              key={theme.id}
              onClick={() => setThemeId(theme.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${themeId === theme.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border'
                }`}
            >
              {theme.name}
            </button>
          ))}

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
            시즌 테마 (일러스트 포함)
          </div>
          <div className="grid grid-cols-1 gap-2">
            {PDF_THEMES.filter((t) => t.hasIllustration).map((theme) => (
              <button
                key={theme.id}
                onClick={() => setThemeId(theme.id)}
                className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${themeId === theme.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border'
                  }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
