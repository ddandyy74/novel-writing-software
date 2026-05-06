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

// 统计字数
const countWords = (text: string): number => {
  // 移除空格和标点,统计汉字和英文单词
  const chinese = text.match(/[\u4e00-\u9fa5]/g) || [];
  const english = text.match(/[a-zA-Z]+/g) || [];
  return chinese.length + english.length;
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
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
