import { create } from 'zustand';
import { Role, Profile } from './types';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: Profile | null;
  activeRole: Role;

  // Actions
  setUser: (user: Profile | null) => void;
  setAuthenticated: (status: boolean) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  setLang: (lang: 'en' | 'hi') => void;

  // UI State
  isDark: boolean;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false, // Default to logged out
  user: null,
  activeRole: 'resident',
  isDark: true,

  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
  
  switchRole: (role: Role) => {
    set((state) => ({
      activeRole: role,
      user: state.user ? { ...state.user, role } : null,
    }));
  },
  
  setLang: (lang) => {
    set((state) => ({
      user: state.user ? { ...state.user, lang_pref: lang } : null,
    }));
  },
  
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));
