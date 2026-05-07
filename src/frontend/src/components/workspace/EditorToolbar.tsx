import React from 'react';
import {
  BookOpen,
  Clock3,
  Expand,
  FileText,
  History,
  Image,
  Mic,
  Paintbrush,
  Redo2,
  Search,
  Type,
  Undo2,
  UserRound,
  Wand2,
} from 'lucide-react';

interface EditorToolbarProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onComingSoon: (feature: string) => void;
}

const leftTools = [
  { label: '字体', icon: Type },
  { label: '背景', icon: Paintbrush },
  { label: '撤销', icon: Undo2 },
  { label: '重做', icon: Redo2 },
  { label: '一键排版', icon: FileText },
  { label: '插入', icon: BookOpen },
  { label: '输入', icon: Mic, dot: true },
];

const rightTools = [
  { label: '全屏', icon: Expand },
  { label: '闪关', icon: Wand2, dot: true },
  { label: '查找替换', icon: Search },
  { label: '取名', icon: UserRound, auth: true },
  { label: '画师', icon: Image, auth: true, dot: true },
  { label: '历史', icon: History },
];

const EditorToolbar: React.FC<EditorToolbarProps> = ({ isAuthenticated, onLogin, onComingSoon }) => {
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
        {leftTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button key={tool.label} type="button" onClick={() => handleTool(tool.label)} className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100">
              <Icon className="h-4 w-4" />
              <span>{tool.label}</span>
              {tool.dot && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        {rightTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button key={tool.label} type="button" onClick={() => handleTool(tool.label, tool.auth)} className="relative flex h-8 items-center gap-1.5 rounded px-2 hover:bg-slate-100">
              <Icon className="h-4 w-4" />
              <span>{tool.label}</span>
              {tool.dot && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
            </button>
          );
        })}
        <button type="button" onClick={() => handleTool('发布到阅文', true)} className="ml-2 rounded border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
          发布/投稿至阅文
        </button>
        <button type="button" onClick={() => handleTool('发布到其他平台', true)} className="rounded border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
          发布至其他平台
        </button>
        <Clock3 className="ml-1 h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default EditorToolbar;
