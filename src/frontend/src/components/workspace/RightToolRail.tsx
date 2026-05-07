import React from 'react';
import { BookOpenText, CheckCircle2, Feather, Lightbulb, PenTool, Settings2, Sparkles, UsersRound } from 'lucide-react';

interface RightToolRailProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onComingSoon: (feature: string) => void;
}

const tools = [
  { label: '校对', icon: CheckCircle2, auth: true, dot: true },
  { label: '拼字', icon: PenTool },
  { label: '大纲', icon: BookOpenText, auth: true },
  { label: '角色', icon: UsersRound, dot: true },
  { label: '设定', icon: Settings2 },
  { label: '灵感', icon: Lightbulb, auth: true, dot: true },
  { label: '双栏', icon: Feather, dot: true },
  { label: '妙笔', icon: Sparkles, auth: true },
];

const RightToolRail: React.FC<RightToolRailProps> = ({ isAuthenticated, onLogin, onComingSoon }) => {
  const handleTool = (label: string, auth?: boolean) => {
    if (auth && !isAuthenticated) {
      onLogin();
      return;
    }
    onComingSoon(label);
  };

  return (
    <aside className="flex w-12 flex-none flex-col items-center border-l border-slate-200 bg-white py-3">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button key={tool.label} type="button" onClick={() => handleTool(tool.label, tool.auth)} className="relative mb-3 flex w-11 flex-col items-center gap-1 rounded py-1.5 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <Icon className="h-4 w-4" />
            <span>{tool.label}</span>
            {tool.dot && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
          </button>
        );
      })}
    </aside>
  );
};

export default RightToolRail;
