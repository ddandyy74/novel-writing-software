import React, { useState, useRef, useEffect } from 'react';
import { Paintbrush, Check } from 'lucide-react';
import { useEditorSettingsStore, bgColors } from '@stores/editorSettingsStore';

interface BackgroundSelectorProps {
  onClose?: () => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { bgColor, setBgColor } = useEditorSettingsStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (color: string) => {
    setBgColor(color);
  };

  const currentBg = bgColors.find((b) => b.color === bgColor) || bgColors[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
      >
        <Paintbrush className="h-4 w-4" />
        <span>背景</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="p-2">
            <div className="mb-2 text-xs font-medium text-slate-600">背景色</div>
            <div className="grid grid-cols-5 gap-2">
              {bgColors.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => handleColorSelect(bg.color)}
                  className={`relative h-8 w-8 rounded border-2 transition-transform hover:scale-110 ${
                    bgColor === bg.color ? 'border-blue-600' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: bg.color }}
                  title={bg.name}
                >
                  {bgColor === bg.color && (
                    <Check className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 px-3 py-2">
            <div className="text-xs text-slate-500">当前：{currentBg.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundSelector;
