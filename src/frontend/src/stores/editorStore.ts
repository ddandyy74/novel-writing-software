import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorState {
  // 内容
  content: string;
  
  // 字数统计
  totalWords: number;
  chapterWords: number;
  todayWords: number;
  
  // 光标位置
  cursorLine: number;
  cursorColumn: number;
  
  // 保存状态
  saved: boolean;
  lastSaveTime: Date | null;
  
  // Actions
  updateContent: (content: string) => void;
  updateCursorPosition: (line: number, column: number) => void;
  markAsSaved: () => void;
  markAsUnsaved: () => void;
}

interface WordCountResult {
  chinese: number;
  english: number;
  punctuation: number;
  total: number;
}

const countWords = (text: string): number => {
  if (!text) return 0;
  
  const cleanText = text.replace(/\s+/g, '');
  
  const chinese = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const punctuation = (cleanText.match(/[，。！？；：""''【】《》\-\—\…\·、,.\!?;:\"\'\[\]<>]/g) || []).length;
  
  return chinese + punctuation;
};

export const countWordsDetailed = (text: string): WordCountResult => {
  if (!text) {
    return { chinese: 0, english: 0, punctuation: 0, total: 0 };
  }
  
  const cleanText = text.replace(/\s+/g, '');
  
  const chinese = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (cleanText.match(/[a-zA-Z]+/g) || []).length;
  const punctuation = (cleanText.match(/[，。！？；：""''【】《》\-\—\…\·、,.\!?;:\"\'\[\]<>]/g) || []).length;
  
  const total = chinese + punctuation;
  
  return { chinese, english, punctuation, total };
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      content: '',
      totalWords: 0,
      chapterWords: 0,
      todayWords: 0,
      cursorLine: 1,
      cursorColumn: 1,
      saved: true,
      lastSaveTime: null,

      updateContent: (content: string) => {
        const wordCount = countWords(content);
        set({
          content,
          chapterWords: wordCount,
          saved: false,
        });
      },

      updateCursorPosition: (line: number, column: number) => {
        set({ cursorLine: line, cursorColumn: column });
      },

      markAsSaved: () => {
        set({
          saved: true,
          lastSaveTime: new Date(),
        });
      },

      markAsUnsaved: () => {
        set({ saved: false });
      },
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        content: state.content,
        todayWords: state.todayWords,
      }),
    }
  )
);
