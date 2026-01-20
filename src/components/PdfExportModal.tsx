'use client';

import { useState, RefObject } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  hospitalName: string;
  calendarRef: RefObject<HTMLDivElement | null>;
}

export default function PdfExportModal({
  isOpen,
  onClose,
  year,
  month,
  hospitalName,
  calendarRef,
}: PdfExportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const generatePdf = async (): Promise<jsPDF | null> => {
    if (!calendarRef.current) return null;

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

    return pdf;
  };

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const pdf = await generatePdf();
      if (pdf) {
        const fileName = `${hospitalName || '병원'}_${year}년_${month}월_스케줄.pdf`;
        pdf.save(fileName);
      }
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    setIsGenerating(true);

    try {
      const pdf = await generatePdf();
      if (pdf) {
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      }
    } catch (error) {
      console.error('미리보기 오류:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">PDF 내보내기</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          현재 화면에 보이는 캘린더를 PDF로 내보냅니다.
          <br />
          <span className="text-gray-500">
            테마는 설정 → 테마 메뉴에서 변경할 수 있습니다.
          </span>
        </p>

        <div className="flex justify-end gap-3">
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
