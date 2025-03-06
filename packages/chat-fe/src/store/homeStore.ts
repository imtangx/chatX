import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface HomeState {
  activeDialog: string | null;
  activeMenuItem: string;
  setActiveDialog: (username: string) => void;
  setActiveMenuItem: (menuItem: string) => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    set => ({
      activeDialog: null,
      activeMenuItem: 'chat',
      setActiveDialog: username => {
        set({ activeDialog: username });
      },
      setActiveMenuItem: menuItem => {
        set({ activeMenuItem: menuItem });
      },
    }),
    {
      name: 'home-storage', // 存储 key
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    }
  )
);
