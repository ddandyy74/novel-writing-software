import React from 'react';
import { BookPlus, FileDown, FileText, FolderOpen, Share2 } from 'lucide-react';
import GlobalSidebar from './GlobalSidebar';
import QuickActionCard from './QuickActionCard';
import WorkCard from './WorkCard';
import SyncIndicator from '@components/shell/SyncIndicator';

interface HomeUser {
  nickname?: string;
  email?: string;
}

interface HomeWork {
  id: string;
  title: string;
  chapterCount: number;
  wordCount: number;
  userId?: string;
}

interface WriterHomeProps {
  works: HomeWork[];
  user: HomeUser | null;
  isAuthenticated: boolean;
  apiStatus: 'checking' | 'ok' | 'error';
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  saved: boolean;
  onOpenWork: (workId: string) => void;
  onRenameWork: (workId: string) => void;
  onDeleteWork: (workId: string) => void;
  onCreateWork: () => void;
  onLogin: () => void;
  onComingSoon: (feature: string) => void;
  onPreferences?: () => void;
  onTrash?: () => void;
}

const WriterHome: React.FC<WriterHomeProps> = ({
  works,
  user,
  isAuthenticated,
  apiStatus,
  syncStatus,
  saved,
  onOpenWork,
  onRenameWork,
  onDeleteWork,
  onCreateWork,
  onLogin,
  onComingSoon,
  onPreferences,
  onTrash,
}) => (
  <div className="flex h-full bg-white text-slate-900">
    <GlobalSidebar
      user={user}
      isAuthenticated={isAuthenticated}
      onLogin={onLogin}
      onComingSoon={onComingSoon}
      onPreferences={onPreferences}
    />

    <main className="min-w-0 flex-1 overflow-auto bg-white px-10 py-6">
      <div className="mb-6 flex items-center justify-end">
        <SyncIndicator apiStatus={apiStatus} syncStatus={syncStatus} isAuthenticated={isAuthenticated} saved={saved} />
      </div>

      <section className="grid grid-cols-[440px_minmax(420px,1fr)] gap-4">
        <div className="relative h-[164px] overflow-hidden rounded-lg bg-gradient-to-br from-sky-400 via-sky-300 to-blue-100 p-8 shadow-sm">
          <div className="relative z-10">
            <div className="text-3xl font-bold tracking-wide text-slate-900">作家意见收集渠道</div>
            <div className="mt-3 text-2xl font-semibold text-slate-800">fankui@example.com</div>
          </div>
          <div className="absolute right-10 top-8 h-24 w-24 rotate-[-8deg] rounded-2xl bg-white/35 shadow-inner" />
          <div className="absolute bottom-4 left-1/2 h-2 w-6 rounded-full bg-white/80" />
        </div>

        <div className="grid grid-cols-[1fr_112px] gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-slate-900">做任务赚墨水 (1/22)</div>
              <button type="button" onClick={() => onComingSoon('邀请码')} className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50">
                填写邀请码
              </button>
            </div>
            <div className="mt-8 rounded bg-slate-50 px-6 py-4">
              <div className="text-sm font-semibold text-slate-900">每日码字超过<span className="text-blue-600">1000字</span>得5墨水</div>
              <div className="mt-1 text-sm text-slate-500">桌面端专属，还差 {Math.max(0, 1000 - works.reduce((sum, work) => sum + work.wordCount, 0))} 字</div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 text-center">
            <div className="text-sm font-bold text-slate-900">邀请用户</div>
            <div className="text-sm font-bold text-slate-900">奖励多多</div>
            <button type="button" onClick={() => onComingSoon('分享口令')} className="mt-4 rounded bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-700">
              分享口令
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-4 gap-4">
        <QuickActionCard title="新建" description="私密作品、阅文作品、分组" icon={<BookPlus className="h-4 w-4" />} accent="bg-blue-500" onClick={onCreateWork} expandable />
        <QuickActionCard title="导入" description="本地导入私密作品" icon={<FileDown className="h-4 w-4" />} accent="bg-green-500" onClick={() => onComingSoon('导入')} />
        <QuickActionCard title="投稿阅文" description="编辑直投，投稿后仅编辑可见" icon={<FolderOpen className="h-4 w-4" />} accent="bg-amber-500" onClick={() => onComingSoon('投稿阅文')} />
        <QuickActionCard title="模板中心" description="总纲、细纲、开头应有尽有" icon={<FileText className="h-4 w-4" />} accent="bg-purple-500" onClick={() => onComingSoon('模板中心')} />
      </section>

      <section className="mt-6">
        <div className="mb-7 flex items-center justify-between">
          <button type="button" className="text-sm font-semibold text-slate-900 hover:text-blue-600">全部作品 ▾</button>
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button type="button" onClick={() => onComingSoon('已隐藏')} className="hover:text-blue-600">已隐藏</button>
            <button type="button" onClick={onTrash || (() => onComingSoon('回收站'))} className="hover:text-blue-600">回收站</button>
          </div>
        </div>

        {works.length > 0 ? (
          <div className="flex flex-wrap gap-x-10 gap-y-8">
            {works.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                isAuthenticated={isAuthenticated}
                onOpen={onOpenWork}
                onDelete={onDeleteWork}
                onRename={onRenameWork}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-center">
            <Share2 className="h-10 w-10 text-slate-300" />
            <div className="mt-4 text-lg font-semibold text-slate-900">还没有作品，先创建一本开始写吧</div>
            <div className="mt-2 text-sm text-slate-500">支持本地创作，登录后自动同步到云端</div>
            <button type="button" onClick={onCreateWork} className="mt-5 rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              新建作品
            </button>
          </div>
        )}
      </section>
    </main>
  </div>
);

export default WriterHome;
