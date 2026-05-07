import React from 'react';
import {
  Bell,
  BarChart3,
  BookOpen,
  Droplets,
  GraduationCap,
  Gift,
  MessageCircle,
  PenLine,
  Shirt,
  Users,
  Wand2,
} from 'lucide-react';

interface SidebarUser {
  nickname?: string;
  email?: string;
}

interface GlobalSidebarProps {
  user: SidebarUser | null;
  isAuthenticated: boolean;
  onLogin: () => void;
  onComingSoon: (feature: string) => void;
  onPreferences?: () => void;
}

const navItems = [
  { label: '小说作品', icon: BookOpen, active: true },
  { label: '短剧剧本', icon: PenLine },
  { label: '码字统计', icon: BarChart3 },
  { label: '码字好友', icon: Users },
  { label: '阅创学堂', icon: GraduationCap },
  { label: '神助社区', icon: Wand2 },
  { label: '任务中心', icon: Bell },
  { label: '墨水商店', icon: Droplets },
  { label: '邀请卡', icon: Gift },
  { label: '装扮中心', icon: Shirt },
  { label: '消息通知', icon: MessageCircle, dot: true },
];

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  user,
  isAuthenticated,
  onLogin,
  onComingSoon,
  onPreferences,
}) => (
  <aside className="flex w-[180px] flex-none flex-col border-r border-slate-200 bg-[#f3f5f8]">
    <button type="button" onClick={isAuthenticated ? undefined : onLogin} className="px-4 pb-8 pt-8 text-center">
      <div className="writer-avatar mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm">
        {isAuthenticated ? (user?.nickname?.slice(0, 1) || user?.email?.slice(0, 1) || '作') : '作'}
      </div>
      <div className="mt-3 truncate text-sm font-medium text-slate-800">
        {isAuthenticated ? user?.nickname || user?.email : '本地作者'}
      </div>
    </button>

    <nav className="flex-1 space-y-1 px-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => !item.active && onComingSoon(item.label)}
            className={`writer-nav-item relative flex h-9 w-full items-center gap-3 rounded px-6 text-sm transition ${
              item.active ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {item.dot && <span className="absolute right-5 h-1.5 w-1.5 rounded-full bg-red-500" />}
          </button>
        );
      })}
    </nav>

    <div className="flex h-12 items-center justify-around border-t border-slate-200 text-slate-500">
      <button type="button" onClick={onPreferences || (() => onComingSoon('偏好设置'))} className="text-xs hover:text-slate-900">设置</button>
      <button type="button" onClick={() => onComingSoon('客服帮助')} className="text-xs hover:text-slate-900">帮助</button>
      <button type="button" onClick={() => onComingSoon('同步工具')} className="text-xs hover:text-slate-900">同步</button>
    </div>
  </aside>
);

export default GlobalSidebar;
