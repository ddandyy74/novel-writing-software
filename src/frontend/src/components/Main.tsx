import React, { useEffect, useState } from 'react';
import { useWorkStore } from '@stores/workStore';
import { useAuthStore } from '@stores/authStore';
import { useEditorStore } from '@stores/editorStore';
import { useLocalWorkStore } from '@stores/localWorkStore';
import Editor from '@editor/Editor';
import Login from '@components/Login';
import FeatureGate from '@components/FeatureGate';
import api from '../api/client';

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
    createChapter,
    selectChapter,
    saveCurrentChapter,
    syncStatus,
    syncError,
    syncLocalToCloud,
  } = useWorkStore();
  const { updateContent, content, markAsSaved, saved } = useEditorStore();
  const { getStorageSize } = useLocalWorkStore();

  const [showNewWork, setShowNewWork] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    loadWorks();
    checkApi();
  }, []);

  useEffect(() => {
    if (currentChapter) {
      updateContent(currentChapter.content);
    }
  }, [currentChapter]);

  const checkApi = async () => {
    try {
      const response = await api.healthCheck();
      setApiStatus(response.code === 0 ? 'ok' : 'error');
    } catch {
      setApiStatus('error');
    }
  };

  const handleCreateWork = async () => {
    if (!newWorkTitle.trim()) return;
    const work = await createWork({ title: newWorkTitle });
    if (work) {
      setNewWorkTitle('');
      setShowNewWork(false);
      selectWork(work.id);
    }
  };

  const handleCreateChapter = async () => {
    if (!currentWork || !newChapterTitle.trim()) return;
    const chapter = await createChapter(currentWork.id, {
      title: newChapterTitle,
      content: '',
    });
    if (chapter) {
      setNewChapterTitle('');
      setShowNewChapter(false);
      selectChapter(chapter.id);
    }
  };

  const handleContentChange = (newContent: string) => {
    updateContent(newContent);
  };

  const handleSave = async () => {
    if (!currentChapter) return;
    await saveCurrentChapter();
    markAsSaved();
  };

  const handleLoginSuccess = async () => {
    const result = await syncLocalToCloud();
    if (result.success) {
      loadWorks();
    }
  };

  const storageInfo = getStorageSize();

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <div className="h-12 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-light)] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            网文作者码字软件
          </h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                apiStatus === 'ok' ? 'bg-green-500' : apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`}
            />
            <span className="text-xs text-[var(--color-text-secondary)]">
              API: {apiStatus === 'ok' ? '正常' : apiStatus === 'error' ? '异常' : '检测中'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {user?.nickname || user?.email}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                退出
              </button>
            </>
          ) : (
            <span className="text-sm text-[var(--color-text-secondary)]">未登录</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-light)] flex flex-col">
          <div className="p-3 border-b border-[var(--color-border-light)]">
            <button
              onClick={() => setShowNewWork(true)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
            >
              + 新建作品
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {works.map((work) => (
              <div
                key={work.id}
                onClick={() => selectWork(work.id)}
                className={`p-3 cursor-pointer border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-tertiary)] ${
                  currentWork?.id === work.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium text-sm text-[var(--color-text-primary)] truncate">
                  {work.title}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {work.chapterCount} 章 · {work.wordCount} 字
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[var(--color-border-light)]">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <div className="text-xs text-[var(--color-text-secondary)]">
                  本地存储: {storageInfo.percentage}%
                </div>
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded flex items-center justify-center gap-2"
                >
                  <span>🔐</span>
                  <span>登录 / 注册</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-[var(--color-text-secondary)]">
                  👤 {user?.nickname}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  📧 {user?.email}
                </div>
                {syncStatus === 'syncing' && (
                  <div className="text-xs text-blue-600">同步中...</div>
                )}
                {syncStatus === 'error' && (
                  <div className="text-xs text-red-600">{syncError}</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-64 bg-[var(--color-bg-primary)] border-r border-[var(--color-border-light)] flex flex-col">
          {currentWork ? (
            <>
              <div className="p-3 border-b border-[var(--color-border-light)]">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  {currentWork.title}
                </h3>
                <button
                  onClick={() => setShowNewChapter(true)}
                  className="mt-2 w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded"
                >
                  + 新建章节
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    onClick={() => selectChapter(chapter.id)}
                    className={`p-3 cursor-pointer border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-secondary)] ${
                      currentChapter?.id === chapter.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-sm text-[var(--color-text-primary)]">
                      {chapter.title}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {chapter.wordCount} 字
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-secondary)]">
              请选择作品
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {currentChapter ? (
            <>
              <div className="h-10 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-light)] flex items-center justify-between px-4">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {currentChapter.title}
                </span>
                <div className="flex items-center gap-3">
                  <FeatureGate feature="AI大纲生成" onLoginClick={() => setShowLogin(true)}>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded">
                      AI 大纲
                    </button>
                  </FeatureGate>
                  <FeatureGate feature="错别字检测" onLoginClick={() => setShowLogin(true)}>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded">
                      错别字检测
                    </button>
                  </FeatureGate>
                  <FeatureGate feature="多平台发布" onLoginClick={() => setShowLogin(true)}>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded">
                      发布
                    </button>
                  </FeatureGate>
                  <span className={`text-xs ${saved ? 'text-green-600' : 'text-orange-500'}`}>
                    {saved ? '已保存' : '未保存'}
                  </span>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                  >
                    保存
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor content={content} onChange={handleContentChange} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)]">
              请选择章节开始创作
            </div>
          )}
        </div>
      </div>

      {showNewWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-primary)] rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">新建作品</h3>
            <input
              type="text"
              value={newWorkTitle}
              onChange={(e) => setNewWorkTitle(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded mb-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
              placeholder="作品标题"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewWork(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                取消
              </button>
              <button
                onClick={handleCreateWork}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-primary)] rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">新建章节</h3>
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded mb-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
              placeholder="章节标题"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewChapter(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                取消
              </button>
              <button
                onClick={handleCreateChapter}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Main;
