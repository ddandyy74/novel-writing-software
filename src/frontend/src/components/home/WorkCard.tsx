import React from 'react';
import { MoreHorizontal } from 'lucide-react';

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
}

const WorkCard: React.FC<WorkCardProps> = ({ work, isAuthenticated, onOpen }) => (
  <button type="button" onClick={() => onOpen(work.id)} className="group w-[132px] text-left">
    <div className="relative h-[162px] overflow-hidden rounded border border-blue-200 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
      <span className="absolute left-0 top-0 rounded-br bg-slate-700 px-1.5 py-0.5 text-[11px] text-white">
        {isAuthenticated ? '云端' : '私密'}
      </span>
      <div className="absolute inset-x-0 bottom-7 text-center text-5xl text-blue-100/60">羽</div>
    </div>
    <div className="mt-3 flex items-start gap-1">
      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">{work.title}</div>
        <div className="mt-1 text-xs text-slate-400">
          {work.chapterCount} 章 · {work.wordCount} 字
        </div>
      </div>
      <MoreHorizontal className="mt-0.5 h-4 w-4 flex-none text-slate-400" />
    </div>
  </button>
);

export default WorkCard;
