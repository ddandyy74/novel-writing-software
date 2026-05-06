import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'default' | 'eye-care' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'default',
      
      setTheme: (theme: Theme) => {
        set({ theme });
        // 应用主题到 document
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // 恢复时应用主题
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
