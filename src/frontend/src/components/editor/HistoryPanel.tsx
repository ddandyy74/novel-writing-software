import React, { useState, useEffect } from 'react';
import { History, X, RotateCcw, Clock } from 'lucide-react';

interface HistoryEntry {
  id: string;
  timestamp: number;
  preview: string;
  wordCount: number;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onRestore: (content: string) => void;
}

const MAX_HISTORY = 50;

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  currentContent,
  onRestore,
}) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('editor-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    }
  };

  const saveToHistory = () => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      preview: currentContent.slice(0, 200),
      wordCount: countWords(currentContent),
    };

    let updatedHistory = [newEntry, ...history];
    
    if (updatedHistory.length > MAX_HISTORY) {
      updatedHistory = updatedHistory.slice(0, MAX_HISTORY);
    }

    setHistory(updatedHistory);
    localStorage.setItem('editor-history', JSON.stringify(updatedHistory));
  };

  const handleRestore = (entry: HistoryEntry) => {
    if (window.confirm('确定要恢复到此版本吗？当前内容将被替换。')) {
      const stored = localStorage.getItem(`editor-content-${entry.id}`);
      if (stored) {
        onRestore(stored);
        onClose();
      }
    }
  };

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter((h) => h.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('editor-history', JSON.stringify(updatedHistory));
    localStorage.removeItem(`editor-content-${id}`);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const countWords = (text: string) => {
    const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    return chinese;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 z-50 h-full w-80 border-l border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-600" />
          <span className="font-medium text-slate-800">历史版本</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1.5 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {history.length === 0 ? (
          <div className="text-center text-sm text-slate-500">
            <Clock className="mx-auto mb-2 h-12 w-12 text-slate-300" />
            <p>暂无历史版本</p>
            <p className="mt-1 text-xs">系统会自动保存编辑历史</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedId(entry.id)}
                className={`rounded border p-3 transition hover:shadow-md cursor-pointer ${
                  selectedId === entry.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                }`}
              >
                <div className="mb-2 text-xs text-slate-500">
                  {formatTime(entry.timestamp)}
                </div>
                <div className="mb-2 text-sm text-slate-600">
                  {entry.wordCount} 字
                </div>
                <div className="mb-3 text-xs text-slate-600 line-clamp-2">
                  {entry.preview || '(空内容)'}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRestore(entry)}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                  >
                    <RotateCcw className="h-3 w-3" />
                    恢复
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={saveToHistory}
          className="w-full rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          保存当前版本
        </button>
      </div>
    </div>
  );
};

export default HistoryPanel;
