import React, { useEffect, useRef, useState } from 'react';
import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react';

interface WorkCardWork {
  id: string;
  title: string;
  chapterCount: number;
  wordCount: number;
  userId?: string;
}

interface WorkCardProps {
  work: WorkCardWork;
  isAuthenticated: boolean;
  onOpen: (workId: string) => void;
  onDelete: (workId: string) => void;
  onRename?: (workId: string) => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, isAuthenticated, onOpen, onDelete, onRename }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [menuOpen]);

  return (
    <div ref={cardRef} className="group relative w-[132px] text-left">
      <button type="button" onClick={() => onOpen(work.id)} className="block w-full text-left">
        <div className="relative h-[162px] overflow-hidden rounded border border-blue-200 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
          <span className="absolute left-0 top-0 rounded-br bg-slate-700 px-1.5 py-0.5 text-[11px] text-white">
            {isAuthenticated ? '云端' : '私密'}
          </span>
          <div className="absolute inset-x-0 bottom-7 text-center text-5xl text-blue-100/60">羽</div>
        </div>
      </button>
      <div className="mt-3 flex items-start gap-1">
        <button type="button" onClick={() => onOpen(work.id)} className="min-w-0 flex-1 text-left">
          <div className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">{work.title}</div>
          <div className="mt-1 text-xs text-slate-400">
            {work.chapterCount} 章 · {work.wordCount} 字
          </div>
        </button>
        <button
          type="button"
          aria-label={`${work.title} 更多操作`}
          onClick={(event) => {
            event.stopPropagation();
            setMenuOpen((open) => !open);
          }}
          className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-0 top-[190px] z-20 w-28 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onOpen(work.id);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
          >
            打开作品
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onRename?.(work.id);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
          >
            <Edit3 className="h-3.5 w-3.5" />
            重命名
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onDelete(work.id);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            删除
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkCard;
