import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Home, LogOut, RefreshCw, Settings, X } from 'lucide-react';
import SyncIndicator from './SyncIndicator';

interface TabWork {
  id: string;
  title: string;
}

interface AppTabsProps {
  activeView: 'home' | 'workspace';
  currentWork: TabWork | null;
  apiStatus: 'checking' | 'ok' | 'error';
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  isAuthenticated: boolean;
  saved: boolean;
  onHomeClick: () => void;
  onWorkClick: () => void;
  onCloseWork: () => void;
  onRefresh: () => void;
  onLogout?: () => void;
}

const AppTabs: React.FC<AppTabsProps> = ({
  activeView,
  currentWork,
  apiStatus,
  syncStatus,
  isAuthenticated,
  saved,
  onHomeClick,
  onWorkClick,
  onCloseWork,
  onRefresh,
  onLogout,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSettingsMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettingsMenu]);

  const handleLogout = () => {
    setShowSettingsMenu(false);
    onLogout?.();
  };

  return (
    <header className="flex h-10 flex-none items-center justify-between border-b border-slate-200 bg-[#e9edf3] px-3">
      <div className="flex h-full items-end gap-1">
        <button
          type="button"
          onClick={onHomeClick}
          className={`flex h-9 items-center gap-2 rounded-t-lg border px-4 text-sm transition ${
            activeView === 'home'
              ? 'border-slate-200 border-b-white bg-white font-medium text-slate-900'
              : 'border-transparent bg-transparent text-slate-500 hover:bg-white/60 hover:text-slate-900'
          }`}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-500 text-white">
            <Home className="h-3 w-3" />
          </span>
          作家助手
        </button>

        {currentWork && (
          <button
            type="button"
            onClick={onWorkClick}
            className={`group flex h-9 max-w-[220px] items-center gap-2 rounded-t-lg border px-4 text-sm transition ${
              activeView === 'workspace'
                ? 'border-slate-200 border-b-white bg-white font-medium text-slate-900'
                : 'border-transparent bg-transparent text-slate-500 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <span className="flex h-4 w-4 flex-none items-center justify-center rounded bg-blue-600 text-white">
              <BookOpen className="h-3 w-3" />
            </span>
            <span className="truncate">{currentWork.title}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onCloseWork();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  onCloseWork();
                }
              }}
              className="ml-1 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <SyncIndicator apiStatus={apiStatus} syncStatus={syncStatus} isAuthenticated={isAuthenticated} saved={saved} compact />
        <button type="button" onClick={onRefresh} className="rounded p-1 text-slate-500 hover:bg-white hover:text-slate-900">
          <RefreshCw className="h-4 w-4" />
        </button>
        <div ref={settingsRef} className="relative">
          <button
            type="button"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="rounded p-1 text-slate-500 hover:bg-white hover:text-slate-900"
          >
            <Settings className="h-4 w-4" />
          </button>
          {showSettingsMenu && (
            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              ) : (
                <div className="px-3 py-2 text-center text-xs text-slate-400">暂无设置项</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppTabs;
