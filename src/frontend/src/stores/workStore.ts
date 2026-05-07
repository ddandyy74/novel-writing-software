import { create } from 'zustand';
import api from '../api/client';
import { useLocalWorkStore, LocalWork, LocalChapter } from './localWorkStore';
import { useAuthStore } from './authStore';

interface Work {
  id: string;
  userId: string;
  title: string;
  genre?: string;
  description?: string;
  tags: string[];
  status: string;
  wordCount: number;
  chapterCount: number;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  workId: string;
  title: string;
  content: string;
  wordCount: number;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkState {
  works: Work[];
  currentWork: Work | null;
  chapters: Chapter[];
  currentChapter: Chapter | null;
  isLoading: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  syncError?: string;

  loadWorks: () => Promise<void>;
  createWork: (data: { title: string; genre?: string; description?: string }) => Promise<Work | null>;
  selectWork: (workId: string) => Promise<void>;
  updateWork: (workId: string, data: Partial<Work>) => Promise<void>;
  deleteWork: (workId: string) => Promise<void>;

  loadChapters: (workId: string) => Promise<void>;
  createChapter: (workId: string, data: { title: string; content: string }) => Promise<Chapter | null>;
  selectChapter: (chapterId: string) => Promise<void>;
  updateChapter: (chapterId: string, data: { title?: string; content?: string }) => Promise<void>;
  deleteChapter: (chapterId: string) => Promise<void>;
  saveCurrentChapter: () => Promise<void>;

  clearCurrentWork: () => void;

  syncLocalToCloud: () => Promise<{ success: boolean; error?: string }>;
}

const convertLocalWorkToWork = (localWork: LocalWork): Work => ({
  id: localWork.id,
  userId: 'local',
  title: localWork.title,
  genre: localWork.genre,
  description: localWork.description,
  tags: [],
  status: 'draft',
  wordCount: localWork.wordCount,
  chapterCount: localWork.chapterCount,
  createdAt: localWork.createdAt,
  updatedAt: localWork.updatedAt,
});

const convertLocalChapterToChapter = (localChapter: LocalChapter): Chapter => ({
  id: localChapter.id,
  workId: localChapter.workId,
  title: localChapter.title,
  content: localChapter.content,
  wordCount: localChapter.wordCount,
  order: localChapter.order,
  status: 'draft',
  createdAt: localChapter.createdAt,
  updatedAt: localChapter.updatedAt,
});

export const useWorkStore = create<WorkState>((set, get) => ({
  works: [],
  currentWork: null,
  chapters: [],
  currentChapter: null,
  isLoading: false,
  syncStatus: 'idle',
  syncError: undefined,

  loadWorks: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const localWorks = useLocalWorkStore.getState().works;
      set({ works: localWorks.map(convertLocalWorkToWork), isLoading: false });
      return;
    }

    set({ isLoading: true });
    const response = await api.getWorks();
    if (response.code === 0 && response.data) {
      set({ works: response.data.items || [], isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  createWork: async (data) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const localWork = useLocalWorkStore.getState().createWork(data);
      const work = convertLocalWorkToWork(localWork);
      set((state) => ({ works: [...state.works, work] }));
      return work;
    }

    const response = await api.createWork(data);
    if (response.code === 0 && response.data) {
      const work = response.data as Work;
      set((state) => ({ works: [...state.works, work] }));
      return work;
    }
    return null;
  },

  selectWork: async (workId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const localWork = useLocalWorkStore.getState().works.find((w) => w.id === workId);
      if (localWork) {
        useLocalWorkStore.getState().selectWork(workId);
        const localChapters = useLocalWorkStore.getState().chapters;
        set({
          currentWork: convertLocalWorkToWork(localWork),
          chapters: localChapters
            .filter((c) => c.workId === workId)
            .map(convertLocalChapterToChapter),
          currentChapter: null,
        });
      }
      return;
    }

    set({ isLoading: true });
    const response = await api.getWork(workId);
    if (response.code === 0 && response.data) {
      set({ currentWork: response.data as Work, isLoading: false });
      await get().loadChapters(workId);
    } else {
      set({ isLoading: false });
    }
  },

  updateWork: async (workId, data) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      useLocalWorkStore.getState().updateWork(workId, data);
      set((state) => ({
        works: state.works.map((w) => (w.id === workId ? { ...w, ...data } : w)),
        currentWork: state.currentWork?.id === workId ? { ...state.currentWork, ...data } : state.currentWork,
      }));
      return;
    }

    const response = await api.updateWork(workId, data);
    if (response.code === 0) {
      set((state) => ({
        works: state.works.map((w) => (w.id === workId ? { ...w, ...data } : w)),
        currentWork: state.currentWork?.id === workId ? { ...state.currentWork, ...data } : state.currentWork,
      }));
    }
  },

  deleteWork: async (workId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      useLocalWorkStore.getState().deleteWork(workId);
      set((state) => ({
        works: state.works.filter((w) => w.id !== workId),
        currentWork: state.currentWork?.id === workId ? null : state.currentWork,
        chapters: state.currentWork?.id === workId ? [] : state.chapters,
        currentChapter: state.currentWork?.id === workId ? null : state.currentChapter,
      }));
      return;
    }

    const response = await api.deleteWork(workId);
    if (response.code === 0) {
      set((state) => ({
        works: state.works.filter((w) => w.id !== workId),
        currentWork: state.currentWork?.id === workId ? null : state.currentWork,
        chapters: state.currentWork?.id === workId ? [] : state.chapters,
        currentChapter: state.currentWork?.id === workId ? null : state.currentChapter,
      }));
    }
  },

  loadChapters: async (workId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const localChapters = useLocalWorkStore.getState().chapters.filter((c) => c.workId === workId);
      set({ chapters: localChapters.map(convertLocalChapterToChapter) });
      return;
    }

    const response = await api.getChapters(workId);
    if (response.code === 0 && response.data) {
      set({ chapters: response.data.items || [] });
    }
  },

  createChapter: async (workId, data) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const localChapter = useLocalWorkStore.getState().createChapter(workId, data);
      const chapter = convertLocalChapterToChapter(localChapter);
      set((state) => ({ chapters: [...state.chapters, chapter] }));
      
      const localWork = useLocalWorkStore.getState().works.find((w) => w.id === workId);
      if (localWork) {
        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId
              ? { ...w, chapterCount: localWork.chapterCount, wordCount: localWork.wordCount }
              : w
          ),
          currentWork:
            state.currentWork?.id === workId
              ? { ...state.currentWork, chapterCount: localWork.chapterCount, wordCount: localWork.wordCount }
              : state.currentWork,
        }));
      }
      return chapter;
    }

    const response = await api.createChapter(workId, {
      ...data,
      order: get().chapters.length + 1,
    });
    if (response.code === 0 && response.data) {
      const chapter = response.data as Chapter;
      set((state) => ({ chapters: [...state.chapters, chapter] }));
      return chapter;
    }
    return null;
  },

  selectChapter: async (chapterId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const { currentWork } = get();

    if (!currentWork) return;

    if (!isAuthenticated) {
      useLocalWorkStore.getState().selectChapter(chapterId);
      const localChapter = useLocalWorkStore.getState().currentChapter;
      if (localChapter) {
        set({ currentChapter: convertLocalChapterToChapter(localChapter) });
      }
      return;
    }

    const response = await api.getChapter(currentWork.id, chapterId);
    if (response.code === 0 && response.data) {
      set({ currentChapter: response.data as Chapter });
    }
  },

  updateChapter: async (chapterId, data) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const { currentWork } = get();

    if (!currentWork) return;

    if (!isAuthenticated) {
      useLocalWorkStore.getState().updateChapter(chapterId, data);
      const localChapter = useLocalWorkStore.getState().chapters.find((c) => c.id === chapterId);
      if (localChapter) {
        set((state) => ({
          chapters: state.chapters.map((c) =>
            c.id === chapterId ? convertLocalChapterToChapter(localChapter) : c
          ),
          currentChapter:
            state.currentChapter?.id === chapterId ? convertLocalChapterToChapter(localChapter) : state.currentChapter,
        }));

        const localWork = useLocalWorkStore.getState().works.find((w) => w.id === currentWork.id);
        if (localWork) {
          set((state) => ({
            works: state.works.map((w) =>
              w.id === currentWork.id ? { ...w, wordCount: localWork.wordCount } : w
            ),
            currentWork: { ...state.currentWork!, wordCount: localWork.wordCount },
          }));
        }
      }
      return;
    }

    const response = await api.updateChapter(currentWork.id, chapterId, data);
    if (response.code === 0) {
      set((state) => ({
        chapters: state.chapters.map((c) => (c.id === chapterId ? { ...c, ...data } : c)),
        currentChapter: state.currentChapter?.id === chapterId ? { ...state.currentChapter, ...data } : state.currentChapter,
      }));
    }
  },

  deleteChapter: async (chapterId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const { currentWork } = get();

    if (!currentWork) return;

    if (!isAuthenticated) {
      useLocalWorkStore.getState().deleteChapter(chapterId);
      set((state) => ({
        chapters: state.chapters.filter((c) => c.id !== chapterId),
        currentChapter: state.currentChapter?.id === chapterId ? null : state.currentChapter,
      }));

      const localWork = useLocalWorkStore.getState().works.find((w) => w.id === currentWork.id);
      if (localWork) {
        set((state) => ({
          works: state.works.map((w) =>
            w.id === currentWork.id
              ? { ...w, chapterCount: localWork.chapterCount, wordCount: localWork.wordCount }
              : w
          ),
          currentWork: { ...state.currentWork!, chapterCount: localWork.chapterCount, wordCount: localWork.wordCount },
        }));
      }
      return;
    }

    const response = await api.deleteChapter(currentWork.id, chapterId);
    if (response.code === 0) {
      set((state) => ({
        chapters: state.chapters.filter((c) => c.id !== chapterId),
        currentChapter: state.currentChapter?.id === chapterId ? null : state.currentChapter,
      }));
    }
  },

  saveCurrentChapter: async () => {
    const { currentWork, currentChapter } = get();
    if (!currentWork || !currentChapter) return;

    await get().updateChapter(currentChapter.id, {
      content: currentChapter.content,
    });
  },

  clearCurrentWork: () => {
    set({ currentWork: null, chapters: [], currentChapter: null });
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      useLocalWorkStore.getState().clearCurrentWork();
    }
  },

  syncLocalToCloud: async () => {
    const localWorks = useLocalWorkStore.getState().works;
    const localChapters = useLocalWorkStore.getState().chapters;

    if (localWorks.length === 0) {
      return { success: true };
    }

    set({ syncStatus: 'syncing', syncError: undefined });

    try {
      for (const localWork of localWorks) {
        const createWorkResponse = await api.createWork({
          title: localWork.title,
          genre: localWork.genre,
          description: localWork.description,
        });

        if (createWorkResponse.code !== 0 || !createWorkResponse.data) {
          throw new Error(`创建作品失败: ${localWork.title} - ${createWorkResponse.message || '未知错误'}`);
        }

        const cloudWork = createWorkResponse.data as Work;
        const workChapters = localChapters.filter((c) => c.workId === localWork.id);

        for (const localChapter of workChapters) {
          const createChapterResponse = await api.createChapter(cloudWork.id, {
            title: localChapter.title,
            content: localChapter.content,
            order: localChapter.order,
          });

          if (createChapterResponse.code !== 0) {
            console.error(`创建章节失败: ${localChapter.title}`);
          }
        }
      }

      useLocalWorkStore.getState().clearAll();
      set({ syncStatus: 'success' });

      return { success: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '同步失败';
      set({ syncStatus: 'error', syncError: errorMsg });
      return { success: false, error: errorMsg };
    }
  },
}));
