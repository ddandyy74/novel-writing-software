import React, { useState, useEffect } from 'react';
import Editor from '@editor/Editor';
import ChapterSidebar from './ChapterSidebar';
import EditorToolbar from './EditorToolbar';
import RightToolRail from './RightToolRail';
import WorkspaceStatusBar from './WorkspaceStatusBar';
import FindReplaceModal from '@components/editor/FindReplaceModal';
import AutoFormatModal from '@components/editor/AutoFormatModal';
import HistoryPanel from '@components/editor/HistoryPanel';
import { useEditorSettingsStore } from '@stores/editorSettingsStore';

interface WorkspaceWork {
  id: string;
  title: string;
}

interface WorkspaceChapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  order: number;
}

interface WriterWorkspaceProps {
  currentWork: WorkspaceWork | null;
  chapters: WorkspaceChapter[];
  currentChapter: WorkspaceChapter | null;
  content: string;
  chapterWords: number;
  cursorLine: number;
  cursorColumn: number;
  isAuthenticated: boolean;
  isFullscreen: boolean;
  onSelectChapter: (chapterId: string) => void;
  onCreateChapter: () => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onLogin: () => void;
  onToggleFullscreen: () => Promise<void>;
  onComingSoon: (feature: string) => void;
}

const WriterWorkspace: React.FC<WriterWorkspaceProps> = ({
  currentWork,
  chapters,
  currentChapter,
  content,
  chapterWords,
  cursorLine,
  cursorColumn,
  isAuthenticated,
  isFullscreen,
  onSelectChapter,
  onCreateChapter,
  onContentChange,
  onSave,
  onLogin,
  onToggleFullscreen,
  onComingSoon,
}) => {
  const { bgColor } = useEditorSettingsStore();
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showAutoFormat, setShowAutoFormat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowFindReplace(true);
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        setShowFindReplace(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#f5f7fb] text-slate-900">
      <EditorToolbar
        isAuthenticated={isAuthenticated}
        onLogin={onLogin}
        onComingSoon={onComingSoon}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        onFindReplace={() => setShowFindReplace(true)}
        onAutoFormat={() => setShowAutoFormat(true)}
        onHistory={() => setShowHistory(true)}
      />

      <div className="min-h-0 flex flex-1">
        <ChapterSidebar
          workTitle={currentWork?.title || '未选择作品'}
          chapters={chapters}
          currentChapterId={currentChapter?.id}
          onCreateChapter={onCreateChapter}
          onSelectChapter={onSelectChapter}
          onComingSoon={onComingSoon}
        />

        <section className="min-w-0 flex-1 bg-[#f5f7fb]">
          {currentChapter ? (
            <div className="flex h-full flex-col">
              <div className="mx-auto w-full max-w-[820px] px-16 pt-12">
                <h1 className="mb-8 text-2xl font-medium text-slate-800">{currentChapter.title}</h1>
              </div>
              <div className="min-h-0 flex-1 px-12 pb-6">
                <div 
                  className="mx-auto h-full max-w-[900px] rounded-sm"
                  style={{ backgroundColor: bgColor }}
                >
                  <Editor content={content} onChange={onContentChange} onSave={onSave} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <div className="text-lg font-semibold text-slate-600">请选择章节开始创作</div>
              <button type="button" onClick={onCreateChapter} className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">新建章节</button>
            </div>
          )}
        </section>

        <RightToolRail isAuthenticated={isAuthenticated} onLogin={onLogin} onComingSoon={onComingSoon} />
      </div>

      <WorkspaceStatusBar
        chapterWords={chapterWords}
        cursorLine={cursorLine}
        cursorColumn={cursorColumn}
        onCreateChapter={onCreateChapter}
        onComingSoon={onComingSoon}
      />

      <FindReplaceModal
        isOpen={showFindReplace}
        onClose={() => setShowFindReplace(false)}
        content={content}
        onReplace={onContentChange}
      />

      <AutoFormatModal
        isOpen={showAutoFormat}
        onClose={() => setShowAutoFormat(false)}
        content={content}
        onApply={onContentChange}
      />

      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        currentContent={content}
        onRestore={onContentChange}
      />
    </div>
  );
};

export default WriterWorkspace;
