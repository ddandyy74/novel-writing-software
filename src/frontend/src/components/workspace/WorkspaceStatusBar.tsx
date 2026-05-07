import React from 'react';

interface WorkspaceStatusBarProps {
  chapterWords: number;
  cursorLine: number;
  cursorColumn: number;
  onCreateChapter: () => void;
  onComingSoon: (feature: string) => void;
}

const DAILY_TARGET = 5000;

const WorkspaceStatusBar: React.FC<WorkspaceStatusBarProps> = ({
  chapterWords,
  cursorLine,
  cursorColumn,
  onCreateChapter,
  onComingSoon,
}) => (
  <footer className="flex h-6 items-center justify-between border-t border-slate-200 bg-slate-50 px-4 text-xs text-slate-500">
    <button type="button" onClick={onCreateChapter} className="hover:text-blue-600">+ 新建章节</button>
    <button type="button" onClick={() => onComingSoon('写作计划')} className="hover:text-blue-600">
      ◯ 计划：剩 {Math.max(0, DAILY_TARGET - chapterWords).toLocaleString()}
    </button>
    <div className="flex items-center gap-8">
      <button type="button" onClick={() => onComingSoon('纠错')} className="hover:text-blue-600">纠错</button>
      <span>本章：<strong className="font-semibold text-slate-700">{chapterWords}</strong></span>
      <span>行 {cursorLine}，列 {cursorColumn}</span>
    </div>
  </footer>
);

export default WorkspaceStatusBar;
