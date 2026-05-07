import React, { useMemo, useState } from 'react';
import { FilePlus2, Folder, Search, Trash2, Upload, ListTree } from 'lucide-react';

interface ChapterItem {
  id: string;
  title: string;
  wordCount: number;
  order: number;
}

interface ChapterSidebarProps {
  workTitle: string;
  chapters: ChapterItem[];
  currentChapterId?: string;
  onCreateChapter: () => void;
  onSelectChapter: (chapterId: string) => void;
  onComingSoon: (feature: string) => void;
}

const ChapterSidebar: React.FC<ChapterSidebarProps> = ({
  workTitle,
  chapters,
  currentChapterId,
  onCreateChapter,
  onSelectChapter,
  onComingSoon,
}) => {
  const [keyword, setKeyword] = useState('');
  const filteredChapters = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return chapters;
    return chapters.filter((chapter) => chapter.title.toLowerCase().includes(normalized));
  }, [chapters, keyword]);

  return (
    <aside className="flex w-[258px] flex-none flex-col border-r border-slate-200 bg-white">
      <div className="p-3">
        <div className="flex h-8 items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 text-slate-400">
          <Search className="h-4 w-4" />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="全书" className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-3 pb-3">
        <button type="button" onClick={onCreateChapter} className="h-8 rounded bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">新建章</button>
        <button type="button" onClick={() => onComingSoon('新建卷')} className="h-8 rounded border border-slate-200 text-sm text-slate-700 hover:bg-slate-50">新建卷</button>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 px-3 pb-2 text-xs">
        <div className="flex items-center gap-3">
          <button type="button" className="border-b-2 border-blue-600 pb-1 font-semibold text-blue-700">草稿</button>
          <button type="button" onClick={() => onComingSoon('筛选')} className="pb-1 text-slate-500 hover:text-slate-900">筛选⌄</button>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <button type="button" onClick={() => onComingSoon('删除章节')}><Trash2 className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => onComingSoon('导入章节')}><Upload className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => onComingSoon('章节排序')}><ListTree className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-1 py-3 text-sm">
        <div className="mb-1 flex items-center justify-between px-3 py-1 text-slate-500">
          <span className="flex min-w-0 items-center gap-1.5 truncate"><Folder className="h-4 w-4" />作品相关</span>
          <span className="text-xs">0章</span>
        </div>
        <div className="mb-1 flex items-center justify-between px-3 py-1 font-semibold text-slate-700">
          <span className="flex min-w-0 items-center gap-1.5 truncate"><Folder className="h-4 w-4" />第一卷</span>
          <span className="text-xs font-normal text-slate-400">{chapters.length}章</span>
        </div>
        {filteredChapters.length > 0 ? (
          filteredChapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelectChapter(chapter.id)}
              className={`mb-1 flex h-8 w-full items-center rounded px-7 text-left text-sm font-semibold ${
                currentChapterId === chapter.id ? 'bg-blue-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="truncate">{chapter.title}</span>
            </button>
          ))
        ) : (
          <div className="px-3 py-10 text-center text-xs text-slate-400">
            <FilePlus2 className="mx-auto mb-2 h-5 w-5" />
            暂无章节
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 px-3 py-2 text-xs text-slate-400 truncate">{workTitle}</div>
    </aside>
  );
};

export default ChapterSidebar;
