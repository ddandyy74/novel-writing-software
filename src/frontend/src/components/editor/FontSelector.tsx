import React, { useState, useRef, useEffect } from 'react';
import { Type, ChevronDown, Check } from 'lucide-react';
import { useEditorSettingsStore, fontFamilies, fontSizes } from '@stores/editorSettingsStore';

interface FontSelectorProps {
  onClose?: () => void;
}

const FontSelector: React.FC<FontSelectorProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'font' | 'size'>('font');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { fontFamily, fontSize, setFontFamily, setFontSize } = useEditorSettingsStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFontSelect = (family: string) => {
    setFontFamily(family);
    setIsOpen(false);
  };

  const handleSizeSelect = (size: number) => {
    setFontSize(size);
  };

  const currentFont = fontFamilies.find((f) => f.family === fontFamily) || fontFamilies[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
      >
        <Type className="h-4 w-4" />
        <span>字体</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('font')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'font'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              字体
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('size')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'size'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              字号
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {activeTab === 'font' && (
              <div className="space-y-1">
                {fontFamilies.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => handleFontSelect(font.family)}
                    className={`flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-slate-50 ${
                      fontFamily === font.family ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    style={{ fontFamily: font.family }}
                  >
                    <span>{font.name}</span>
                    {fontFamily === font.family && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'size' && (
              <div className="grid grid-cols-4 gap-1">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeSelect(size)}
                    className={`rounded px-3 py-2 text-center hover:bg-slate-50 ${
                      fontSize === size ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    style={{ fontSize: `${size}px` }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 px-3 py-2">
            <div className="text-xs text-slate-500">
              当前：{currentFont.name} / {fontSize}px
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
