import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';

interface User {
  userId: string;
  email: string;
  nickname: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, nickname: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.login(email, password);

        if (response.code === 0 && response.data) {
          set({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true,
          });

          const userResponse = await api.getCurrentUser();
          if (userResponse.code === 0 && userResponse.data) {
            set({ user: userResponse.data as User });
          }

          return { success: true };
        }

        return { success: false, error: response.message };
      },

      register: async (email: string, password: string, nickname: string) => {
        const response = await api.register(email, password, nickname);

        if (response.code === 0 && response.data) {
          set({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true,
          });

          const userResponse = await api.getCurrentUser();
          if (userResponse.code === 0 && userResponse.data) {
            set({ user: userResponse.data as User });
          }

          return { success: true };
        }

        return { success: false, error: response.message };
      },

      logout: async () => {
        const { refreshToken } = get();
        await api.logout(refreshToken || undefined);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        const response = await api.refreshToken(refreshToken);
        if (response.code === 0 && response.data) {
          set({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          });
          return true;
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        return false;
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

api.setTokenGetter(() => useAuthStore.getState().accessToken);
api.setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});
