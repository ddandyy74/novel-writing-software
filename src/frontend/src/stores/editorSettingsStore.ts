import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EditorTheme = 'default' | 'eye-care' | 'dark';

export interface EditorFontFamily {
  id: string;
  name: string;
  family: string;
}

export const fontFamilies: EditorFontFamily[] = [
  { id: 'songti', name: '宋体', family: 'Source Han Serif SC, Noto Serif SC, Songti SC, SimSun, serif' },
  { id: 'kaiti', name: '楷体', family: 'KaiTi, KaiTi_GB2312, serif' },
  { id: 'heiti', name: '黑体', family: 'Source Han Sans SC, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif' },
  { id: 'fangsong', name: '仿宋', family: 'FangSong, FangSong_GB2312, serif' },
  { id: 'lato', name: 'Lato', family: 'Lato, sans-serif' },
];

export const fontSizes = [12, 14, 16, 18, 20, 22, 24];

export const bgColors = [
  { id: 'default', name: '默认', color: '#ffffff' },
  { id: 'eye-care', name: '护眼', color: '#fffef5' },
  { id: 'sepia', name: '复古', color: '#f5f0e1' },
  { id: 'green', name: '淡绿', color: '#e8f5e9' },
  { id: 'blue', name: '淡蓝', color: '#e3f2fd' },
];

interface EditorSettingsState {
  theme: EditorTheme;
  fontFamily: string;
  fontSize: number;
  bgColor: string;
  lineHeight: number;
  showLineNumbers: boolean;
  
  setTheme: (theme: EditorTheme) => void;
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  setBgColor: (bgColor: string) => void;
  setLineHeight: (lineHeight: number) => void;
  toggleLineNumbers: () => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  theme: 'default' as EditorTheme,
  fontFamily: fontFamilies[0].family,
  fontSize: 18,
  bgColor: bgColors[0].color,
  lineHeight: 2.0,
  showLineNumbers: false,
};

export const useEditorSettingsStore = create<EditorSettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme: EditorTheme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },

      setFontFamily: (fontFamily: string) => {
        set({ fontFamily });
      },

      setFontSize: (fontSize: number) => {
        set({ fontSize });
      },

      setBgColor: (bgColor: string) => {
        set({ bgColor });
      },

      setLineHeight: (lineHeight: number) => {
        set({ lineHeight });
      },

      toggleLineNumbers: () => {
        set((state) => ({ showLineNumbers: !state.showLineNumbers }));
      },

      resetToDefaults: () => {
        set(defaultSettings);
        document.documentElement.setAttribute('data-theme', defaultSettings.theme);
      },
    }),
    {
      name: 'editor-settings-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
