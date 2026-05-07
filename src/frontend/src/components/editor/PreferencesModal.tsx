import React, { useState } from 'react';
import { Settings, X, Save, RotateCcw } from 'lucide-react';
import { useEditorSettingsStore, fontFamilies, fontSizes, bgColors } from '@stores/editorSettingsStore';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const {
    fontFamily,
    fontSize,
    bgColor,
    lineHeight,
    showLineNumbers,
    setFontFamily,
    setFontSize,
    setBgColor,
    setLineHeight,
    toggleLineNumbers,
    resetToDefaults,
  } = useEditorSettingsStore();

  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30);

  const handleReset = () => {
    if (window.confirm('确定要恢复默认设置吗？')) {
      resetToDefaults();
      setAutoSave(true);
      setAutoSaveInterval(30);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[600px] max-h-[80vh] overflow-auto rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-600" />
            <span className="text-lg font-medium text-slate-800">偏好设置</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <h3 className="mb-3 text-sm font-medium text-slate-800">编辑器设置</h3>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-slate-600">字体</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.id} value={font.family}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-600">字号</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-600">背景色</label>
                <div className="flex gap-2">
                  {bgColors.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setBgColor(bg.color)}
                      className={`h-10 w-10 rounded border-2 ${
                        bgColor === bg.color ? 'border-blue-600' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: bg.color }}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-600">行高</label>
                <input
                  type="range"
                  min="1.5"
                  max="3"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-slate-500">{lineHeight.toFixed(1)}</div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={toggleLineNumbers}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">显示行号</span>
              </label>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-3 text-sm font-medium text-slate-800">自动保存</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">启用自动保存</span>
              </label>

              {autoSave && (
                <div>
                  <label className="mb-1.5 block text-sm text-slate-600">保存间隔</label>
                  <select
                    value={autoSaveInterval}
                    onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value={10}>10 秒</option>
                    <option value={30}>30 秒</option>
                    <option value={60}>1 分钟</option>
                    <option value={300}>5 分钟</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-3 text-sm font-medium text-slate-800">快捷键</h3>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>保存</span>
                <kbd className="rounded bg-slate-100 px-2 py-0.5 text-xs">Ctrl+S</kbd>
              </div>
              <div className="flex justify-between">
                <span>查找替换</span>
                <kbd className="rounded bg-slate-100 px-2 py-0.5 text-xs">Ctrl+F</kbd>
              </div>
              <div className="flex justify-between">
                <span>全屏</span>
                <kbd className="rounded bg-slate-100 px-2 py-0.5 text-xs">F11</kbd>
              </div>
              <div className="flex justify-between">
                <span>撤销</span>
                <kbd className="rounded bg-slate-100 px-2 py-0.5 text-xs">Ctrl+Z</kbd>
              </div>
              <div className="flex justify-between">
                <span>重做</span>
                <kbd className="rounded bg-slate-100 px-2 py-0.5 text-xs">Ctrl+Y</kbd>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-between border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            恢复默认
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
