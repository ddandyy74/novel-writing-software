import React, { useEffect, useState } from 'react';
import { useWorkStore } from '@stores/workStore';
import { useAuthStore } from '@stores/authStore';
import { useEditorStore } from '@stores/editorStore';
import { useUpdater } from '@hooks/useUpdater';
import { useFullscreen, useFullscreenShortcut } from '@hooks/useFullscreen';
import Login from '@components/Login';
import WriterHome from '@components/home/WriterHome';
import AppTabs from '@components/shell/AppTabs';
import WriterWorkspace from '@components/workspace/WriterWorkspace';
import PreferencesModal from '@components/editor/PreferencesModal';
import RenameWorkModal from '@components/editor/RenameWorkModal';
import TrashModal from '@components/editor/TrashModal';
import api from '../api/client';

type ViewMode = 'home' | 'workspace';

const Main: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const {
    works,
    currentWork,
    chapters,
    currentChapter,
    loadWorks,
    createWork,
    selectWork,
    updateWork,
    deleteWork,
    createChapter,
    selectChapter,
    updateChapter,
    syncStatus,
    syncError,
    syncLocalToCloud,
  } = useWorkStore();
  const {
    updateContent,
    content,
    markAsSaved,
    saved,
    chapterWords,
    cursorLine,
    cursorColumn,
  } = useEditorStore();
  const { updateAvailable, downloading, downloadedBytes, downloadAndInstall } = useUpdater();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showNewWork, setShowNewWork] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [showLogin, setShowLogin] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [renamingWorkId, setRenamingWorkId] = useState<string | null>(null);

  useFullscreenShortcut(toggleFullscreen);

  useEffect(() => {
    loadWorks();
    checkApi();
  }, []);

  useEffect(() => {
    if (isAuthenticated || bootstrapped || works.length > 0) return;

    const bootstrapLocalDraft = async () => {
      const work = await createWork({ title: '未命名作品' });
      if (!work) return;

      const chapter = await createChapter(work.id, {
        title: '第一章',
        content: '',
      });

      await selectWork(work.id);
      if (chapter) {
        await selectChapter(chapter.id);
      }
      setBootstrapped(true);
    };

    bootstrapLocalDraft();
  }, [isAuthenticated, bootstrapped, works.length]);

  useEffect(() => {
    if (!currentChapter) return;
    updateContent(currentChapter.content);
    markAsSaved();
  }, [currentChapter]);

  useEffect(() => {
    if (!currentChapter || saved) return;

    const timeoutId = window.setTimeout(() => {
      handleSave();
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [content, currentChapter?.id, saved]);

  const checkApi = async () => {
    try {
      const response = await api.healthCheck();
      const data = response as any;
      setApiStatus(data.status === 'ok' || data.code === 0 ? 'ok' : 'error');
    } catch {
      setApiStatus('error');
    }
  };

  const openWork = async (workId: string) => {
    await selectWork(workId);
    const state = useWorkStore.getState();
    const firstChapter = state.currentChapter || state.chapters[0];
    if (firstChapter) {
      await selectChapter(firstChapter.id);
    }
    setViewMode('workspace');
  };

  const handleCreateWork = async () => {
    if (!newWorkTitle.trim()) return;

    const work = await createWork({ title: newWorkTitle.trim() });
    if (!work) return;

    const chapter = await createChapter(work.id, {
      title: '第一章',
      content: '',
    });

    setNewWorkTitle('');
    setShowNewWork(false);
    await selectWork(work.id);
    if (chapter) {
      await selectChapter(chapter.id);
    }
    setViewMode('workspace');
  };

  const handleCreateChapter = async () => {
    if (!currentWork) return;

    const title = newChapterTitle.trim() || `第${chapters.length + 1}章`;
    const chapter = await createChapter(currentWork.id, {
      title,
      content: '',
    });

    if (chapter) {
      setNewChapterTitle('');
      setShowNewChapter(false);
      await selectChapter(chapter.id);
      setViewMode('workspace');
    }
  };

  const handleRenameWork = async (workId: string) => {
    setRenamingWorkId(workId);
  };

  const confirmRenameWork = async (title: string) => {
    if (!renamingWorkId) return;

    await updateWork(renamingWorkId, { title } as any);
    setRenamingWorkId(null);
  };

  const handleDeleteWork = async (workId: string) => {
    const work = works.find((item) => item.id === workId);
    const confirmed = window.confirm(`确定删除《${work?.title || '该作品'}》吗？删除后可在回收站查看。`);
    if (!confirmed) return;

    await deleteWork(workId);
    if (currentWork?.id === workId) {
      setViewMode('home');
    }
  };

  const handleContentChange = (newContent: string) => {
    updateContent(newContent);
  };

  const handleSave = async () => {
    if (!currentChapter) return;
    await updateChapter(currentChapter.id, { content });
    markAsSaved();
  };

  const handleLoginSuccess = async () => {
    await checkApi();
    const result = await syncLocalToCloud();
    if (result.success) {
      await loadWorks();
      setViewMode('home');
    }
  };

  const handleRefresh = async () => {
    await checkApi();
    await loadWorks();
  };

  const handleCloseWorkTab = () => {
    setViewMode('home');
  };

  const handleLogout = async () => {
    await logout();
    setViewMode('home');
    await loadWorks();
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-900">
      <AppTabs
        activeView={viewMode}
        currentWork={currentWork}
        apiStatus={apiStatus}
        syncStatus={syncStatus}
        isAuthenticated={isAuthenticated}
        saved={saved}
        onHomeClick={() => setViewMode('home')}
        onWorkClick={() => currentWork && setViewMode('workspace')}
        onCloseWork={handleCloseWorkTab}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
      />

      <div className="min-h-0 flex-1">
        {viewMode === 'home' ? (
          <WriterHome
            works={works}
            user={user}
            isAuthenticated={isAuthenticated}
            apiStatus={apiStatus}
            syncStatus={syncStatus}
            saved={saved}
            onOpenWork={openWork}
            onRenameWork={handleRenameWork}
            onDeleteWork={handleDeleteWork}
            onCreateWork={() => setShowNewWork(true)}
            onLogin={() => setShowLogin(true)}
            onComingSoon={setComingSoonFeature}
            onPreferences={() => setShowPreferences(true)}
            onTrash={() => setShowTrash(true)}
          />
        ) : (
          <WriterWorkspace
            currentWork={currentWork}
            chapters={chapters}
            currentChapter={currentChapter}
            content={content}
            chapterWords={chapterWords}
            cursorLine={cursorLine}
            cursorColumn={cursorColumn}
            isAuthenticated={isAuthenticated}
            isFullscreen={isFullscreen}
            onSelectChapter={selectChapter}
            onCreateChapter={() => setShowNewChapter(true)}
            onContentChange={handleContentChange}
            onSave={handleSave}
            onLogin={() => setShowLogin(true)}
            onToggleFullscreen={toggleFullscreen}
            onComingSoon={setComingSoonFeature}
          />
        )}
      </div>

      {syncStatus === 'error' && syncError && (
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded bg-red-600 px-4 py-2 text-sm text-white shadow-lg">
          {syncError}
        </div>
      )}

      {showNewWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">新建作品</h3>
            <input
              type="text"
              value={newWorkTitle}
              onChange={(event) => setNewWorkTitle(event.target.value)}
              className="mb-4 w-full rounded border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
              placeholder="作品标题"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleCreateWork();
              }}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowNewWork(false)} className="rounded px-4 py-2 text-slate-600 hover:bg-slate-100">
                取消
              </button>
              <button type="button" onClick={handleCreateWork} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">新建章节</h3>
            <input
              type="text"
              value={newChapterTitle}
              onChange={(event) => setNewChapterTitle(event.target.value)}
              className="mb-4 w-full rounded border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
              placeholder={`第${chapters.length + 1}章`}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleCreateChapter();
              }}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowNewChapter(false)} className="rounded px-4 py-2 text-slate-600 hover:bg-slate-100">
                取消
              </button>
              <button type="button" onClick={handleCreateChapter} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {comingSoonFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-80 rounded-lg bg-white p-6 text-center shadow-xl">
            <div className="text-lg font-semibold text-slate-900">{comingSoonFeature}</div>
            <div className="mt-2 text-sm text-slate-500">该功能将在后续版本开放</div>
            <button type="button" onClick={() => setComingSoonFeature(null)} className="mt-5 rounded bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700">
              知道了
            </button>
          </div>
        </div>
      )}

      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />

      <PreferencesModal isOpen={showPreferences} onClose={() => setShowPreferences(false)} />

      <RenameWorkModal
        isOpen={!!renamingWorkId}
        initialTitle={works.find((work) => work.id === renamingWorkId)?.title || ''}
        onClose={() => setRenamingWorkId(null)}
        onConfirm={confirmRenameWork}
      />

      <TrashModal
        isOpen={showTrash}
        onClose={() => setShowTrash(false)}
        onRestore={() => {
          loadWorks();
        }}
      />

      {updateAvailable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <div className="text-center">
              <div className="mb-3 text-4xl">↑</div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">发现新版本</h3>
              <p className="mb-4 text-sm text-slate-500">v{updateAvailable.version} 已发布，建议立即更新</p>
              {downloading && (
                <div className="mb-4">
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div className="h-2 w-full animate-pulse rounded-full bg-blue-600" />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">下载中... {(downloadedBytes / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              )}
              <div className="flex justify-center gap-2">
                <button type="button" onClick={() => window.location.reload()} className="rounded px-4 py-2 text-slate-600 hover:bg-slate-100" disabled={downloading}>
                  稍后提醒
                </button>
                <button type="button" onClick={downloadAndInstall} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50" disabled={downloading}>
                  {downloading ? '更新中...' : '立即更新'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
