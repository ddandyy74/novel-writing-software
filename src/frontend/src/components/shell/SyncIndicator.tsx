import React from 'react';

interface SyncIndicatorProps {
  apiStatus: 'checking' | 'ok' | 'error';
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  isAuthenticated: boolean;
  saved: boolean;
  compact?: boolean;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  apiStatus,
  syncStatus,
  isAuthenticated,
  saved,
  compact = false,
}) => {
  const getStatus = () => {
    if (!saved) return { label: '本地实时保存中', color: 'bg-amber-400' };
    if (!isAuthenticated) return { label: '本地已保存，登录后同步', color: 'bg-slate-400' };
    if (apiStatus === 'checking') return { label: '云端检测中', color: 'bg-amber-400' };
    if (apiStatus === 'error') return { label: '云端暂不可用，本地已保存', color: 'bg-amber-500' };
    if (syncStatus === 'syncing') return { label: '云端同步中', color: 'bg-blue-500' };
    if (syncStatus === 'error') return { label: '云端同步失败，本地已保存', color: 'bg-red-500' };
    return { label: '云端已同步', color: 'bg-emerald-500' };
  };

  const status = getStatus();

  return (
    <div className={`flex items-center gap-2 text-xs text-slate-500 ${compact ? '' : 'px-2'}`}>
      <span className={`h-2 w-2 rounded-full ${status.color}`} />
      <span className="whitespace-nowrap">{status.label}</span>
    </div>
  );
};

export default SyncIndicator;
