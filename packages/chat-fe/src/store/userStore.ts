import { create } from 'zustand';
import { User, Tokens } from '@chatx/types';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  userId: number | null;
  username: string | null;
  avatar: string | null;
  token: string | null;
  refreshToken: string | null;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setTokens: (tokens: Tokens) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      userId: null,
      username: null,
      avatar: null,
      token: null,
      refreshToken: null,

      setUser: user => set({ ...user }),
      setToken: token => set({ token }),
      setTokens: tokens => set({ ...tokens }),
      logout: () => set({ userId: null, username: null, avatar: null, token: null, refreshToken: null }),
    }),
    {
      name: 'user-storage', // 存储 key
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    }
  )
);

0.01