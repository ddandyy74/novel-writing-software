import React, { useState, useEffect } from 'react';
import { FileText, X, Check, Settings2 } from 'lucide-react';
import { formatText, getFormatStats, FormatOptions, defaultFormatOptions } from '@utils/formatter';

interface AutoFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onApply: (newContent: string) => void;
}

const AutoFormatModal: React.FC<AutoFormatModalProps> = ({
  isOpen,
  onClose,
  content,
  onApply,
}) => {
  const [options, setOptions] = useState<FormatOptions>(defaultFormatOptions);
  const [preview, setPreview] = useState('');
  const [stats, setStats] = useState<ReturnType<typeof getFormatStats> | null>(null);

  useEffect(() => {
    if (isOpen && content) {
      const formatted = formatText(content, options);
      setPreview(formatted);
      setStats(getFormatStats(content, formatted));
    }
  }, [isOpen, content, options]);

  const handleOptionChange = (key: keyof FormatOptions, value: boolean | number) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(preview);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[800px] max-h-[80vh] rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            <span className="text-lg font-medium text-slate-800">一键排版</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex">
          <div className="w-64 border-r border-slate-200 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Settings2 className="h-4 w-4" />
              排版选项
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.indent}
                  onChange={(e) => handleOptionChange('indent', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">段落缩进</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.removeExtraSpaces}
                  onChange={(e) => handleOptionChange('removeExtraSpaces', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">删除多余空格</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.removeExtraLines}
                  onChange={(e) => handleOptionChange('removeExtraLines', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">删除多余空行</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.normalizePunctuation}
                  onChange={(e) => handleOptionChange('normalizePunctuation', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">规范化标点</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.addSpaceBetweenChineseEnglish}
                  onChange={(e) => handleOptionChange('addSpaceBetweenChineseEnglish', e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">中英文间加空格</span>
              </label>
            </div>

            {stats && (
              <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
                <div>原文字数：{stats.originalChars}</div>
                <div>排版后字数：{stats.formattedChars}</div>
                <div>
                  {stats.charsChanged > 0 ? '+' : ''}
                  {stats.charsChanged} 字符变化
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-4">
            <div className="mb-2 text-sm font-medium text-slate-700">预览</div>
            <div className="h-96 overflow-auto rounded border border-slate-200 bg-slate-50 p-4">
              <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-slate-800">
                {preview.slice(0, 2000)}
                {preview.length > 2000 && (
                  <span className="text-slate-400">...（预览仅显示前 2000 字）</span>
                )}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            应用排版
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoFormatModal;
