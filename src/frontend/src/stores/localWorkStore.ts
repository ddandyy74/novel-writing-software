import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocalWork {
  id: string;
  title: string;
  genre?: string;
  description?: string;
  wordCount: number;
  chapterCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalChapter {
  id: string;
  workId: string;
  title: string;
  content: string;
  wordCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface LocalWorkState {
  works: LocalWork[];
  currentWork: LocalWork | null;
  chapters: LocalChapter[];
  currentChapter: LocalChapter | null;

  createWork: (data: { title: string; genre?: string; description?: string }) => LocalWork;
  selectWork: (workId: string) => void;
  updateWork: (workId: string, data: Partial<LocalWork>) => void;
  deleteWork: (workId: string) => void;

  createChapter: (workId: string, data: { title: string; content: string }) => LocalChapter;
  selectChapter: (chapterId: string) => void;
  updateChapter: (chapterId: string, data: { title?: string; content?: string }) => void;
  deleteChapter: (chapterId: string) => void;

  clearCurrentWork: () => void;
  clearAll: () => void;

  getStorageSize: () => { used: number; available: number; percentage: number };
}

const generateId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const countWords = (text: string): number => {
  if (!text) return 0;
  const cleanText = text.replace(/\s+/g, '');
  const chinese = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const punctuation = (cleanText.match(/[，。！？；：""''【】《》\-\—\…\·、,.\!?;:\"\'\[\]<>]/g) || []).length;
  return chinese + punctuation;
};

export const useLocalWorkStore = create<LocalWorkState>()(
  persist(
    (set, get) => ({
      works: [],
      currentWork: null,
      chapters: [],
      currentChapter: null,

      createWork: (data) => {
        const now = new Date().toISOString();
        const work: LocalWork = {
          id: generateId(),
          title: data.title,
          genre: data.genre,
          description: data.description,
          wordCount: 0,
          chapterCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ works: [...state.works, work] }));
        return work;
      },

      selectWork: (workId) => {
        const work = get().works.find((w) => w.id === workId);
        if (work) {
          const workChapters = get().chapters.filter((c) => c.workId === workId);
          set({ currentWork: work, chapters: workChapters, currentChapter: null });
        }
      },

      updateWork: (workId, data) => {
        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId ? { ...w, ...data, updatedAt: new Date().toISOString() } : w
          ),
          currentWork:
            state.currentWork?.id === workId
              ? { ...state.currentWork, ...data, updatedAt: new Date().toISOString() }
              : state.currentWork,
        }));
      },

      deleteWork: (workId) => {
        set((state) => ({
          works: state.works.filter((w) => w.id !== workId),
          chapters: state.chapters.filter((c) => c.workId !== workId),
          currentWork: state.currentWork?.id === workId ? null : state.currentWork,
          currentChapter:
            state.currentChapter?.workId === workId ? null : state.currentChapter,
        }));
      },

      createChapter: (workId, data) => {
        const now = new Date().toISOString();
        const workChapters = get().chapters.filter((c) => c.workId === workId);
        const wordCount = countWords(data.content);

        const chapter: LocalChapter = {
          id: generateId(),
          workId,
          title: data.title,
          content: data.content,
          wordCount,
          order: workChapters.length + 1,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          chapters: [...state.chapters, chapter],
        }));

        get().updateWork(workId, {
          chapterCount: workChapters.length + 1,
          wordCount: get().works.find((w) => w.id === workId)!.wordCount + wordCount,
        });

        return chapter;
      },

      selectChapter: (chapterId) => {
        const chapter = get().chapters.find((c) => c.id === chapterId);
        if (chapter) {
          set({ currentChapter: chapter });
        }
      },

      updateChapter: (chapterId, data) => {
        const chapter = get().chapters.find((c) => c.id === chapterId);
        if (!chapter) return;

        const oldWordCount = chapter.wordCount;
        const newWordCount = data.content !== undefined ? countWords(data.content) : oldWordCount;
        const wordCountDiff = newWordCount - oldWordCount;

        set((state) => ({
          chapters: state.chapters.map((c) =>
            c.id === chapterId
              ? { ...c, ...data, wordCount: newWordCount, updatedAt: new Date().toISOString() }
              : c
          ),
          currentChapter:
            state.currentChapter?.id === chapterId
              ? {
                  ...state.currentChapter,
                  ...data,
                  wordCount: newWordCount,
                  updatedAt: new Date().toISOString(),
                }
              : state.currentChapter,
        }));

        if (wordCountDiff !== 0) {
          const work = get().works.find((w) => w.id === chapter.workId);
          if (work) {
            get().updateWork(work.id, {
              wordCount: work.wordCount + wordCountDiff,
            });
          }
        }
      },

      deleteChapter: (chapterId) => {
        const chapter = get().chapters.find((c) => c.id === chapterId);
        if (!chapter) return;

        set((state) => ({
          chapters: state.chapters.filter((c) => c.id !== chapterId),
          currentChapter: state.currentChapter?.id === chapterId ? null : state.currentChapter,
        }));

        const work = get().works.find((w) => w.id === chapter.workId);
        if (work) {
          get().updateWork(work.id, {
            chapterCount: work.chapterCount - 1,
            wordCount: work.wordCount - chapter.wordCount,
          });
        }
      },

      clearCurrentWork: () => {
        set({ currentWork: null, chapters: [], currentChapter: null });
      },

      clearAll: () => {
        set({ works: [], currentWork: null, chapters: [], currentChapter: null });
      },

      getStorageSize: () => {
        try {
          const stored = localStorage.getItem('local-work-storage');
          const used = stored ? new Blob([stored]).size : 0;
          const available = 5 * 1024 * 1024;
          return {
            used,
            available,
            percentage: Math.round((used / available) * 100),
          };
        } catch {
          return { used: 0, available: 5 * 1024 * 1024, percentage: 0 };
        }
      },
    }),
    {
      name: 'local-work-storage',
    }
  )
);
