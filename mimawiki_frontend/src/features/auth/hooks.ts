import { create } from 'zustand';

interface AuthStore {
  isLoggedIn: boolean;
  user: null | { nickname: string };
  login: (nickname: string, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: null,
  
  login: (nickname, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify({ nickname }));
    set({ isLoggedIn: true, user: { nickname } });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ isLoggedIn: false, user: null });
  },

  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ isLoggedIn: true, user: JSON.parse(user) });
    }
  },
}));