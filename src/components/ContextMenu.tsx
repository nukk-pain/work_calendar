'use client';

import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onSetOff: () => void;
  onChangeTime: () => void;
  onReset: () => void;
  isOff: boolean;
}

export default function ContextMenu({
  x,
  y,
  onClose,
  onSetOff,
  onChangeTime,
  onReset,
  isOff,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    zIndex: 50,
  };

  return (
    <div
      ref={menuRef}
      style={menuStyle}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]"
    >
      <button
        onClick={() => {
          onSetOff();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
      >
        {isOff ? '근무로 변경' : '휴진 처리'}
      </button>
      <button
        onClick={() => {
          onChangeTime();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
      >
        시간 변경
      </button>
      <hr className="my-1 border-gray-200" />
      <button
        onClick={() => {
          onReset();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      >
        초기화
      </button>
    </div>
  );
}
