'use client';

import { useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Doctor, DayData } from '@/types';
import { generateCalendarDays, getDayOfWeekName } from '@/utils/calendar';
import { PDF_THEMES, PdfTheme } from '@/utils/pdfThemes';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  hospitalName: string;
  doctors: Doctor[];
  dayData: Record<string, DayData>;
}

export default function PdfExportModal({
  isOpen,
  onClose,
  year,
  month,
  hospitalName,
  doctors,
  dayData,
}: PdfExportModalProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('simple');
  const [useColors, setUseColors] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const days = generateCalendarDays(year, month);
  const useShortTime = doctors.length >= 3;
  const currentTheme = PDF_THEMES.find(t => t.id === selectedThemeId) || PDF_THEMES[0];

  const formatTime = (start?: string, end?: string): string => {
    if (!start || !end) return '';
    if (useShortTime) {
      return `${start.split(':')[0]}-${end.split(':')[0]}`;
    }
    return `${start}-${end}`;
  };

  const handleDownload = async () => {
    if (!calendarRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null, // 투명 배경 허용 (컨테이너 배경색 사용)
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const yOffset = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', 10, yOffset > 10 ? yOffset : 10, imgWidth, imgHeight);

      const fileName = `${hospitalName || '병원'}_${year}년_${month}월_스케줄.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!calendarRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const yOffset = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', 10, yOffset > 10 ? yOffset : 10, imgWidth, imgHeight);

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('미리보기 오류:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 my-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-lg font-semibold">PDF 내보내기</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 설정 사이드바 */}
          <div className="w-64 border-r p-4 overflow-y-auto shrink-0 bg-gray-50">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">테마 선택</label>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">기본</div>
                  {PDF_THEMES.filter(t => t.category === 'basic').map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedThemeId === theme.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                  
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">미니멀</div>
                  {PDF_THEMES.filter(t => t.category === 'minimal').map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedThemeId === theme.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}

                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">시즌/자연</div>
                  <div className="grid grid-cols-1 gap-2">
                    {PDF_THEMES.filter(t => t.category === 'season').map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          selectedThemeId === theme.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useColors}
                    onChange={(e) => setUseColors(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">의사별 색상 적용</span>
                </label>
              </div>
            </div>
          </div>

          {/* 미리보기 영역 */}
          <div className="flex-1 bg-gray-200 overflow-auto p-8 flex justify-center">
            <div
              ref={calendarRef}
              style={{
                width: '794px',
                minHeight: '500px',
                ...currentTheme.styles.container
              }}
              className="shadow-lg"
            >
              <h1 style={currentTheme.styles.title}>
                {hospitalName || '병원'} - {year}년 {month}월 스케줄
              </h1>

              <table style={currentTheme.styles.table}>
                <thead>
                  <tr>
                    {[0, 1, 2, 3, 4, 5, 6].map((dow) => (
                      <th
                        key={dow}
                        style={currentTheme.styles.th(dow)}
                      >
                        {getDayOfWeekName(dow)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                        const data = day.isCurrentMonth ? dayData[String(day.date)] : undefined;
                        const isSunday = day.dayOfWeek === 0;

                        return (
                          <td
                            key={dayIndex}
                            style={currentTheme.styles.td(day.isCurrentMonth, isSunday, day.dayOfWeek)}
                          >
                            <div
                              style={currentTheme.styles.dateText(day.isCurrentMonth, isSunday, day.dayOfWeek, data?.isHoliday)}
                            >
                              {day.date}
                            </div>
                            {data?.holidayName && (
                              <div className="text-xs text-red-500 truncate mb-1" style={{ fontSize: '11px' }}>
                                {data.holidayName}
                              </div>
                            )}
                            {day.isCurrentMonth &&
                              doctors.map((doc) => {
                                const sched = data?.doctors?.[doc.id];
                                const isOff = !sched || sched.status === 'off';
                                return (
                                  <div
                                    key={doc.id}
                                    className="text-xs truncate"
                                    style={{
                                      fontSize: '11px',
                                      lineHeight: '1.4',
                                      color: useColors && !isOff ? doc.color : isOff ? '#9ca3af' : '#374151',
                                      opacity: isOff ? 0.7 : 1,
                                    }}
                                  >
                                    {doc.name}: {isOff ? '휴진' : formatTime(sched?.start, sched?.end)}
                                  </div>
                                );
                              })}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right text-xs text-gray-400">
                Generated by 진료 스케줄러
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            닫기
          </button>
          <button
            onClick={handlePreview}
            disabled={isGenerating}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            미리보기
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? '생성 중...' : '다운로드'}
          </button>
        </div>
      </div>
    </div>
  );
}
