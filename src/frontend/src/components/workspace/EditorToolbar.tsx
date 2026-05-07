import React from 'react';
import {
  BookOpen,
  Clock3,
  Expand,
  FileText,
  History,
  Image,
  Mic,
  Minimize2,
  Redo2,
  Search,
  Undo2,
  UserRound,
  Wand2,
} from 'lucide-react';
import FontSelector from '@components/editor/FontSelector';
import BackgroundSelector from '@components/editor/BackgroundSelector';

interface EditorToolbarProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onComingSoon: (feature: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => Promise<void>;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onFindReplace?: () => void;
  onAutoFormat?: () => void;
  onHistory?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isAuthenticated,
  onLogin,
  onComingSoon,
  isFullscreen,
  onToggleFullscreen,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
  onFindReplace,
  onAutoFormat,
  onHistory,
}) => {
  const handleTool = (label: string, auth?: boolean) => {
    if (auth && !isAuthenticated) {
      onLogin();
      return;
    }
    onComingSoon(label);
  };

  return (
    <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4 text-sm text-slate-700">
      <div className="flex items-center gap-1">
        <FontSelector />
        <BackgroundSelector />
        
        <button
          type="button"
          onClick={onUndo || (() => handleTool('撤销'))}
          disabled={!canUndo}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100 disabled:opacity-50"
        >
          <Undo2 className="h-4 w-4" />
          <span>撤销</span>
        </button>
        
        <button
          type="button"
          onClick={onRedo || (() => handleTool('重做'))}
          disabled={!canRedo}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100 disabled:opacity-50"
        >
          <Redo2 className="h-4 w-4" />
          <span>重做</span>
        </button>
        
        <button
          type="button"
          onClick={onAutoFormat || (() => handleTool('一键排版'))}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
        >
          <FileText className="h-4 w-4" />
          <span>一键排版</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleTool('插入')}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
        >
          <BookOpen className="h-4 w-4" />
          <span>插入</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleTool('输入')}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
        >
          <Mic className="h-4 w-4" />
          <span>输入</span>
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
          title={isFullscreen ? '退出全屏 (F11)' : '全屏 (F11)'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-4 w-4" />
              <span>退出全屏</span>
            </>
          ) : (
            <>
              <Expand className="h-4 w-4" />
              <span>全屏</span>
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={() => handleTool('闪关')}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
        >
          <Wand2 className="h-4 w-4" />
          <span>闪关</span>
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        
        <button
          type="button"
          onClick={onFindReplace || (() => handleTool('查找替换'))}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
        >
          <Search className="h-4 w-4" />
          <span>查找替换</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleTool('取名', true)}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
        >
          <UserRound className="h-4 w-4" />
          <span>取名</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleTool('画师', true)}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
        >
          <Image className="h-4 w-4" />
          <span>画师</span>
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        
        <button
          type="button"
          onClick={onHistory || (() => handleTool('历史'))}
          className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100"
        >
          <History className="h-4 w-4" />
          <span>历史</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleTool('发布到阅文', true)}
          className="ml-2 rounded border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
        >
          发布/投稿至阅文
        </button>
        
        <button
          type="button"
          onClick={() => handleTool('发布到其他平台', true)}
          className="rounded border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
        >
          发布至其他平台
        </button>
        
        <Clock3 className="ml-1 h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default EditorToolbar;
