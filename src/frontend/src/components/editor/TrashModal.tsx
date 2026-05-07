import React, { useState, useEffect } from 'react';
import { Trash2, X, RotateCcw, Trash, Clock, FileText } from 'lucide-react';
import api from '../../api/client';

interface TrashWork {
  id: string;
  title: string;
  chapterCount: number;
  wordCount: number;
  deletedAt: string;
}

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: () => void;
}

const TrashModal: React.FC<TrashModalProps> = ({ isOpen, onClose, onRestore }) => {
  const [works, setWorks] = useState<TrashWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTrashWorks();
    }
  }, [isOpen]);

  const loadTrashWorks = async () => {
    setLoading(true);
    try {
      const response = await api.getTrashWorks();
      if (response.code === 0) {
        setWorks(response.data.items || []);
      }
    } catch (error) {
      console.error('Failed to load trash works:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (workId: string) => {
    if (!window.confirm('确定要恢复这个作品吗？')) return;

    try {
      const response = await api.restoreWork(workId);
      if (response.code === 0) {
        setWorks(works.filter((w) => w.id !== workId));
        onRestore();
      } else {
        alert(response.message || '恢复失败');
      }
    } catch (error: any) {
      alert(error.message || '恢复失败');
    }
  };

  const handlePermanentDelete = async (workId: string) => {
    if (!window.confirm('永久删除后无法恢复，确定要删除吗？')) return;

    try {
      const response = await api.permanentDeleteWork(workId);
      if (response.code === 0) {
        setWorks(works.filter((w) => w.id !== workId));
      } else {
        alert(response.message || '删除失败');
      }
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[600px] max-h-[80vh] rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-slate-600" />
            <span className="text-lg font-medium text-slate-800">回收站</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-sm text-slate-500 py-8">
              加载中...
            </div>
          ) : works.length === 0 ? (
            <div className="text-center text-sm text-slate-500 py-8">
              <Trash className="mx-auto mb-2 h-12 w-12 text-slate-300" />
              <p>回收站是空的</p>
            </div>
          ) : (
            <div className="space-y-3">
              {works.map((work) => (
                <div
                  key={work.id}
                  onClick={() => setSelectedId(selectedId === work.id ? null : work.id)}
                  className={`rounded border p-4 transition cursor-pointer ${
                    selectedId === work.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-800">{work.title}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span>{work.chapterCount} 章</span>
                        <span>{work.wordCount} 字</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(work.deletedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(work.id);
                        }}
                        className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                      >
                        <RotateCcw className="h-3 w-3" />
                        恢复
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePermanentDelete(work.id);
                        }}
                        className="flex items-center gap-1 rounded border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                      >
                        <Trash className="h-3 w-3" />
                        永久删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <div className="text-xs text-slate-500">
            回收站作品将在 30 天后自动永久删除
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrashModal;
